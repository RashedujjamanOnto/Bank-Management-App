using BankManagement.Data;
using BankManagement.Enums;
using BankManagement.Model;
using BankManagement.ViewModel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly BankDbContext _context;

        public LoanController(BankDbContext context)
        {
            _context = context;
        }
        [HttpPost("ApplyLoan")]
        public IActionResult ApplyLoan([FromBody] ApplyLoan request)
        {
            // Check if all the fields are valid
            if (request.Amount <= 0)
            {
                return BadRequest("Invalid loan details.");
            }

            // Create loan object
            var loan = new Loan
            {
                Amount = request.Amount,     // Add InterestRate
                LoanType = (LoanType)request.LoanType,
                ApplicationDate = DateTime.Now,
                Remarks = request.Remarks,  // Add DurationInMonths
                Status = "Pending",   // Initial status is "Pending"
                UserId = request.UserId
            };

            // Save loan in database
            _context.Loans.Add(loan);
            _context.SaveChanges();

            return Ok("Loan application successful.");
        }

        [HttpGet("GetUserLoans/{userId}")]
        public IActionResult GetUserLoans(int userId)
        {
            var loans = _context.Loans
                .Where(l => l.UserId == userId)
                .Select(l => new LoanData
                {
                    LoanId = l.LoanId,
                    Amount = l.Amount,
                    LoanType = l.LoanType.ToString(),
                    InterestRate = l.InterestRate,
                    DurationInMonths = l.DurationInMonths,
                    Status = l.Status,
                    Remarks = l.Remarks,
                    ApplicationDate = l.ApplicationDate,
                    TotalRepayableAmount = l.TotalRepayableAmount,
                    MonthlyInstallment = l.MonthlyInstallment
                })
                .ToList();

            if (!loans.Any())
                return NotFound("No loans found for this user.");

            return Ok(loans);
        }

        [Authorize(Roles = "Administrator,Manager")]
        [HttpGet("GetLoans")]
        public IActionResult GetLoans()
        {
            var loans = _context.Loans
                .Select(l => new LoanData
                {
                    LoanId = l.LoanId,
                    CustomerName = _context.Users.FirstOrDefault(c => c.Id == l.UserId).Name,
                    Amount = l.Amount,
                    LoanType = l.LoanType.ToString(),
                    InterestRate = l.InterestRate,
                    DurationInMonths = l.DurationInMonths,
                    Status = l.Status,
                    Remarks = l.Remarks,
                    ApplicationDate = l.ApplicationDate,
                    TotalRepayableAmount = l.TotalRepayableAmount,
                    MonthlyInstallment = l.MonthlyInstallment
                })
                .ToList();
            return Ok(loans);
        }



        [HttpPut("ReviewLoan")]
        public IActionResult ReviewLoan([FromBody] ReviewLoan review)
        {
            var loan = _context.Loans.FirstOrDefault(l => l.LoanId == review.LoanId);
            if (loan == null)
                return NotFound("Loan not found.");

            if (review.Status != "Approved" && review.Status != "Rejected")
                return BadRequest("Invalid status.");

            loan.Status = review.Status;
            loan.Remarks = review.Remarks;
            loan.DurationInMonths = review.DurationInMonths;
            loan.InterestRate = review.InterestRate;
            _context.SaveChanges();

            // If approved, generate repayment schedule
            if (review.Status == "Approved")
            {
                var repaymentScheduleResult = GenerateRepaymentSchedule(loan.LoanId); // Trigger the repayment schedule generation
                if (repaymentScheduleResult != null)
                {
                    return Ok($"Loan has been {review.Status.ToLower()} and repayment schedule generated.");
                }
            }

            return Ok($"Loan has been {review.Status.ToLower()}.");
        }

        // Generate Repayment Schedule Method
        private IActionResult GenerateRepaymentSchedule(int loanId)
        {
            var loan = _context.Loans.Include(l => l.User).FirstOrDefault(l => l.LoanId == loanId);

            if (loan == null)
                return NotFound("Loan not found.");

            var totalAmount = loan.Amount + (loan.Amount * loan.InterestRate * loan.DurationInMonths / 1200);
            var monthlyInstallment = totalAmount / loan.DurationInMonths;

            var repaymentSchedules = new List<LoanRepaymentSchedule>();

            for (int i = 1; i <= loan.DurationInMonths; i++)
            {
                repaymentSchedules.Add(new LoanRepaymentSchedule
                {
                    LoanId = loanId,
                    DueDate = DateTime.Now.AddMonths(i),
                    AmountDue = monthlyInstallment,
                    Penalty = 0,
                    IsPaid = false
                });
            }

            _context.LoanRepaymentSchedules.AddRange(repaymentSchedules);
            _context.SaveChanges();

            return Ok("Repayment schedule generated.");
        }

        [HttpGet("GetRepaymentScheduleWithPenalties/{loanId}")]
        public IActionResult GetRepaymentScheduleWithPenalties(int loanId)
        {
            var schedules = _context.LoanRepaymentSchedules
                .Where(s => s.LoanId == loanId)
                .Select(s => new
                {
                    s.ScheduleId,
                    s.LoanId,
                    s.DueDate,
                    s.AmountDue,
                    Penalty = s.IsPaid || s.DueDate > DateTime.Now ? 0 : (DateTime.Now - s.DueDate).Days * 10, // $10/day penalty
                    s.IsPaid
                }).ToList();

            return Ok(schedules);
        }

        [HttpPost("PayInstallment")]
        public async Task<IActionResult> PayInstallment(PayInstallmentData data)
        {
            var schedule = await _context.LoanRepaymentSchedules.FirstOrDefaultAsync(rs => rs.ScheduleId == data.ScheduleId && rs.LoanId == data.LoanId); ;

            if (schedule == null || schedule.IsPaid)
            {
                return BadRequest("Invalid schedule or already paid.");
            }

            schedule.IsPaid = true; // Mark as paid
            await _context.SaveChangesAsync();

            return Ok("Installment paid successfully.");
        }


    }
}

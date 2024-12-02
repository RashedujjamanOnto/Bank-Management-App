using BankManagement.Data;
using BankManagement.Model;
using BankManagement.Repository.Interface;
using BankManagement.Repository.Manager;
using BankManagement.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterestAndSavingsController : ControllerBase
    {
        private readonly IAccountManager accountManager;
        private readonly ISavingsPlansManager savingsPlansManager;
        private readonly BankDbContext _context;

        public InterestAndSavingsController(BankDbContext context)
        {
            accountManager = new AccountManager(context);
            savingsPlansManager = new SavingsPlansManager(context);
            _context = context;
        }
        [HttpPost("CalculateInterest")]
        public IActionResult CalculateInterest()
        {
            var accounts = accountManager.GetSavingAccount();

            foreach (var account in accounts)
            {
                // Calculate Monthly Interest
                var monthsElapsed = (DateTime.Now - account.LastInterestCreditedDate).Days / 30;
                if (monthsElapsed > 0)
                {
                    var interest = (account.Balance * account.InterestRate / 100) * monthsElapsed;
                    account.Balance += interest;
                    account.LastInterestCreditedDate = DateTime.Now;

                    // Log transaction
                    _context.Transactions.Add(new Transaction
                    {
                        AccountId = account.AccountId,
                        Amount = interest,
                        TransactionType = Enums.TransactionType.Interest,
                        TransactionDate = DateTime.Now
                    });
                }
            }

            _context.SaveChanges();
            return Ok("Interest calculated and credited.");
        }


        [HttpGet("GetSavingsPlans")]
        public IActionResult GetSavingsPlans()
        {
            var plans = _context.SavingsPlans.ToList();
            return Ok(plans);
        }

        [HttpPost("EnrollSavingsPlan")]
        public IActionResult EnrollSavingsPlan([FromBody] SavingsPlanRequest request)
        {
            var plan = savingsPlansManager.GetById(request.PlanId);
            if (plan == null) return NotFound("Savings plan not found.");

            var account = accountManager.GetById(request.AccountId);
            if (account == null) return NotFound("Account not found.");

            if (request.Amount < plan.MinimumAmount)
                return BadRequest("Amount is less than the minimum required.");

            // Deduct initial deposit
            account.Balance -= request.Amount;

            // Add entry to savings plan table
            _context.SavingsPlanEnrollments.Add(new SavingsPlanEnrollment
            {
                AccountId = account.AccountId,
                PlanId = plan.Id,
                Amount = request.Amount,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddMonths(plan.DurationInMonths)
            });

            _context.SaveChanges();
            return Ok("Savings plan enrollment successful.");
        }

    }
}

using BankManagement.Data;
using BankManagement.Model;
using BankManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly BankDbContext _context;

        public TransactionController(BankDbContext context)
        {
            _context = context;
        }

        [HttpPost("Deposit")]
        public IActionResult Deposit([FromBody] TransactionDto request)
        {
            const double DAILY_LIMIT = 50000; // Daily transaction limit
            var today = DateTime.Now.Date;
            var account = _context.Accounts.FirstOrDefault(a => a.AccountId == request.AccountId);

            if (account == null)
                return NotFound("Account not found.");

            if (account.AccountType == "Loan")
                return BadRequest("Cannot deposit into a Loan account.");

            // Calculate today's total transactions for the account
            var todayTotal = _context.Transactions
                .Where(t => t.AccountId == request.AccountId && t.TransactionDate.Date == today)
                .Sum(t => t.Amount);

            if (todayTotal + request.Amount > DAILY_LIMIT)
            {
                return BadRequest($"Daily transaction limit of {DAILY_LIMIT} exceeded.");
            }

            // Process Deposit
            var transaction = new Transaction
            {
                AccountId = request.AccountId,
                TransactionType = Enums.TransactionType.Deposit,
                Amount = request.Amount,
                TransactionDate = DateTime.Now,
                Description = request.Description
            };

            _context.Transactions.Add(transaction);

            if (account != null)
            {
                account.Balance += request.Amount;
            }
            _context.SaveChanges();

            return Ok("Deposit successful.");
        }


        [HttpPost("Withdraw")]
        public IActionResult Withdraw([FromBody] TransactionDto request)
        {
            const double WITHDRAWAL_FEE_PERCENTAGE = 1.0; // 1% fee
            var account = _context.Accounts.FirstOrDefault(a => a.AccountId == request.AccountId);

            if (account == null)
                return NotFound("Account not found.");

            if (account.Balance < request.Amount)
                return BadRequest("Insufficient balance.");

            // Check monthly limit for Checking accounts
            if (account.AccountType == "Checking")
            {
                var totalWithdrawalsThisMonth = _context.Transactions
                    .Where(t => t.AccountId == request.AccountId && t.TransactionType.ToString() == "Withdraw" && t.TransactionDate.Month == DateTime.Now.Month)
                    .Sum(t => t.Amount);

                if (totalWithdrawalsThisMonth + request.Amount > 10000)
                    return BadRequest("Monthly withdrawal limit exceeded.");
            }

            if (account.AccountType == "Savings")
            {
                var withdrawalsThisMonth = _context.Transactions
                    .Count(t => t.AccountId == request.AccountId && t.TransactionType.ToString() == "Withdraw" && t.TransactionDate.Month == DateTime.Now.Month);

                if (withdrawalsThisMonth >= 6)
                    return BadRequest("Monthly withdrawal limit reached for Savings account.");
            }

            // Calculate Fee
            var fee = request.Amount * (WITHDRAWAL_FEE_PERCENTAGE / 100);
            var totalAmount = request.Amount + fee;

            if (account.Balance < totalAmount)
                return BadRequest("Insufficient balance.");

            // Deduct balance
            account.Balance -= totalAmount;

            // Add transaction
            var transaction = new Transaction
            {
                AccountId = request.AccountId,
                TransactionType = Enums.TransactionType.Withdrawal,
                Amount = request.Amount,
                TransactionDate = DateTime.Now,
                Description = request.Description,
                Fee = fee
            };

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            return Ok("Withdrawal successful.");
        }

        [HttpPost("RepayLoan/{scheduleId}")]
        public IActionResult RepayLoan(int scheduleId)
        {
            var schedule = _context.LoanRepaymentSchedules.FirstOrDefault(s => s.ScheduleId == scheduleId);

            if (schedule == null || schedule.IsPaid)
                return BadRequest("Invalid repayment schedule.");

            schedule.IsPaid = true;
            _context.SaveChanges();

            return Ok("Loan installment paid successfully.");
        }

        [HttpPost("Transfer")]
        public IActionResult Transfer([FromBody] TransferDto request)
        {
            // Validate Source Account
            var sourceAccount = _context.Accounts.FirstOrDefault(a => a.AccountId == request.SourceAccountId);
            if (sourceAccount == null)
                return NotFound("Source account not found.");

            // Validate Target Account
            var targetAccount = _context.Accounts.FirstOrDefault(a => a.AccountNumber == request.TargetAccountNumber);
            if (targetAccount == null)
                return NotFound("Target account not found.");

            // Check sufficient balance
            if (sourceAccount.Balance < request.Amount)
                return BadRequest("Insufficient balance in source account.");

            // Perform Transfer
            sourceAccount.Balance -= request.Amount;
            targetAccount.Balance += request.Amount;

            // Create Transactions
            var sourceTransaction = new Transaction
            {
                AccountId = sourceAccount.AccountId,
                TargetAccountNumber = request.TargetAccountNumber,
                TransactionType = Enums.TransactionType.Transfer,
                Amount = request.Amount,
                Description = request.Description,
                TargetBankName = "Internal Bank",
                TransactionDate = DateTime.Now,
            };

            var targetTransaction = new Transaction
            {
                AccountId = targetAccount.AccountId,
                TargetAccountNumber = request.TargetAccountNumber,
                TransactionType = Enums.TransactionType.Transfer,
                TargetBankName = "Internal Bank",
                Description = request.Description,
                Amount = request.Amount,
                TransactionDate = DateTime.Now,
            };

            _context.Transactions.Add(sourceTransaction);
            _context.Transactions.Add(targetTransaction);
            _context.SaveChanges();

            return Ok("Internal transfer successful.");
        }

        [HttpPost("ExternalTransfer")]
        public IActionResult ExternalTransfer([FromBody] ExternalTransferRequest request)
        {
            // Validate Source Account
            var sourceAccount = _context.Accounts.FirstOrDefault(a => a.AccountId == request.FromAccountId);
            if (sourceAccount == null)
                return NotFound("Source account not found.");

            // Check sufficient balance
            double transactionFee = 50.0; // Example fee
            double totalAmount = request.Amount + transactionFee;

            if (sourceAccount.Balance < totalAmount)
                return BadRequest("Insufficient balance for transfer and fee.");

            // Deduct amount from source account
            sourceAccount.Balance -= totalAmount;

            // Log the external transfer
            var transaction = new Transaction
            {
                AccountId = sourceAccount.AccountId,
                TargetAccountNumber = request.TargetAccountNumber,
                TransactionType = Enums.TransactionType.ExternalTransfer,
                Amount = request.Amount,
                Fee = transactionFee,
                TransactionDate = DateTime.Now,
                TargetBankName = request.TargetBankName,
                Description = request.Description,
            };

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            return Ok("External transfer successful.");
        }




        [HttpGet("GetTransactionHistory/{accountId}")]
        [Authorize]
        public IActionResult GetTransactionHistory(int accountId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value; // Fetch logged-in user role
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Fetch logged-in user ID


            var transactions = _context.Transactions
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.TransactionDate).Select(t => new TransactionHistory
                {
                    Amount = t.Amount,
                    Description = t.Description,
                    TargetAccountNumber = t.TargetAccountNumber,
                    TargetBankName = t.TargetBankName,
                    Fee = t.Fee,
                    TransactionDate = t.TransactionDate,
                    TransactionType = t.TransactionType.ToString()
                }).ToList();

            if (!transactions.Any())
                return NoContent();

            return Ok(transactions);

        }

        [HttpGet("VerifyAccount/{accountNumber}")]
        public IActionResult VerifyAccount(string accountNumber)
        {
            var account = _context.Accounts.FirstOrDefault(a => a.AccountNumber == accountNumber);

            if (account == null)
                return NotFound("No account found with this number.");

            var customer = _context.Users.FirstOrDefault(u => u.Id == account.UserId);

            return Ok(new
            {
                Name = customer?.Name,
                Email = customer?.Email,
                AccountType = account.AccountType
            });
        }

    }
}

using BankManagement.Data;
using BankManagement.Model;
using BankManagement.Repository.Interface;
using BankManagement.Repository.Manager;
using BankManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountManager accountManager;
        private readonly IUserManager userManager;
        private readonly BankDbContext _context;

        public AccountController(BankDbContext context)
        {
            accountManager = new AccountManager(context);
            userManager = new UserManager(context);
            _context = context;
        }


        [HttpGet("GetAccounts/{selfUserId}")]
        public IActionResult GetAccounts(int selfUserId)
        {
            var roleId = _context.Users.FirstOrDefault(c => c.Id == selfUserId).RoleId;
            if (roleId == 2)
            {

                var selfAccounts = _context.Accounts
                    .Where(a => a.UserId == selfUserId && a.IsActive)
                       .Select(a => new
                       {
                           a.AccountId,
                           a.AccountNumber
                       }).ToList();
                return Ok(selfAccounts);
            }
            var accounts = _context.Accounts
                       .Select(a => new
                       {
                           a.AccountId,
                           a.AccountNumber,
                           a.AccountType,
                           a.Balance,
                           a.Currency,
                           a.UserId,
                           a.IsActive,
                           UserName = _context.Users.FirstOrDefault(u => u.Id == a.UserId).Name 
                       }).ToList();
            return Ok(accounts);
        }

        [HttpGet("GetLoanAccount/{selfUserId}")]
        public IActionResult GetLoanAccount(int selfUserId)
        {
            var loanAccount = accountManager.GetLoanAccountByUserId(selfUserId);
            if (loanAccount == null)
            {
                return NotFound("Your loan account not found. Please create your loan account");
            }
            return Ok(loanAccount);
        }
        
        [HttpGet("GetAllLoanAccounts")]
        [Authorize(Roles = "Administrator, BankEmployee")]
        public IActionResult GetAllLoanAccounts()
        {
            var loanAccount = accountManager.GetLoanAccount();
            if (loanAccount == null)
            {
                return NotFound("Loan account not found. Please create loan account first");
            }
            return Ok(loanAccount);
        }

        [Authorize(Roles = "Administrator, BankEmployee")]
        [HttpPost("CreateAccount")]
        public IActionResult CreateAccount([FromBody] AccountDto accountDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var accountNumber = GenerateAccountNumber();

            var account = new Account
            {
                AccountType = accountDto.AccountType,
                Balance = accountDto.Balance,
                UserId = accountDto.UserId,
                Currency = accountDto.Currency ?? "USD",
                AccountNumber = accountNumber,
                IsActive = true
            };

            _context.Accounts.Add(account);
            _context.SaveChanges();

            return Ok("Account created successfully.");
        }
        [HttpPut("UpdateAccount/{id}")]
        [Authorize(Roles = "Administrator, BankEmployee")]
        public IActionResult UpdateAccount(int id, [FromBody] AccountDto accountDto)
        {
            var account = accountManager.GetById(id);
            if (account == null)
            {
                return NotFound("Account not found.");
            }

            account.AccountType = accountDto.AccountType ?? account.AccountType;
            if (accountDto.Balance > 0)
            {
                account.Balance = accountDto.Balance;
            }
            account.Currency = accountDto.Currency ?? account.Currency;

            _context.SaveChanges();

            return Ok("Account updated successfully.");
        }

        [HttpDelete("DeleteAccount/{id}")]
        [Authorize(Roles = "Administrator, BankEmployee")]
        public IActionResult DeleteAccount(int id)
        {
            var account = accountManager.GetById(id);
            if (account == null)
            {
                return NotFound("Account not found.");
            }

            _context.Accounts.Remove(account);
            _context.SaveChanges();

            return Ok("Account deleted successfully.");
        }

        [HttpGet("GetAccountDetails/{id}")]
        [Authorize(Roles = "Administrator, BankEmployee")]
        public IActionResult GetAccountDetails(int id)
        {
            var account = accountManager.GetById(id);
            if (account == null)
            {
                return NoContent(); 
            }

            var customer = userManager.GetById(account.UserId);
            if (customer == null)
            {
                return NoContent(); 
            }

            var transactions = _context.Transactions
                .Where(t => t.AccountId == id)
                .Select(t => new TransactionHistory
                {
                    TransactionType = t.TransactionType.ToString(),
                    TargetAccountNumber = t.TargetAccountNumber,
                    TargetBankName = t.TargetBankName,
                    Amount = t.Amount,
                    Fee = t.Fee,
                    TransactionDate = t.TransactionDate,
                    Description = t.Description,
                }).ToList();

            var accountDetails = new AccountDetails
            {
                AccountNumber = account.AccountNumber,
                AccountType = account.AccountType,
                Balance = account.Balance,
                Currency = account.Currency,
                Name = customer.Name,
                Email = customer.Email,
                RoleName = _context.UserRoles.FirstOrDefault(r => r.Id == customer.RoleId).RoleName ?? null,
                Transaction = transactions
            };

            return Ok(accountDetails);
        }


        [HttpGet("GetUsers")]
        [Authorize(Roles = "Administrator , BankEmployee")]
        public IActionResult GetUsers()
        {
            var users = userManager.GetAll();

            return Ok(users);
        }

        [HttpPut("ToggleAccountStatus/{id}")]
        [Authorize(Roles = "Administrator, BankEmployee")]
        public IActionResult ToggleAccountStatus(int id, [FromBody] UpdateAccountStatusDto statusDto)
        {
            var account = accountManager.GetById(id);

            if (account == null)
                return NotFound("Account not found.");

            account.IsActive = statusDto.IsActive;
            _context.SaveChanges();
            return Ok($"Account status updated to {(account.IsActive ? "Active" : "Deactive")}.");
        }


        private string GenerateAccountNumber()
        {
            var random = new Random();
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss"); 
            var randomNumber = random.Next(1000, 9999); 
            return $"{timestamp}{randomNumber}"; 
        }

    }
}

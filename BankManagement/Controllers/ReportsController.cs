using BankManagement.Data;
using BankManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly BankDbContext _context;

        public ReportsController(BankDbContext context)
        {
            _context = context;
        }

        // API to get monthly statements for a specific account
        [HttpGet("GetTransactions")]
        public async Task<IActionResult> GetTransactions(int accountId, int month, int year)
        {
            var transactions = await _context.Transactions
                .Where(t => t.AccountId == accountId && t.TransactionDate.Month == month && t.TransactionDate.Year == year)
                .Select(t => new TransactionHistory
                {
                    TransactionDate = t.TransactionDate,
                    Description = t.Description,
                    Amount = t.Amount,
                    TransactionType = t.TransactionType.ToString(),
                })
                .ToListAsync();

            if (transactions == null || !transactions.Any())
            {
                return NotFound("No transactions found for the selected month and year.");
            }

            return Ok(transactions);
        }

        [HttpGet("ExportTransactions")]
        public async Task<IActionResult> ExportTransactions(int accountId, int month, int year)
        {
            var transactions = await _context.Transactions
                .Where(t => t.AccountId == accountId && t.TransactionDate.Month == month && t.TransactionDate.Year == year)
                .ToListAsync();

            if (!transactions.Any())
            {
                return NotFound("No transactions found for the selected month and year.");
            }

            // শুধু ডাটা পাঠানো
            return Ok(transactions);
        }


        // API to get detailed reports of all users' accounts and transactions
        [HttpGet("GetDetailedReports")]
        [Authorize(Roles = "Administrator, BankEmployee")]
        public async Task<IActionResult> GetDetailedReports()
        {
            var reports = await _context.Accounts
                .Select(account => new
                {
                    account.AccountNumber,
                    TotalBalance = account.Balance,
                    LoanBalance = _context.Loans.Where(c=>c.AccountId == account.AccountId).Sum(l => l.Amount),
                    TransactionCount = _context.Transactions.Where(c => c.AccountId == account.AccountId).Count()
                })
                .ToListAsync();

            return Ok(reports);
        }
    }
}

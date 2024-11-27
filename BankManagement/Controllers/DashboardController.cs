using BankManagement.Data;
using BankManagement.Model;
using BankManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly BankDbContext _context;

        public DashboardController(BankDbContext dbContext)
        {
            _context = dbContext;
        }
        // Admin Dashboard API
        [Authorize(Roles = "Administrator, BankEmployee")]
        [HttpGet("AdminDashboard")]
        public IActionResult AdminDashboard()
        {
            var totalTransactions = _context.Transactions.Count();
            var totalDeposits = _context.Transactions.Where(t => t.TransactionType == Enums.TransactionType.Deposit).Sum(t => t.Amount);
            var totalLoans = _context.Loans.Where(t => true).Sum(t => t.Amount);
            var activeUsers = _context.Users.Count(u => u.IsActive);

            return Ok(new { totalTransactions, totalDeposits, totalLoans, activeUsers });
        }

        // User Dashboard API
        [Authorize(Roles = "Customer")]
        [HttpGet("UserDashboard/{userId}")]
        public IActionResult UserDashboard(int userId)
        {
            var recentTransactions = _context.Transactions.Where(t => t.Account.UserId == userId).OrderByDescending(t => t.TransactionDate).Take(5).Select(c => new TransactionHistory
            {
                Amount = c.Amount,
                TransactionDate = c.TransactionDate,
                TransactionType = c.TransactionType.ToString()
            }

            ).ToList();
            var currentBalance = _context.Transactions.Where(t => t.Account.UserId == userId)
                                                      .GroupBy(t => t.Account.UserId)
                                                      .Select(g => g.Sum(t => t.TransactionType == Enums.TransactionType.Deposit ? t.Amount : -t.Amount))
                                                      .FirstOrDefault();

            return Ok(new { recentTransactions, currentBalance });
        }
    }
}

using BankManagement.Model;
using Microsoft.EntityFrameworkCore;

namespace BankManagement.Data
{
    public class BankDbContext:DbContext
    {
        public BankDbContext(DbContextOptions<BankDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
        public DbSet<OtpEntry> OtpEntries { get; set; }
        public DbSet<LoanRepaymentSchedule> LoanRepaymentSchedules { get; set; }
    }

}

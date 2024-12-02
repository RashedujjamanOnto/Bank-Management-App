using BankManagement.Data;
using BankManagement.Model;
using BankManagement.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace BankManagement.Repository.Manager
{
    public class AccountManager : CommonRepository<Account>, IAccountManager
    {
        public AccountManager(BankDbContext context) : base(context)
        {
        }

        public Account GetById(int id)
        {
            return GetFirstOrDefault(c=>c.AccountId == id);
        }

        public ICollection<Account> GetLoanAccount()
        {
            return GetAll(c => c.IsActive && c.AccountType == "Loan");
        }
        public ICollection<Account> GetSavingAccount()
        {
            return GetAll(c => c.IsActive && c.AccountType == "Savings");
        }

        public ICollection<Account> GetLoanAccountByUserId(int userId)
        {
            return GetAll(c=>c.IsActive && c.UserId == userId && c.AccountType == "Loan");
        }
    }
}

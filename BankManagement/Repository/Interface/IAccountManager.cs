using BankManagement.Model;

namespace BankManagement.Repository.Interface
{
    public interface IAccountManager: ICommonRepository<Account>
    {
        ICollection<Account> GetLoanAccountByUserId(int userId);
        ICollection<Account> GetLoanAccount();
        ICollection<Account> GetSavingAccount();
        Account GetById(int id);
    }
}

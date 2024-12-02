using BankManagement.Model;
using BankManagement.Repository.Manager;

namespace BankManagement.Repository.Interface
{
    public interface IUserManager:ICommonRepository<User>
    {
        User GetById(int id);
        ICollection<User> GetAll();
    }
}

using BankManagement.Data;
using BankManagement.Model;
using BankManagement.Repository.Interface;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace BankManagement.Repository.Manager
{
    public class UserManager : CommonRepository<User>, IUserManager
    {
        public UserManager(BankDbContext context) : base(context)
        {

        }

        public ICollection<User> GetAll()
        {
            return GetAll(c => true);
        }

        public User GetById(int id)
        {
            return GetFirstOrDefault(x => x.Id == id);
        }
    }
}

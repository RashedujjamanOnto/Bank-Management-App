using BankManagement.Data;
using BankManagement.Model;
using BankManagement.Repository.Interface;

namespace BankManagement.Repository.Manager
{
    public class SavingsPlansManager:CommonRepository<SavingsPlan>, ISavingsPlansManager
    {
        public SavingsPlansManager(BankDbContext context) : base(context) { }

        public SavingsPlan GetById(int id)
        {
            return GetFirstOrDefault(c=>c.Id == id);
        }
    }
}

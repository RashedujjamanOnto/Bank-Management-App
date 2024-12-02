using BankManagement.Model;

namespace BankManagement.Repository.Interface
{
    public interface ISavingsPlansManager:ICommonRepository<SavingsPlan>
    {
        SavingsPlan GetById(int id);
    }
}

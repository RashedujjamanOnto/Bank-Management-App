using System.Linq.Expressions;

namespace BankManagement.Repository.Interface
{
    public interface ICommonRepository<T> where T : class
    {
        ICollection<T> GetAll(Expression<Func<T, bool>> filter = null);
        T GetFirstOrDefault(Expression<Func<T, bool>> filter);
        void Add(T entity);
        void Update(T entity);
        void Delete(int id);
        void Delete(Expression<Func<T, bool>> filter);
    }
}

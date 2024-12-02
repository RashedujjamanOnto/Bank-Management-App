using BankManagement.Data;
using BankManagement.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BankManagement.Repository.Manager
{
    public class CommonRepository<T> : ICommonRepository<T> where T : class
    {
        private readonly BankDbContext _context;
        private readonly DbSet<T> _dbSet;

        public CommonRepository(BankDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        // Get all data or filtered data
        public ICollection<T> GetAll(Expression<Func<T, bool>> filter = null)
        {
            if (filter != null)
            {
                return _dbSet.Where(filter).ToList();
            }
            return _dbSet.ToList();
        }

        // Get single data by condition
        public T GetFirstOrDefault(Expression<Func<T, bool>> filter)
        {
            return _dbSet.FirstOrDefault(filter);
        }

        // Add new entity
        public void Add(T entity)
        {
            _dbSet.Add(entity);
            _context.SaveChanges();
        }

        // Update existing entity
        public void Update(T entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        // Delete entity by id
        public void Delete(int id)
        {
            var entity = _dbSet.Find(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                _context.SaveChanges();
            }
        }

        // Delete entity by condition
        public void Delete(Expression<Func<T, bool>> filter)
        {
            var entities = _dbSet.Where(filter).ToList();
            if (entities.Any())
            {
                _dbSet.RemoveRange(entities);
                _context.SaveChanges();
            }
        }
    }
}

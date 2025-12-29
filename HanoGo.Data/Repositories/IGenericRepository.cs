using HanoGo.Data.Abstractions; // Gọi Interface từ folder bên cạnh
using HanoGo.Data.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HanoGo.Data.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly TravelDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(TravelDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }
        // ... (Các hàm Implement y hệt cũ, chỉ khác namespace) ...
        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
        public async Task AddAsync(T entity) { await _dbSet.AddAsync(entity); await _context.SaveChangesAsync(); }
        public async Task UpdateAsync(T entity) { _dbSet.Update(entity); await _context.SaveChangesAsync(); }
        public async Task DeleteAsync(int id) { var e = await _dbSet.FindAsync(id); if (e != null) { _dbSet.Remove(e); await _context.SaveChangesAsync(); } }
    }
}
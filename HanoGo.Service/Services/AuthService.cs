using HanoGo.Data.Context;
using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HanoGo.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly TravelDbContext _context; // Truy cập DB trực tiếp để check Login cho lẹ

        public AuthService(TravelDbContext context)
        {
            _context = context;
        }

        public async Task<User?> LoginAsync(LoginDto loginDto)
        {
            // Tìm user theo username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null) return null;

            // Kiểm tra pass (Demo: So sánh trực tiếp)
            if (user.PasswordHash != loginDto.Password) return null;

            return user;
        }
    }
}
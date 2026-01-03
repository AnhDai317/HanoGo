using HanoGo.Data.Context;
using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace HanoGo.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly TravelDbContext _context;

        public AuthService(TravelDbContext context)
        {
            _context = context;
        }

        // --- ĐĂNG NHẬP ---
        public async Task<User?> LoginAsync(LoginDto loginDto)
        {
            // 1. Tìm user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null) return null;

            // 2. Kiểm tra mật khẩu (So sánh plain text theo database của bạn)
            if (user.PasswordHash != loginDto.Password) return null;

            return user;
        }

        // --- ĐĂNG KÝ (Đã sửa) ---
        public async Task<User> RegisterAsync(string username, string password, string email)
        {
            // 1. Kiểm tra username đã tồn tại chưa
            var exists = await _context.Users.AnyAsync(u => u.Username == username);
            if (exists)
            {
                throw new Exception("Tài khoản đã tồn tại!");
            }

            // 2. Tạo User mới (Khớp với bảng Users trong Database)
            var newUser = new User
            {
                Username = username,
                PasswordHash = password, // Lưu ý: Nên mã hóa password nếu có thể sau này
                Email = email,
                Role = 0,                // 0: Customer (theo SQL script của bạn)
                IsPremium = false,
                CreatedAt = DateTime.Now
                // Không còn dòng FullName = ...
            };

            // 3. Lưu vào DB
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
    }
}
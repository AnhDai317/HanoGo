using HanoGo.Data.Context;
using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using Microsoft.EntityFrameworkCore; // Nhớ dòng này để dùng .FirstOrDefaultAsync
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

            // 2. Kiểm tra mật khẩu (Lưu ý: Thực tế nên mã hóa, ở đây so sánh text thường theo DB của bạn)
            if (user.PasswordHash != loginDto.Password) return null;

            return user;
        }

        // --- ĐĂNG KÝ ---
        public async Task<User> RegisterAsync(string username, string password, string email, string fullName)
        {
            // 1. Kiểm tra username đã tồn tại chưa
            var exists = await _context.Users.AnyAsync(u => u.Username == username);
            if (exists)
            {
                throw new Exception("Tài khoản đã tồn tại!");
            }

            // 2. Tạo User mới
            var newUser = new User
            {
                Username = username,
                PasswordHash = password, // Lưu pass vào cột PasswordHash
                Email = email,           // Cột Email (bắt buộc trong DB của bạn)
                Role = 1,                // Mặc định Role = 1 (User thường)
                IsPremium = false,
                CreatedAt = DateTime.Now
                // Lưu ý: User.cs của bạn chưa có cột FullName, nếu DB chưa có thì bỏ qua dòng gán FullName
                // Hoặc nếu bạn muốn lưu tạm vào đâu đó thì tùy chỉnh. 
            };

            // 3. Lưu vào DB
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
    }
}
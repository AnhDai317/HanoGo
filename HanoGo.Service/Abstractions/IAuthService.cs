using HanoGo.Data.Entities;
using HanoGo.Service.Dtos; // Đảm bảo namespace này đúng
using System.Threading.Tasks;

namespace HanoGo.Service.Abstractions
{
    public interface IAuthService
    {
        // Hàm đăng nhập
        Task<User?> LoginAsync(LoginDto loginDto);

        // Hàm đăng ký (Trả về User nếu thành công, ném Exception nếu lỗi)
        Task<User> RegisterAsync(string username, string password, string email, string fullName);
    }
}
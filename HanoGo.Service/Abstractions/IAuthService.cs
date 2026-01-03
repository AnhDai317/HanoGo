using HanoGo.Data.Entities;
using HanoGo.Service.Dtos;
using System.Threading.Tasks;

namespace HanoGo.Service.Abstractions
{
    public interface IAuthService
    {
        // Giữ nguyên hàm Login
        Task<User?> LoginAsync(LoginDto loginDto);

        // Sửa hàm Register: Bỏ tham số string fullName
        Task<User> RegisterAsync(string username, string password, string email);
    }
}
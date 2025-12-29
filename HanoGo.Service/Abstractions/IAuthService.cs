using HanoGo.Data.Entities;
using HanoGo.Service.Dtos;
using System.Threading.Tasks;

namespace HanoGo.Service.Abstractions
{
    public interface IAuthService
    {
        Task<User?> LoginAsync(LoginDto loginDto);
    }
}
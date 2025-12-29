using HanoGo.Service.Dtos;
using System.Threading.Tasks;

namespace HanoGo.Service.Abstractions
{
    public interface IUserLogService
    {
        Task LogActivityAsync(LogDto logDto);
    }
}
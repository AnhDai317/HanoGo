using HanoGo.Data.Abstractions;
using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using System;
using System.Threading.Tasks;

namespace HanoGo.Service.Services
{
    public class UserLogService : IUserLogService
    {
        private readonly IGenericRepository<UserLog> _repository;

        public UserLogService(IGenericRepository<UserLog> repository)
        {
            _repository = repository;
        }

        public async Task LogActivityAsync(LogDto logDto)
        {
            var log = new UserLog
            {
                UserId = logDto.UserId == 0 ? null : logDto.UserId,
                PlaceId = logDto.PlaceId,
                ActionType = logDto.ActionType,
                TimeSpentSeconds = logDto.TimeSpentSeconds,

                // >>> MAP DỮ LIỆU MỚI VÀO ĐÂY <<<
                MetaData = logDto.MetaData ?? string.Empty,

                Timestamp = DateTime.UtcNow
            };

            await _repository.AddAsync(log);
        }
    }
}
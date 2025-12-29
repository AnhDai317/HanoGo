using HanoGo.Service.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HanoGo.Service.Abstractions
{
    public interface IPlaceService
    {
        Task<IEnumerable<PlaceDto>> GetAllPlacesAsync();
        Task<PlaceDto?> GetPlaceByIdAsync(int id);
    }
}
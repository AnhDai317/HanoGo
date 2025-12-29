using HanoGo.Data.Entities;
using HanoGo.Data.Abstractions; // Gọi Repo Interface
using HanoGo.Service.Dtos;
using HanoGo.Service.Abstractions; // Gọi Service Interface
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HanoGo.Service.Services
{
    public class PlaceService : IPlaceService
    {
        private readonly IGenericRepository<Place> _repository;

        public PlaceService(IGenericRepository<Place> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PlaceDto>> GetAllPlacesAsync()
        {
            var places = await _repository.GetAllAsync();
            return places.Select(p => new PlaceDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description ?? "",
                ImageUrl = p.ImageUrl ?? "",
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Tags = p.Tags ?? ""
            });
        }

        public async Task<PlaceDto?> GetPlaceByIdAsync(int id)
        {
            var p = await _repository.GetByIdAsync(id);
            if (p == null) return null;
            return new PlaceDto { Id = p.Id, Name = p.Name, Description = p.Description ?? "", ImageUrl = p.ImageUrl ?? "", Latitude = p.Latitude, Longitude = p.Longitude, Tags = p.Tags ?? "" };
        }
    }
}
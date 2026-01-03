using HanoGo.Data.Context; // Gọi DbContext
using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using Microsoft.EntityFrameworkCore; // Quan trọng để dùng .Include
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HanoGo.Service.Services
{
    public class PlaceService : IPlaceService
    {
        private readonly TravelDbContext _context;

        // Inject TravelDbContext thay vì IGenericRepository
        public PlaceService(TravelDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlaceDto>> GetAllPlacesAsync()
        {
            // Lấy Place + PlaceImages + Reviews + User (người review)
            var places = await _context.Places
                .Include(p => p.PlaceImages)
                .Include(p => p.Reviews)
                    .ThenInclude(r => r.User)
                .ToListAsync();

            // Map từ Entity sang DTO
            return places.Select(p => new PlaceDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description ?? "",
                Address = p.Address ?? "",
                Category = p.Category ?? "",
                ImageUrl = p.ImageUrl ?? "",
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Tags = p.Tags ?? "",

                // Map các trường mới
                PriceRange = p.PriceRange ?? "Miễn phí",
                OpeningHours = p.OpeningHours ?? "Cả ngày",
                BestTimeVisit = p.BestTimeVisit ?? "Quanh năm",
                AverageRating = p.AverageRating,
                TotalReviews = p.TotalReviews,

                // Map danh sách ảnh (Lấy URL)
                PlaceImages = p.PlaceImages.Select(img => img.ImageUrl).ToList(),

                // Map danh sách review
                Reviews = p.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Username = r.User?.Username ?? "Người dùng",
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
            });
        }

        public async Task<PlaceDto?> GetPlaceByIdAsync(int id)
        {
            var p = await _context.Places
                .Include(x => x.PlaceImages)
                .Include(x => x.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return null;

            return new PlaceDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description ?? "",
                Address = p.Address ?? "",
                Category = p.Category ?? "",
                ImageUrl = p.ImageUrl ?? "",
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Tags = p.Tags ?? "",
                PriceRange = p.PriceRange ?? "Miễn phí",
                OpeningHours = p.OpeningHours ?? "Cả ngày",
                BestTimeVisit = p.BestTimeVisit ?? "Quanh năm",
                AverageRating = p.AverageRating,
                TotalReviews = p.TotalReviews,
                PlaceImages = p.PlaceImages.Select(img => img.ImageUrl).ToList(),
                Reviews = p.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Username = r.User?.Username ?? "Người dùng",
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
            };
        }
    }
}
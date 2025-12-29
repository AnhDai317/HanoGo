using HanoGo.Data.Context;
using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using HanoGo.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Cần cái này để dùng .FirstOrDefaultAsync

namespace HanoGo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacesController : ControllerBase
    {
        private readonly IPlaceService _placeService;
        private readonly TravelDbContext _context; // Inject DbContext để xử lý nhanh việc check trùng
        private readonly IUserLogService _logService; // Inject LogService

        // Constructor cập nhật nhận đủ 3 món
        public PlacesController(IPlaceService placeService, TravelDbContext context, IUserLogService logService)
        {
            _placeService = placeService;
            _context = context;
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var places = await _placeService.GetAllPlacesAsync();
            return Ok(places);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var place = await _placeService.GetPlaceByIdAsync(id);
            return place == null ? NotFound() : Ok(place);
        }

        // ============================================================
        // API QUAN TRỌNG: LƯU ĐỊA ĐIỂM TỪ BÊN NGOÀI (OSM)
        // ============================================================
        [HttpPost("track-external")]
        public async Task<IActionResult> TrackExternalPlace([FromBody] ExternalPlaceDto dto)
        {
            // 1. Kiểm tra xem địa điểm này đã có trong DB chưa?
            // Logic: Trùng tên HOẶC Tọa độ lệch nhau cực ít (< 0.0001 độ ~ 11 mét)
            var existingPlace = await _context.Places
                .FirstOrDefaultAsync(p => p.Name == dto.Name ||
                                         (Math.Abs(p.Latitude - dto.Latitude) < 0.0001 &&
                                          Math.Abs(p.Longitude - dto.Longitude) < 0.0001));

            int placeId;

            if (existingPlace == null)
            {
                // 2. Nếu chưa có -> Tạo mới
                var newPlace = new Place
                {
                    Name = dto.Name,
                    Description = dto.Address, // Lấy địa chỉ làm mô tả
                    Address = dto.Address,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    Category = "Search Result", // Đánh dấu là hàng user tìm
                    Tags = "new,search",
                    ImageUrl = "https://cdn-icons-png.flaticon.com/512/854/854878.png", // Ảnh mặc định
                    CreatedByAdminId = null,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Places.Add(newPlace);
                await _context.SaveChangesAsync();
                placeId = newPlace.Id;
            }
            else
            {
                // 3. Nếu có rồi -> Dùng lại ID cũ
                placeId = existingPlace.Id;
            }

            // 4. Ghi Log hành vi: User đã "CHỌN" địa điểm này
            await _logService.LogActivityAsync(new LogDto
            {
                UserId = 1, // Hardcode User 1 (sau này lấy từ Token)
                PlaceId = placeId,
                ActionType = "SEARCH_ADD", // Action quan trọng cho AI
                MetaData = dto.Name,
                TimeSpentSeconds = 0
            });

            // 5. Trả về ID thật để Frontend dùng
            return Ok(new { id = placeId, message = "Saved and Tracked success" });
        }
    }
}
using HanoGo.Data.Context; // Để query lấy thông tin place đầy đủ
using HanoGo.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HanoGo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItineraryController : ControllerBase
    {
        private readonly IAiService _aiService;
        private readonly TravelDbContext _context;

        public ItineraryController(IAiService aiService, TravelDbContext context)
        {
            _aiService = aiService;
            _context = context;
        }

        [HttpPost("optimize")]
        public async Task<IActionResult> Optimize([FromBody] List<int> placeIds)
        {
            // 1. Lấy thông tin chi tiết các địa điểm từ DB dựa trên ID
            var places = await _context.Places
                .Where(p => placeIds.Contains(p.Id))
                .ToListAsync();

            if (places.Count < 2) return BadRequest("Cần ít nhất 2 điểm để sắp xếp.");

            // 2. Lấy danh sách tên để gửi cho AI
            var placeNames = places.Select(p => p.Name).ToList();

            // 3. Gọi Gemini
            var jsonSortedNames = await _aiService.OptimizeItineraryAsync(placeNames);

            // 4. Parse kết quả AI trả về (List tên đã sắp xếp)
            var sortedNames = JsonSerializer.Deserialize<List<string>>(jsonSortedNames);

            // 5. Sắp xếp lại List Object ban đầu theo thứ tự tên mà AI đưa ra
            var sortedPlaces = sortedNames
                .Select(name => places.FirstOrDefault(p => p.Name.Contains(name) || name.Contains(p.Name))) // Tìm tương đối
                .Where(p => p != null) // Lọc bỏ null nếu AI bịa tên sai
                .ToList();

            // Bổ sung những điểm bị sót (nếu AI lỡ quên)
            foreach (var p in places)
            {
                if (!sortedPlaces.Contains(p)) sortedPlaces.Add(p);
            }

            return Ok(sortedPlaces);
        }
    }
}
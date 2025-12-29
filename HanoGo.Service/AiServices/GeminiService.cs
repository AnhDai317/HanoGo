using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace HanoGo.Service.Services
{
    public interface IAiService
    {
        Task<string> OptimizeItineraryAsync(List<string> placeNames);
    }

    public class GeminiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            // DÁN LẠI KEY CỦA BẠN VÀO ĐÂY (Cái key bắt đầu bằng AIzaSy...)
            _apiKey = "AIzaSyAWB5C7OCv-v_MSer7KRwK6RAUVvoFhiTg";
        }

        public async Task<string> OptimizeItineraryAsync(List<string> placeNames)
        {
            // --- SỬA THÀNH MODEL 2.0 FLASH (CÓ TRONG DANH SÁCH CỦA BẠN) ---
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

            var promptText = $@"
                Tôi có danh sách các địa điểm du lịch ở Hà Nội: {string.Join(", ", placeNames)}.
                Hãy sắp xếp lại thứ tự các địa điểm này để tạo thành một lịch trình di chuyển hợp lý nhất (tránh đi vòng vèo).
                Yêu cầu bắt buộc:
                1. Chỉ trả về kết quả là một JSON Array chứa tên các địa điểm theo thứ tự mới.
                2. Tuyệt đối không giải thích gì thêm, không dùng Markdown (```json), chỉ trả về JSON thô.
                Ví dụ output chuẩn: [""Lăng Bác"", ""Quán Ăn Ngon"", ""Hồ Gươm""]
            ";

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = promptText } } }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, jsonContent);
            var responseString = await response.Content.ReadAsStringAsync();

            // Debug xem AI trả về gì (nếu cần)
            Console.WriteLine("--- AI RESPONSE ---");
            Console.WriteLine(responseString);

            using var doc = JsonDocument.Parse(responseString);
            var root = doc.RootElement;

            // Check lỗi từ Google
            if (root.TryGetProperty("error", out var errorElement))
            {
                var msg = errorElement.GetProperty("message").GetString();
                throw new Exception($"Gemini Error: {msg}");
            }

            // Check xem có kết quả không
            if (!root.TryGetProperty("candidates", out var candidates)) return "[]";

            var textResult = candidates[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Làm sạch chuỗi (Xóa ký tự thừa nếu AI lỡ thêm vào)
            textResult = textResult.Replace("```json", "").Replace("```", "").Trim();

            return textResult;
        }
    }
}
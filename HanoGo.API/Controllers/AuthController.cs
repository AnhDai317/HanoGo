using HanoGo.Data.Entities;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HanoGo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // API: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = await _authService.LoginAsync(request);
            if (user == null)
            {
                return Unauthorized("Sai tài khoản hoặc mật khẩu");
            }
            return Ok(user);
        }

        // API: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Gọi service đăng ký (chỉ truyền 3 tham số)
                var user = await _authService.RegisterAsync(
                    request.Username,
                    request.Password,
                    // Nếu client không gửi email, tự sinh email giả định để không lỗi DB
                    request.Email ?? request.Username + "@hanogo.com"
                );
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Ví dụ: "Tài khoản đã tồn tại!"
            }
        }
    }

    // Class DTO nhận dữ liệu (Đã xóa FullName)
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
    }
}
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
                // Gọi service đăng ký
                var user = await _authService.RegisterAsync(
                    request.Username,
                    request.Password,
                    request.Email ?? request.Username + "@hanogo.com", // Fallback email nếu null
                    request.FullName
                );
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Trả lỗi (ví dụ: Trùng username)
            }
        }
    }

    // Class nhận dữ liệu từ Frontend gửi lên
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public string FullName { get; set; }
    }
}
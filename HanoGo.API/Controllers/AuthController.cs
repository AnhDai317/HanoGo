using HanoGo.Service.Abstractions;
using HanoGo.Service.Dtos;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _authService.LoginAsync(dto);
            if (user == null)
            {
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu!" });
            }

            // Trả về thông tin User (để Frontend lưu lại ID)
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                role = user.Role,
                isPremium = user.IsPremium
            });
        }
    }
}
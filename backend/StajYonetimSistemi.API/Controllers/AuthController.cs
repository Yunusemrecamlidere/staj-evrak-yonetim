using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajYonetimSistemi.API.Data;
using StajYonetimSistemi.API.DTOs;
using StajYonetimSistemi.API.Enums;
using StajYonetimSistemi.API.Models;
using StajYonetimSistemi.API.Services;

namespace StajYonetimSistemi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Bu e-posta adresi zaten kullanımda." });
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.ROLE_STUDENT,
            Student = new Student
            {
                StudentNo = request.StudentNo
            }
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kayıt işlemi başarıyla tamamlandı." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        // Kullanıcı hem Email hem de Öğrenci Numarası (StudentNo) ile giriş yapabilir
        var user = await _context.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.Email == request.Username || 
                                     (u.Student != null && u.Student.StudentNo == request.Username));

        if (user == null)
        {
            return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre." });
        }

        if (user.IsLocked)
        {
            return StatusCode(403, new { message = "Hesabınız çok sayıda hatalı giriş nedeniyle kilitlenmiştir." });
        }

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= 5)
            {
                user.IsLocked = true;
            }
            await _context.SaveChangesAsync();
            return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre." });
        }

        // Başarılı girişte hatalı deneme sayacını sıfırla
        user.FailedLoginAttempts = 0;
        await _context.SaveChangesAsync();

        var token = _tokenService.CreateToken(user);

        return Ok(new LoginResponseDto(
            token,
            user.Role.ToString(),
            user.FullName,
            user.Email
        ));
    }
}   
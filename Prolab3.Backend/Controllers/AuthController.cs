using Microsoft.AspNetCore.Mvc;
using Prolab3.Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Prolab3.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Şimdilik bellekte tutulan örnek kullanıcı listesi
        private static List<RegisterDto> _kullanicilar = new List<RegisterDto>();

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.OgrenciNo) || string.IsNullOrWhiteSpace(dto.Sifre))
            {
                return BadRequest("Öğrenci numarası ve şifre alanları boş bırakılamaz.");
            }

            // Şifre uzunluğu kontrolü (Basit doğrulama)
            if (dto.Sifre.Length < 6)
            {
                return BadRequest("Şifre en az 6 karakter olmalıdır.");
            }

            _kullanicilar.Add(dto);

            return Ok(new
            {
                message = "Kullanıcı kaydı başarıyla tamamlandı! Artık bu şifre ile giriş yapabilirsiniz.",
                ogrenciNo = dto.OgrenciNo,
                adSoyad = dto.AdSoyad
            });
        }
    }
}

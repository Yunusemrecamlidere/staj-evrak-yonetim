using Microsoft.AspNetCore.Mvc;
using Prolab3.Backend.Models;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq; // Uzantı kontrolü (.Contains) için gerekli

namespace Prolab3.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [HttpPost("upload-csv")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Lütfen geçerli bir CSV dosyası yükleyin.");

            var ogrenciler = new List<OgrenciDto>();

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            {
                var header = await reader.ReadLineAsync();

                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var values = line.Split(',');

                    if (values.Length >= 5)
                    {
                        var ogrenci = new OgrenciDto
                        {
                            AdSoyad = values[0].Trim(),
                            TcNo = values[1].Trim(),
                            OgrenciNo = values[2].Trim(),
                            Bolum = values[3].Trim(),
                            Email = values[4].Trim()
                        };
                        ogrenciler.Add(ogrenci);
                    }
                }
            }

            return Ok(new { message = $"{ogrenciler.Count} adet öğrenci başarıyla yüklendi ve okundu!", data = ogrenciler });
        }

        [HttpPost("upload-document")]
        public async Task<IActionResult> UploadDocument(IFormFile document)
        {
            if (document == null || document.Length == 0)
                return BadRequest("Lütfen bir evrak dosyası seçin.");

            // Vize Kuralı (Madde 2): Sadece dosya formatı ve uzantı kontrolü
            var allowedExtensions = new[] { ".pdf", ".docx", ".doc" };
            var extension = Path.GetExtension(document.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            {
                return BadRequest($"Geçersiz dosya formatı! Sadece {string.Join(", ", allowedExtensions)} uzantılı dosyalar yüklenebilir.");
            }

            return Ok(new
            {
                message = "Evrak formatı ve uzantısı uygun, başarıyla yüklendi!",
                fileName = document.FileName,
                fileSizeKb = document.Length / 1024
            });
        }
    }
}
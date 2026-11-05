using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajYonetimSistemi.API.Data;
using StajYonetimSistemi.API.DTOs;
using StajYonetimSistemi.API.Enums;
using StajYonetimSistemi.API.Models;

namespace StajYonetimSistemi.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public DocumentController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // Öğrencinin staj belgesi yüklemesi (PDF veya Resim)
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDocument([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Lütfen geçerli bir dosya seçin." });
        }

        // Token içerisinden kullanıcı Id bilgisini alma
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { message = "Kullanıcı kimliği doğrulanamadı." });
        }

        var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
        if (student == null)
        {
            return BadRequest(new { message = "Öğrenci profili bulunamadı." });
        }

        // Fiziksel dosya saklama klasörü
        var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads", "documents");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Çakışmayı önlemek için benzersiz dosya adı
        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Veritabanına kayıt (Status: YUKLENDI)
        var document = new Document
        {
            FileName = file.FileName,
            StoredFilePath = filePath,
            ContentType = file.ContentType,
            FileSize = file.Length,
            Status = DocumentStatus.YUKLENDI,
            IsReportReady = false,
            StudentId = student.Id
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Belge başarıyla yüklendi.",
            documentId = document.Id,
            fileName = document.FileName
        });
    }

    // Öğrencinin kendi yüklediği belgeleri listelemesi
    [HttpGet("my-documents")]
    public async Task<ActionResult<List<DocumentListItemDto>>> GetMyDocuments()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
        {
            return BadRequest(new { message = "Öğrenci profili bulunamadı." });
        }

        var documents = await _context.Documents
            .Where(d => d.StudentId == student.Id)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DocumentListItemDto(
                d.Id,
                student.User.FullName,
                d.FileName,
                d.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                d.Status.ToString()
            ))
            .ToListAsync();

        return Ok(documents);
    }

    // Komisyon / Admin için tüm yüklenen belgeleri listeleme
    [HttpGet("all")]
    public async Task<ActionResult<List<DocumentListItemDto>>> GetAllDocuments()
    {
        var documents = await _context.Documents
            .Include(d => d.Student)
            .ThenInclude(s => s.User)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DocumentListItemDto(
                d.Id,
                d.Student.User.FullName,
                d.FileName,
                d.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                d.Status.ToString()
            ))
            .ToListAsync();

        return Ok(documents);
    }
}
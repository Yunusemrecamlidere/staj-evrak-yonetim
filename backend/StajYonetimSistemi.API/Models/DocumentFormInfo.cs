namespace StajYonetimSistemi.API.Models; // Kullanıcıdan alınan form bilgilerini C# de temsil eden model.

public class DocumentFormInfo : BaseEntity
{
    public int DocumentId { get; set; }
    public Document Document { get; set; } = null!;

    // Öğrenci
    public string FullName { get; set; } = string.Empty;
    public string Nationality { get; set; } = "TC";
    public string TcNo { get; set; } = string.Empty;
    public string StudentNo { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string Department { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Fax { get; set; }

    // Staj
    public string Semester { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string InternshipDays { get; set; } = string.Empty; // Seçilen günler

    // Firma ve Mühendis Bilgileri
    public int EngineerCount { get; set; }
    public string? EngineerDepartment { get; set; }
}
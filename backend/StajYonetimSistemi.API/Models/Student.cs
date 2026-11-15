namespace StajYonetimSistemi.API.Models; // Öğrenci sınıfı, BaseEntity sınıfından türetilmiştir ve öğrenci ile ilgili bilgileri temsil eder.

public class Student : BaseEntity
{
    // Veri setiyle eşleştirme anahtarı
    public string StudentNo { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
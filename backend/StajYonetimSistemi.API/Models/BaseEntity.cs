namespace StajYonetimSistemi.API.Models; // Tüm nesneler için ortak özellikleri içeren bir temel sınıf

public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
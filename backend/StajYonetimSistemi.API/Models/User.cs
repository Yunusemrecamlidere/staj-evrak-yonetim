using StajYonetimSistemi.API.Enums; //Kullanıcı kimlik, yetkilendirme ve 5 hatalı girişte hesap kilitleme yapısı

namespace StajYonetimSistemi.API.Models;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.ROLE_STUDENT;

    public int FailedLoginAttempts { get; set; } = 0;
    public bool IsLocked { get; set; } = false;

    public Student? Student { get; set; }
}
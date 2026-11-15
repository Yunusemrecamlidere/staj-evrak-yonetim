namespace StajYonetimSistemi.API.DTOs; // Kayıt ve giriş istek/yanıt modelleri.

public record RegisterRequestDto(
    string FullName,
    string StudentNo,
    string Email,
    string Password
);

public record LoginRequestDto(
    string Username,
    string Password
);

public record LoginResponseDto(
    string Token,
    string Role,
    string FullName,
    string Email
);
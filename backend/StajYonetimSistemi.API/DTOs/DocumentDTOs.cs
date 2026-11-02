namespace StajYonetimSistemi.API.DTOs; // Belge listeleri ve doğrulama raporu yanıt modelleri.

public record DocumentListItemDto(
    int Id,
    string? StudentName,
    string FileName,
    string UploadedAt,
    string Status
);

public record DocumentReportResponseDto(
    int Id,
    string FileName,
    string Status,
    bool Ready,
    List<ReportRowDto> Rows
);

public record ReportRowDto(
    string Field,
    string? Form,
    string? Document,
    string? Dataset,
    bool Ok,
    string? Message
);
namespace StajYonetimSistemi.API.Models; // Kullanıcı ve admin veri seti rasındaki doğrulama karşılaştırması.

public class DocumentReportRow : BaseEntity
{
    public int DocumentId { get; set; }
    public Document Document { get; set; } = null!;

    public string Field { get; set; } = string.Empty;
    public string? FormValue { get; set; }
    public string? DocumentValue { get; set; }
    public string? DatasetValue { get; set; }
    public bool Ok { get; set; }
    public string? Message { get; set; }
}
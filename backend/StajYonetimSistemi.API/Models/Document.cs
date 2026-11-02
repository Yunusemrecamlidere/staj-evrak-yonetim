using StajYonetimSistemi.API.Enums; // Fiziki belge verileri, raporlama durumu ve ilişkileri.

namespace StajYonetimSistemi.API.Models;

public class Document : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string StoredFilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DocumentStatus Status { get; set; } = DocumentStatus.YUKLENDI;
    public bool IsReportReady { get; set; } = false;

    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public DocumentFormInfo? FormInfo { get; set; }
    public ICollection<DocumentReportRow> ReportRows { get; set; } = new List<DocumentReportRow>();
}
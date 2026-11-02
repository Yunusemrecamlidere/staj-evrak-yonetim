namespace StajYonetimSistemi.API.Models; // Admin referans veri seti.

public class AdminDatasetRecord : BaseEntity
{
    public string AdSoyad { get; set; } = string.Empty;
    public string TcNo { get; set; } = string.Empty;
    public string Uyruk { get; set; } = string.Empty;
    public string OgrenciNo { get; set; } = string.Empty;
    public string DogumTarihi { get; set; } = string.Empty;
    public string Adres { get; set; } = string.Empty;
    public string Bolum { get; set; } = string.Empty;
    public string TeslimYili { get; set; } = string.Empty;
    public int OncekiStajGunu { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public bool SaglikYardimi { get; set; }
}
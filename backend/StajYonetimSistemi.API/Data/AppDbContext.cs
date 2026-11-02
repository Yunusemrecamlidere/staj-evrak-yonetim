using Microsoft.EntityFrameworkCore;
using StajYonetimSistemi.API.Models;

namespace StajYonetimSistemi.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<AdminDatasetRecord> AdminDatasetRecords => Set<AdminDatasetRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Kullanıcı e-posta adresini benzersiz yapma
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Öğrenci - Kullanıcı bire bir ilişkisi
        modelBuilder.Entity<Student>()
            .HasOne(s => s.User)
            .WithOne(u => u.Student)
            .HasForeignKey<Student>(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
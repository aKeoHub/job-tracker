using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Job> Jobs => Set<Job>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Job>(entity =>
        {
            entity.Property(job => job.Company)
                .HasMaxLength(160)
                .IsRequired();

            entity.Property(job => job.Position)
                .HasMaxLength(160)
                .IsRequired();

            entity.Property(job => job.Status)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.Property(job => job.JobUrl)
                .HasMaxLength(2048);
        });
    }
}

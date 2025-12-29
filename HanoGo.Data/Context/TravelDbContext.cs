using System;
using System.Collections.Generic;
using HanoGo.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace HanoGo.Data.Context;

public partial class TravelDbContext : DbContext
{
    public TravelDbContext()
    {
    }

    public TravelDbContext(DbContextOptions<TravelDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Itinerary> Itineraries { get; set; }

    public virtual DbSet<Place> Places { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLog> Userlogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=HanoiTravelDB;user=root;password=anhdai2004", ServerVersion.Parse("8.0.44-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Itinerary>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("itineraries");

            entity.HasIndex(e => e.UserId, "FK_Itineraries_Users");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasDefaultValueSql("'Chuyến đi Hà Nội'");

            entity.HasOne(d => d.User).WithMany(p => p.Itineraries)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Itineraries_Users");
        });

        modelBuilder.Entity<Place>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("places");

            entity.HasIndex(e => e.CreatedByAdminId, "FK_Places_Users");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ImageUrl).HasColumnType("text");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Tags).HasColumnType("text");

            entity.HasOne(d => d.CreatedByAdmin).WithMany(p => p.Places)
                .HasForeignKey(d => d.CreatedByAdminId)
                .HasConstraintName("FK_Places_Users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.IsPremium).HasDefaultValueSql("'0'");
            entity.Property(e => e.PasswordHash).HasColumnType("text");
            entity.Property(e => e.PremiumExpiryDate).HasColumnType("datetime");
            entity.Property(e => e.Role).HasDefaultValueSql("'0'");
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        modelBuilder.Entity<UserLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("userlogs");

            entity.HasIndex(e => e.PlaceId, "FK_UserLogs_Places");

            entity.HasIndex(e => e.UserId, "FK_UserLogs_Users");

            entity.Property(e => e.ActionType)
                .HasMaxLength(50)
                .HasDefaultValueSql("'VIEW'");
            entity.Property(e => e.TimeSpentSeconds).HasDefaultValueSql("'0'");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Place).WithMany(p => p.Userlogs)
                .HasForeignKey(d => d.PlaceId)
                .HasConstraintName("FK_UserLogs_Places");

            entity.HasOne(d => d.User).WithMany(p => p.Userlogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_UserLogs_Users");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

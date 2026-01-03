using System;
using System.Collections.Generic;

namespace HanoGo.Data.Entities
{
    public partial class Place
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Tags { get; set; }
        public string? Category { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? ImageUrl { get; set; }

        // --- FIELD CŨ (QUAN TRỌNG: KHÔNG ĐƯỢC XÓA) ---
        public int? CreatedByAdminId { get; set; }
        public DateTime CreatedAt { get; set; }

        // --- CÁC FIELD MỚI (NÂNG CẤP) ---
        public string? PriceRange { get; set; }
        public string? OpeningHours { get; set; }
        public string? BestTimeVisit { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }

        // --- QUAN HỆ ---
        public virtual User? CreatedByAdmin { get; set; }
        public virtual ICollection<UserLog> Userlogs { get; set; } = new List<UserLog>();

        // Thêm 2 quan hệ mới
        public virtual ICollection<PlaceImage> PlaceImages { get; set; } = new List<PlaceImage>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
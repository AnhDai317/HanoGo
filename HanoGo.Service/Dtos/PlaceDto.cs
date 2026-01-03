using System;
using System.Collections.Generic;

namespace HanoGo.Service.Dtos
{
    public class PlaceDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = "";
        public string Address { get; set; } = "";
        public string Category { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string Tags { get; set; } = "";
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // --- CÁC TRƯỜNG MỚI ---
        public string PriceRange { get; set; } = "Miễn phí";
        public string OpeningHours { get; set; } = "Cả ngày";
        public string BestTimeVisit { get; set; } = "Quanh năm";
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }

        // --- DANH SÁCH ẢNH & REVIEW ---
        public List<string> PlaceImages { get; set; } = new List<string>();
        public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
    }

    public class ReviewDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = "Ẩn danh";
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
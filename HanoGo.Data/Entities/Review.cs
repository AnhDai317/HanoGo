using System;

namespace HanoGo.Data.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PlaceId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Place Place { get; set; } = null!;
    }
}
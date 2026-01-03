using System;

namespace HanoGo.Data.Entities
{
    public class PlaceImage
    {
        public int Id { get; set; }
        public int PlaceId { get; set; }
        public string ImageUrl { get; set; } = null!;
        public bool IsCover { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual Place Place { get; set; } = null!;
    }
}
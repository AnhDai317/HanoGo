using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HanoGo.Data.Entities
{
    public class UserLog
    {
        [Key]
        public long Id { get; set; }

        public int? UserId { get; set; }

        // --- THÊM DÒNG NÀY (Để nối sang bảng User) ---
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        // ---------------------------------------------

        public int PlaceId { get; set; }

        // --- THÊM DÒNG NÀY (Để nối sang bảng Place - Sửa lỗi của bạn ở đây) ---
        [ForeignKey("PlaceId")]
        public virtual Place Place { get; set; } = null!;
        // ----------------------------------------------------------------------

        [Required]
        [StringLength(50)]
        public string ActionType { get; set; } = "VIEW";

        public string MetaData { get; set; } = string.Empty;

        public int TimeSpentSeconds { get; set; } = 0;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
using System;
using System.Collections.Generic;

namespace HanoGo.Data.Entities;

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

    public int? CreatedByAdminId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? CreatedByAdmin { get; set; }

    public virtual ICollection<UserLog> Userlogs { get; set; } = new List<UserLog>();
}

using System;
using System.Collections.Generic;

namespace HanoGo.Data.Entities;

public partial class Itinerary
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? Title { get; set; }

    public string? JsonContent { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}

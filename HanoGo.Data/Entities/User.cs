using System;
using System.Collections.Generic;

namespace HanoGo.Data.Entities;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int? Role { get; set; }

    public bool? IsPremium { get; set; }

    public DateTime? PremiumExpiryDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Itinerary> Itineraries { get; set; } = new List<Itinerary>();

    public virtual ICollection<Place> Places { get; set; } = new List<Place>();

    public virtual ICollection<UserLog> Userlogs { get; set; } = new List<UserLog>();
}

namespace HanoGo.Service.Dtos
{
    public class ExternalPlaceDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Category { get; set; } = "User Found";
    }
}
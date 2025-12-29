namespace HanoGo.Service.Dtos
{
    public class LogDto
    {
        public int? UserId { get; set; }
        public int PlaceId { get; set; }
        public string ActionType { get; set; } = "VIEW";
        public int TimeSpentSeconds { get; set; } = 0;

        // >>> THÊM MỚI <<<
        public string MetaData { get; set; } = string.Empty;
    }
}
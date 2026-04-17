namespace CodePulse.API.Models.DTO
{
    public class DashboardStatsDto
    {
        public int TotalPosts { get; set; }
        public int PublishedPosts { get; set; }
        public int DraftPosts { get; set; }
        public int DeletedPosts { get; set; }
    }
}
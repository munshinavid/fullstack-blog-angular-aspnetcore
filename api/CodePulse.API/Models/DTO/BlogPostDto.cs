namespace CodePulse.API.Models.DTO
{
    public class BlogPostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; }
        public string? Description { get; set; } 
        public string? Author { get; set; } 
        //property imae, urlhandle,isvisible
        public string? FeaturedImgUrl { get; set; } 
        public string? UrlHandle { get; set; } 
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; }
        public int ViewCount { get; set; }
        public int ReadingTimeMinutes { get; set; }

        //send category as list of categorydto
        public List<CategoryDto> Categories { get; set; }=new();
    }
}

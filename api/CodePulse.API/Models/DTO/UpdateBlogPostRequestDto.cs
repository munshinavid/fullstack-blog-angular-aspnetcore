namespace CodePulse.API.Models.DTO
{
    public class UpdateBlogPostRequestDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        //property imae, urlhandle,isvisible
        public string FeaturedImgUrl { get; set; }
        public string UrlHandle { get; set; }
        public bool IsVisible { get; set; }

        //accept list of category ids
        public List<Guid> CategoryIds { get; set; } = new();
    }
}

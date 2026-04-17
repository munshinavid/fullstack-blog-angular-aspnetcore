namespace CodePulse.API.Models.Domain
{
    public class BlogPost
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        //property imae, urlhandle,isvisible
        public string FeaturedImgUrl { get; set; }
        public string UrlHandle { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDeleted { get; set; } = false;

        //Blog post can have multiple categories
        public ICollection<BlogPostCategory> BlogPostCategories { get; set; }

        //One Blog post can have multiple comments
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}

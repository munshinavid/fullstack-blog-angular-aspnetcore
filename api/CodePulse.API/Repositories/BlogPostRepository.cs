using CodePulse.API.Data;
using CodePulse.API.Models.Domain;

namespace CodePulse.API.Repositories
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly BlogDbContext blogDbContext;

        public BlogPostRepository( BlogDbContext blogDbContext )
        {
            this.blogDbContext = blogDbContext;
        }
        public async Task<BlogPost> CreateBlogPostAsync(BlogPost blogPost)
        {
            //blogPost.Id = Guid.NewGuid();
            await blogDbContext.BlogPosts.AddAsync(blogPost);
            await blogDbContext.SaveChangesAsync();
            return blogPost;

        }

        public Task<bool> DeleteBlogPostAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<BlogPost>> GetAllBlogPostsAsync()
        {
            return await Task.FromResult(blogDbContext.BlogPosts.AsEnumerable());

        }

        public Task<BlogPost> GetBlogPostByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<BlogPost> UpdateBlogPostAsync(BlogPost blogPost)
        {
            throw new NotImplementedException();
        }
    }
}

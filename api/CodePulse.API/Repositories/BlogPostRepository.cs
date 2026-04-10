using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using Microsoft.EntityFrameworkCore;

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

            // ২. এবার রিলেটেড ক্যাটাগরিগুলো লোড করুন (এটিই আসল ট্রিক)
            // সরাসরি আইডি দিয়ে আবার ডাটাবেস থেকে কল করুন যেন Include কাজ করে
            return await blogDbContext.BlogPosts
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == blogPost.Id);

        }

        public Task<bool> DeleteBlogPostAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<BlogPost>> GetAllBlogPostsAsync()
        {
            //include category
            return await blogDbContext.BlogPosts
                .AsNoTracking()
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .ToListAsync();
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

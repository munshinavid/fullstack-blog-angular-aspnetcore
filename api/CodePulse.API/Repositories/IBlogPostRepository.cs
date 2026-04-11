
using CodePulse.API.Models.Domain;

namespace CodePulse.API.Repositories
{
    public interface IBlogPostRepository
    {
        Task<BlogPost> CreateBlogPostAsync(BlogPost blogPost, List<Guid> categoryIds);
        Task<BlogPost> GetBlogPostByIdAsync(Guid id);
        Task<IEnumerable<BlogPost>> GetAllBlogPostsAsync();
        Task<BlogPost> UpdateBlogPostAsync(Guid id, BlogPost blogPost, List<Guid> categoryIds);
        Task<bool> DeleteBlogPostAsync(Guid id);


    }
}

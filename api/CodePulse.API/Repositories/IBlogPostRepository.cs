
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;

namespace CodePulse.API.Repositories
{
    public interface IBlogPostRepository
    {
        Task<BlogPost> CreateBlogPostAsync(BlogPost blogPost, List<Guid> categoryIds);
        Task<BlogPost> GetBlogPostByIdAsync(Guid id);
        Task<IEnumerable<BlogPost>> GetAllBlogPostsAsync();
        Task<PagedResultDto<BlogPost>> GetPaginatedBlogPostsAsync(string? query, int page, int pageSize, bool isAdmin = false);
        Task<BlogPost> UpdateBlogPostAsync(Guid id, BlogPost blogPost, List<Guid> categoryIds);
        Task<bool> DeleteBlogPostAsync(Guid id);
        Task<BlogPost> GetBlogPostByUrlHandleAsync(string urlHandle);

        Task<DashboardStatsDto> GetStatsAsync();
        Task<bool> RestoreBlogPostAsync(Guid id);
        Task<bool> HardDeleteBlogPostAsync(Guid id);
    }
}

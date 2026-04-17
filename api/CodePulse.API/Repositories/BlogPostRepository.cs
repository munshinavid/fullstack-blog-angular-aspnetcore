using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private const int DefaultPageSize = 10;
        private const int MaxPageSize = 50;
        private readonly BlogDbContext blogDbContext;

        public BlogPostRepository( BlogDbContext blogDbContext )
        {
            this.blogDbContext = blogDbContext;
        }
        public async Task<BlogPost> CreateBlogPostAsync(BlogPost blogPost, List<Guid> categoryIds)
        {
            blogPost.Id = Guid.NewGuid();

            var ids = categoryIds?.Distinct().ToList() ?? new();

            blogPost.BlogPostCategories = ids
                .Select(id => new BlogPostCategory
                {
                    BlogPostId = blogPost.Id,
                    CategoryId = id
                }).ToList();
            await blogDbContext.BlogPosts.AddAsync(blogPost);
            await blogDbContext.SaveChangesAsync();

            // সরাসরি আইডি দিয়ে আবার ডাটাবেস থেকে কল করুন যেন Include কাজ করে
            var result = await blogDbContext.BlogPosts
                .AsNoTracking()
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == blogPost.Id);

            if (result == null) {
                throw new Exception("Blog post not found after creation.");
            }
            return result;
        }

        public async Task<bool> DeleteBlogPostAsync(Guid id)
        {
            var existing = await blogDbContext.BlogPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (existing == null)
                return false;
            existing.IsDeleted = true;
            await blogDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BlogPost>> GetAllBlogPostsAsync()
        {
            //include category
            return await blogDbContext.BlogPosts
                .Where(x => x.IsVisible && !x.IsDeleted)
                .AsNoTracking()
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .ToListAsync();
        }

        public async Task<PagedResultDto<BlogPost>> GetPaginatedBlogPostsAsync(string? query, int page, int pageSize, bool isAdmin = false)
        {
            var currentPage = page <= 0 ? 1 : page;
            var currentPageSize = pageSize <= 0
                ? DefaultPageSize
                : Math.Min(pageSize, MaxPageSize);

            // Start query
            var pagedQuery = blogDbContext.BlogPosts
                .AsNoTracking()
                .AsQueryable();

            // Core logic: filter out Drafts and Deleted unless Admin
            if (!isAdmin)
            {
                pagedQuery = pagedQuery.Where(x => x.IsVisible && !x.IsDeleted);
            }

            if (!string.IsNullOrWhiteSpace(query))
            {
                var trimmedQuery = query.Trim();
                pagedQuery = pagedQuery.Where(x => x.Title.Contains(trimmedQuery));
            }

            var totalCount = await pagedQuery.CountAsync();

            var items = await pagedQuery
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .OrderByDescending(x => x.PublishedDate)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .ToListAsync();

            return new PagedResultDto<BlogPost>
            {
                Items = items,
                TotalCount = totalCount,
                CurrentPage = currentPage,
                PageSize = currentPageSize
            };
        }

        public async Task<BlogPost> GetBlogPostByIdAsync(Guid id)
        {
            var result = await blogDbContext.BlogPosts
                .AsNoTracking()
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (result == null) {
                throw new Exception("Blog post not found.");
            }
            return result;
        }

        public async Task<BlogPost> GetBlogPostByUrlHandleAsync(string urlHandle)
        {
            var result = await blogDbContext.BlogPosts
                .AsNoTracking()
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .FirstOrDefaultAsync(x => x.UrlHandle == urlHandle);
            if (result == null) {
                throw new Exception("Blog post not found.");
            }
            return result;
        }

        public async Task<BlogPost?> UpdateBlogPostAsync(Guid id, BlogPost request, List<Guid> categoryIds)
        {
            // 🔹 1. Load existing with relations
            var existing = await blogDbContext.BlogPosts
                .Include(x => x.BlogPostCategories)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existing == null)
                return null;

            // 🔹 2. Update basic fields
            existing.Title = request.Title;
            existing.Content = request.Content;
            existing.Description = request.Description;
            existing.Author = request.Author;
            existing.FeaturedImgUrl = request.FeaturedImgUrl;
            existing.UrlHandle = request.UrlHandle;
            existing.IsVisible = request.IsVisible;
            existing.PublishedDate = request.PublishedDate;

            // 🔥 3. Category Sync (CORE LOGIC)

            // safety
            var incomingIds = categoryIds?.Distinct().ToList() ?? new List<Guid>();

            var existingIds = existing.BlogPostCategories
                .Select(x => x.CategoryId)
                .ToList();

            // ➕ Add new categories
            var toAdd = incomingIds.Except(existingIds);
            foreach (var catId in toAdd)
            {
                existing.BlogPostCategories.Add(new BlogPostCategory
                {
                    BlogPostId = existing.Id,
                    CategoryId = catId
                });
            }

            // ➖ Remove missing categories
            var toRemove = existing.BlogPostCategories
                .Where(x => !incomingIds.Contains(x.CategoryId))
                .ToList();

            foreach (var item in toRemove)
            {
                existing.BlogPostCategories.Remove(item);
            }

            // 🔹 4. Save changes
            await blogDbContext.SaveChangesAsync();

            // 🔹 5. Return updated with full data
            return await blogDbContext.BlogPosts
                .AsNoTracking()
                .Include(x => x.BlogPostCategories)
                .ThenInclude(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        // 🔹 Get Dashboard Statistics
        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var total = await blogDbContext.BlogPosts.CountAsync();
            var published = await blogDbContext.BlogPosts.CountAsync(x => x.IsVisible && !x.IsDeleted);
            var draft = await blogDbContext.BlogPosts.CountAsync(x => !x.IsVisible && !x.IsDeleted);
            var deleted = await blogDbContext.BlogPosts.CountAsync(x => x.IsDeleted);

            return new DashboardStatsDto
            {
                TotalPosts = total,
                PublishedPosts = published,
                DraftPosts = draft,
                DeletedPosts = deleted
            };
        }

        // 🔹 Restore a soft-deleted post
        public async Task<bool> RestoreBlogPostAsync(Guid id)
        {
            var existing = await blogDbContext.BlogPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (existing == null)
            {
                return false;
            }

            // Set IsDeleted flag to false to restore
            existing.IsDeleted = false;
            await blogDbContext.SaveChangesAsync();
            return true;
        }

        // 🔹 Permanently remove post from database
        public async Task<bool> HardDeleteBlogPostAsync(Guid id)
        {
            var existing = await blogDbContext.BlogPosts.FirstOrDefaultAsync(x => x.Id == id);
            if (existing == null)
            {
                return false;
            }

            // Permanently delete the record from database
            blogDbContext.BlogPosts.Remove(existing);
            await blogDbContext.SaveChangesAsync();
            return true;
        }
    }
}

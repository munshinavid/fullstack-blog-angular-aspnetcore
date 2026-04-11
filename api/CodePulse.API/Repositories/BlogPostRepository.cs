using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
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
            var existing = blogDbContext.BlogPosts.FirstOrDefault(x => x.Id == id);
            if (existing == null)
                return await Task.FromResult(false);
            blogDbContext.BlogPosts.Remove(existing);
            await blogDbContext.SaveChangesAsync();
            return true;
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
    }
}

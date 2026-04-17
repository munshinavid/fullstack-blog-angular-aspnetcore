using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodePulse.API.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly BlogDbContext dbContext;

        public CommentRepository(BlogDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Comment> CreateAsync(Comment comment)
        {
            comment.Id = Guid.NewGuid();
            comment.DateAdded = DateTime.UtcNow;
            await dbContext.Comments.AddAsync(comment);
            await dbContext.SaveChangesAsync();
            return comment;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingComment = await dbContext.Comments.FirstOrDefaultAsync(x => x.Id == id);
            
            if (existingComment == null)
            {
                return false;
            }

            dbContext.Comments.Remove(existingComment);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Comment>> GetByBlogPostIdAsync(Guid blogPostId)
        {
            return await dbContext.Comments
                .Where(x => x.BlogPostId == blogPostId)
                .OrderByDescending(x => x.DateAdded) // Order comments by date added
                .Select(x => new Comment
                {
                    Id = x.Id,
                    Content = x.Content,
                    BlogPostId = x.BlogPostId,
                    UserId = x.UserId,
                    DateAdded = x.DateAdded,
                    UserEmail = x.User.Email // Include user email in the DTO
                })
                .ToListAsync();
        }

        public async Task<Comment?> GetByIdAsync(Guid id)
        {
            return await dbContext.Comments.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
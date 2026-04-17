using CodePulse.API.Models.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodePulse.API.Repositories
{
    public interface ICommentRepository
    {
        Task<Comment> CreateAsync(Comment comment);
        Task<IEnumerable<Comment>> GetByBlogPostIdAsync(Guid blogPostId);
        Task<Comment?> GetByIdAsync(Guid id);
        Task<bool> DeleteAsync(Guid id);
    }
}
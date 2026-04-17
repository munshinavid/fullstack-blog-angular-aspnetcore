using Microsoft.AspNetCore.Identity;
using System;

namespace CodePulse.API.Models.DTO
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid BlogPostId { get; set; }
        public string UserId { get; set; }
        public string UserEmail { get; set; }
        public DateTime DateAdded { get; set; }
    }
}
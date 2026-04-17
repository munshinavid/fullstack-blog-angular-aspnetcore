using System;
using System.ComponentModel.DataAnnotations;

namespace CodePulse.API.Models.DTO
{
    public class CreateCommentRequestDto
    {
        [Required]
        public string Content { get; set; }
        
        [Required]
        public Guid BlogPostId { get; set; }
    }
}
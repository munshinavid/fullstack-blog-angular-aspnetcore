using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodePulse.API.Models.Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid BlogPostId { get; set; }
        public string UserId { get; set; }
        public DateTime DateAdded { get; set; }

        public BlogPost BlogPost { get; set; }
        public IdentityUser User { get; set; }

        [NotMapped]
        public string UserEmail { get; set; }

    }
}
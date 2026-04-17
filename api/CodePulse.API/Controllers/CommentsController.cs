using AutoMapper;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ICommentRepository commentRepository;

        public CommentsController(IMapper mapper, ICommentRepository commentRepository)
        {
            this.mapper = mapper;
            this.commentRepository = commentRepository;
        }

        // POST: api/Comments
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentRequestDto requestDto)
        {
            var commentDomain = mapper.Map<Comment>(requestDto);

            // Extract User ID from Claims Token
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            if (!string.IsNullOrEmpty(userIdString))
            {
                commentDomain.UserId = userIdString;
                commentDomain.UserEmail = userEmail;
            }
            else
            {
                return Unauthorized("Invalid user token or missing user id.");
            }

            var createdComment = await commentRepository.CreateAsync(commentDomain);
            return Ok(mapper.Map<CommentDto>(createdComment));
        }

        // GET: api/Comments/post/{blogPostId}
        [HttpGet("post/{blogPostId:guid}")]
        public async Task<IActionResult> GetCommentsByBlogPost(Guid blogPostId)
        {
            var comments = await commentRepository.GetByBlogPostIdAsync(blogPostId);
            return Ok(mapper.Map<IEnumerable<CommentDto>>(comments));
        }

        // DELETE: api/Comments/{id}
        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            // Optional check logic: Verify user is owner or admin
            var comment = await commentRepository.GetByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // Optionally: Users can only delete their own comments unless they are Admin
            if (comment.UserId != currentUserId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var deleted = await commentRepository.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
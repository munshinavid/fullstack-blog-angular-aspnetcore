using CodePulse.API.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using CodePulse.API.Repositories;
using CodePulse.API.Models.Domain;
using Microsoft.AspNetCore.Authorization;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IBlogPostRepository blogPostRepository;

        public BlogPostsController(IMapper mapper, IBlogPostRepository blogPostRepository)
        {
            this.mapper = mapper;
            this.blogPostRepository = blogPostRepository;
        }
        //create a blog post
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBlogPost([FromBody] CreateBlogPostRequestDto requestDto)
        {
            // 🔥 DTO → Domain
            var blogPost = mapper.Map<BlogPost>(requestDto);

            var created = await blogPostRepository.CreateBlogPostAsync(blogPost, requestDto.CategoryIds);

            return Ok(mapper.Map<BlogPostDto>(created));

        }
        //get all blog posts
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllBlogPosts([FromQuery] string? query, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {       
            var result = await blogPostRepository.GetPaginatedBlogPostsAsync(query, page, pageSize);
            
            var response = new PagedResultDto<BlogPostDto>
            {
                Items = mapper.Map<List<BlogPostDto>>(result.Items),
                TotalCount = result.TotalCount,
                CurrentPage = result.CurrentPage,
                PageSize = result.PageSize
            };

            return Ok(response);
        }

        //get blog post by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogPostById(Guid id)
        {
            var blogPost = await blogPostRepository.GetBlogPostByIdAsync(id);
            if (blogPost == null)
            {
                return NotFound();
            }
            var blogPostDto = mapper.Map<BlogPostDto>(blogPost);
            return Ok(blogPostDto);
        }
        //get blog post by url handle
        [HttpGet("urlHandle/{urlHandle}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBlogPostByUrlHandle(string urlHandle)
        {
            var blogPost = await blogPostRepository.GetBlogPostByUrlHandleAsync(urlHandle);
            if (blogPost == null)
            {
                return NotFound();
            }
            var blogPostDto = mapper.Map<BlogPostDto>(blogPost);
            return Ok(blogPostDto);
        }

        //update a blog post
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBlogPost(Guid id, [FromBody] UpdateBlogPostRequestDto requestDto)
        {
            var blogPost = mapper.Map<BlogPost>(requestDto);
            var updated = await blogPostRepository.UpdateBlogPostAsync(id, blogPost, requestDto.CategoryIds);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<BlogPostDto>(updated));
        }

        //delete a blog post
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBlogPost(Guid id)
        {
            var deleted = await blogPostRepository.DeleteBlogPostAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}

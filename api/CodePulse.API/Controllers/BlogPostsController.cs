using CodePulse.API.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using CodePulse.API.Repositories;
using CodePulse.API.Models.Domain;

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
        public async Task<IActionResult> CreateBlogPost([FromBody] CreateBlogPostRequestDto requestDto)
        {
            var blogPost = mapper.Map<BlogPost>(requestDto);
            var createdBlogPost = await blogPostRepository.CreateBlogPostAsync(blogPost);
            var blogPostResponseDto = mapper.Map<BlogPostDto>(createdBlogPost);
            return Ok(blogPostResponseDto);

        }
    }
}

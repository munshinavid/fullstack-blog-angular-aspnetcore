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
            // 🔥 DTO → Domain
            var blogPost = mapper.Map<BlogPost>(requestDto);

            var created = await blogPostRepository.CreateBlogPostAsync(blogPost, requestDto.CategoryIds);

            return Ok(mapper.Map<BlogPostDto>(created));

        }
        //get all blog posts
        [HttpGet]
        public async Task<IActionResult> GetAllBlogPosts()
        {
            var blogPosts = await blogPostRepository.GetAllBlogPostsAsync();
            var blogPostDtos = mapper.Map<List<BlogPostDto>>(blogPosts);
            return Ok(blogPostDtos);
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

        //update a blog post
        [HttpPut("{id}")]
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
    }
}

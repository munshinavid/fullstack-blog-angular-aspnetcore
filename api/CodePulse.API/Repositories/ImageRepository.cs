using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly BlogDbContext dbContext;
        private readonly IWebHostEnvironment env;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ImageRepository(BlogDbContext dbContext,
                               IWebHostEnvironment env,
                               IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.env = env;
            this.httpContextAccessor = httpContextAccessor;
        }
        public async Task<BlogImage> UploadAsync(ImageUploadRequestDto request)
        {
            var extension = Path.GetExtension(request.File.FileName);

            var fileName = $"{Guid.NewGuid()}{extension}";

            var localPath = Path.Combine(env.WebRootPath, "images", fileName);

            // create folder if not exists
            if (!Directory.Exists(Path.Combine(env.WebRootPath, "images")))
            {
                Directory.CreateDirectory(Path.Combine(env.WebRootPath, "images"));
            }

            // save file
            using (var stream = new FileStream(localPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            // 🔥 build URL (Forcing HTTPS as requested)
            var httpRequest = httpContextAccessor.HttpContext.Request;

            var url = $"https://{httpRequest.Host}/images/{fileName}";

            // save DB
            var blogImage = new BlogImage
            {
                Id = Guid.NewGuid(),
                FileName = fileName,
                Title = request.Title,
                FileExtension = extension,
                FileSizeInBytes = request.File.Length,
                Url = url
            };

            await dbContext.BlogImages.AddAsync(blogImage);
            await dbContext.SaveChangesAsync();

            return blogImage;
        }
        public async Task<BlogImage?> GetImageByIdAsync(Guid id)
        {
            return await dbContext.BlogImages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<IEnumerable<BlogImage>> GetAllImagesAsync()
        {
            return await dbContext.BlogImages.AsNoTracking().ToListAsync();
        }

    }
}

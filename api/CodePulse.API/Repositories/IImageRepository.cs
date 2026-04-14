using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;

namespace CodePulse.API.Repositories
{
    public interface IImageRepository
    {
        Task<BlogImage> UploadAsync(ImageUploadRequestDto request);
        Task<BlogImage?> GetImageByIdAsync(Guid id);
         Task<IEnumerable<BlogImage>> GetAllImagesAsync();
    }
}

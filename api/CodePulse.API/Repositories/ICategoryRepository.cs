using CodePulse.API.Models.Domain;
namespace CodePulse.API.Repositories
{
    public interface ICategoryRepository
    {
            Task<Category> CreateCategoryAsync(Category category);
            Task<Category> GetCategoryByIdAsync(Guid id);
            Task<IEnumerable<Category>> GetAllCategoriesAsync();
            Task UpdateCategoryAsync(Category category);
            Task DeleteCategoryAsync(Guid id);
    }
}

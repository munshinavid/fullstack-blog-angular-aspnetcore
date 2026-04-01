using CodePulse.API.Data;
using CodePulse.API.Models.Domain;

//we deal Domain models in the repository layer, and we deal DTOs in the controller layer,
//so we need to map the DTOs to the domain models in the controller layer, and then pass the domain models to the repository layer.
//This way we keep the repository layer clean and focused on data access, and we keep the controller layer focused on handling HTTP requests and responses.

namespace CodePulse.API.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly BlogDbContext blogDbContext;

        public CategoryRepository(BlogDbContext blogDbContext)
        {
            this.blogDbContext = blogDbContext;
        }
        public async Task<Category> CreateCategoryAsync(Category category)
        {
            await blogDbContext.Categories.AddAsync(category);
            await blogDbContext.SaveChangesAsync();
            
            return category;
        }

        public Task DeleteCategoryAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            // we can use the ToListAsync() method to convert the IQueryable<Category> to a List<Category>, which is an IEnumerable<Category>.
            return await Task.FromResult(blogDbContext.Categories.AsEnumerable());

        }

        public Task<Category> GetCategoryByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateCategoryAsync(Category category)
        {
            throw new NotImplementedException();
        }
    }
}

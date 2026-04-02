using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using Microsoft.EntityFrameworkCore;

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

        public async Task DeleteCategoryAsync(Guid id)
        {
            var category = await blogDbContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
            if (category != null)
            {
                blogDbContext.Categories.Remove(category);
                await blogDbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            // we can use the ToListAsync() method to convert the IQueryable<Category> to a List<Category>, which is an IEnumerable<Category>.
            return await Task.FromResult(blogDbContext.Categories.AsEnumerable());

        }

        public async Task<Category> GetCategoryByIdAsync(Guid id)
        {
            return await blogDbContext.Categories.FirstOrDefaultAsync(x => x.Id == id);

        }

        public async Task UpdateCategoryAsync(Category category)
        {
            var existingCategory = await blogDbContext.Categories.FirstOrDefaultAsync(x => x.Id == category.Id);
            if (existingCategory != null)
            {
                existingCategory.Name = category.Name;
                existingCategory.UrlHandle = category.UrlHandle;
                await blogDbContext.SaveChangesAsync();
            }
        }

    }
}

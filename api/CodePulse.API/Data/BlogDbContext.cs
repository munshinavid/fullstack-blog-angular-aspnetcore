using CodePulse.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CodePulse.API.Data
{
    public class BlogDbContext: IdentityDbContext
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
        {
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BlogPostCategory> BlogPostCategories { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<BlogPostCategory>()
                .HasKey(x => new { x.BlogPostId, x.CategoryId });


            // ১. রোল তৈরি করা (Admin এবং Reader)
        var adminRoleId = "a71a55ad-7f0b-4cf9-9291-67a96c21b5a2"; // যে কোনো ইউনিক GUID
        var readerRoleId = "c32dc752-b293-41fa-ad1d-f23605833215";

        var roles = new List<IdentityRole>
        {
            new IdentityRole
            {
                Id = adminRoleId,
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = readerRoleId,
                Name = "Reader",
                NormalizedName = "READER"
            }
        };

        builder.Entity<IdentityRole>().HasData(roles);

        // ২. একজন এডমিন ইউজার তৈরি করা
        var adminUserId = "d6e321e8-3486-4f3d-979b-22d7a26f043e";
        var adminUser = new IdentityUser
        {
            Id = adminUserId,
            UserName = "admin@myblog.com",
            Email = "admin@myblog.com",
            NormalizedEmail = "ADMIN@MYBLOG.COM",
            NormalizedUserName = "ADMIN@MYBLOG.COM"
        };

        // পাসওয়ার্ড হ্যাশ করা (অবশ্যই সরাসরি পাসওয়ার্ড দিবে না)
        adminUser.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(adminUser, "1234");

        builder.Entity<IdentityUser>().HasData(adminUser);

            // ৩. ইউজারের সাথে রোলের কানেকশন দেওয়া (Admin User -> Admin Role), join table এ ডাটা ইনসার্ট করা
            var adminRoles = new List<IdentityUserRole<string>>
        {
            new IdentityUserRole<string>
            {
                RoleId = adminRoleId,
                UserId = adminUserId
            }
        };

        builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }
    }
}

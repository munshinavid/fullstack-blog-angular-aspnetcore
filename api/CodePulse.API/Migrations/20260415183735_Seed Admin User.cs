using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CodePulse.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a71a55ad-7f0b-4cf9-9291-67a96c21b5a2", null, "Admin", "ADMIN" },
                    { "c32dc752-b293-41fa-ad1d-f23605833215", null, "Reader", "READER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "d6e321e8-3486-4f3d-979b-22d7a26f043e", 0, "7a7c6d23-b5c8-4166-a414-4f3d774b20de", "admin@myblog.com", false, false, null, "ADMIN@MYBLOG.COM", "ADMIN@MYBLOG.COM", "AQAAAAIAAYagAAAAEMJgkZksUGK4lq6ReOZPa0zoW8GG9h3glkWNQAzLYJroa/TN9eQZbRdYyapSUi/exw==", null, false, "591e971b-cb66-4111-baff-820105863469", false, "admin@myblog.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "a71a55ad-7f0b-4cf9-9291-67a96c21b5a2", "d6e321e8-3486-4f3d-979b-22d7a26f043e" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c32dc752-b293-41fa-ad1d-f23605833215");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "a71a55ad-7f0b-4cf9-9291-67a96c21b5a2", "d6e321e8-3486-4f3d-979b-22d7a26f043e" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a71a55ad-7f0b-4cf9-9291-67a96c21b5a2");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d6e321e8-3486-4f3d-979b-22d7a26f043e");
        }
    }
}

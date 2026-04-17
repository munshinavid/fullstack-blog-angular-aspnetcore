using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodePulse.API.Migrations
{
    /// <inheritdoc />
    public partial class SoftDeleteAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "BlogPosts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d6e321e8-3486-4f3d-979b-22d7a26f043e",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9cbfb805-69cd-476f-bff2-5308820574c3", "AQAAAAIAAYagAAAAELdKVPoBaALTN/82sPtRkThIKfJD5wsQu30tWfimTXa1jjp6ulePlO8ysdQvFMB5Mw==", "3c547a8d-342a-4938-bff0-f5e3e20dcdeb" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "BlogPosts");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d6e321e8-3486-4f3d-979b-22d7a26f043e",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5af125b8-859f-4070-9a69-2e03bcf80bfd", "AQAAAAIAAYagAAAAEMMaeG6OX+kFwLJbo6T3CQYTRjmirnTkGR0P2DqfX0218qbBZhIVG8d4+jCQSoqLYA==", "67e6e3ca-4f63-45d7-a702-95c236644198" });
        }
    }
}

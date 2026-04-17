using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodePulse.API.Migrations
{
    /// <inheritdoc />
    public partial class AddViewcount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "BlogPosts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d6e321e8-3486-4f3d-979b-22d7a26f043e",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "0f66ac41-b90a-4e71-a66b-9a729d6c8af0", "AQAAAAIAAYagAAAAEPrMrGoavOm1rIh34HPF/t6BxQHqApc9AJrQeCgkZTl4UUXDspVoojSSQctyR4W/xA==", "4ad33121-f8ff-43b2-821f-5ad9aa81818a" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "BlogPosts");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d6e321e8-3486-4f3d-979b-22d7a26f043e",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9cbfb805-69cd-476f-bff2-5308820574c3", "AQAAAAIAAYagAAAAELdKVPoBaALTN/82sPtRkThIKfJD5wsQu30tWfimTXa1jjp6ulePlO8ysdQvFMB5Mw==", "3c547a8d-342a-4938-bff0-f5e3e20dcdeb" });
        }
    }
}

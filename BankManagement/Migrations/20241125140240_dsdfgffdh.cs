using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BankManagement.Migrations
{
    /// <inheritdoc />
    public partial class dsdfgffdh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetAccountId",
                table: "Transactions");

            migrationBuilder.AddColumn<string>(
                name: "TargetAccountNumber",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetAccountNumber",
                table: "Transactions");

            migrationBuilder.AddColumn<int>(
                name: "TargetAccountId",
                table: "Transactions",
                type: "int",
                nullable: true);
        }
    }
}

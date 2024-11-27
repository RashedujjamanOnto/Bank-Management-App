using BankManagement.Data;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly BankDbContext _context;

        public ReportController(BankDbContext context)
        {
            _context = context;
        }

        [HttpGet("transaction-history/{userId}")]
        public IActionResult GetTransactionHistory(int userId)
        {
            var transactions = _context.Transactions
                                       .Where(t => t.Account.UserId == userId)
                                       .ToList();

            // Generate Excel Report
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Transaction History");
            worksheet.Cell(1, 1).Value = "Transaction ID";
            worksheet.Cell(1, 2).Value = "Date";
            worksheet.Cell(1, 3).Value = "Amount";
            worksheet.Cell(1, 4).Value = "Type";

            for (int i = 0; i < transactions.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = transactions[i].TransactionId;
                worksheet.Cell(i + 2, 2).Value = transactions[i].TransactionDate;
                worksheet.Cell(i + 2, 3).Value = transactions[i].Amount;
                worksheet.Cell(i + 2, 4).Value = transactions[i].TransactionType.ToString();
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "TransactionHistory.xlsx");
        }
    }
}

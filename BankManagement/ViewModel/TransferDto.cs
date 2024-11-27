using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class TransferDto
    {
        [Required]
        public int SourceAccountId { get; set; }

        [Required]
        public string TargetAccountNumber { get; set; }

        [Required]
        public double Amount { get; set; }

        public string Description { get; set; }
    }
}

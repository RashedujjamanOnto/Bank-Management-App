using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class ExternalTransferRequest
    {
        [Required]
        public int FromAccountId { get; set; } // আমাদের ব্যাঙ্কের অ্যাকাউন্ট ID

        [Required]
        public string TargetAccountNumber { get; set; } // অন্য ব্যাঙ্কের অ্যাকাউন্ট নম্বর

        [Required]
        public string TargetBankName { get; set; } // Target ব্যাঙ্কের নাম

        [Required]
        public double Amount { get; set; } // ট্রান্সফার পরিমাণ

        public string Description { get; set; } // Description (ঐচ্ছিক)
    }

}

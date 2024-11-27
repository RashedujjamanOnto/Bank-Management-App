using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class AccountDto
    {
        public string AccountType { get; set; }
        public double Balance { get; set; }
        public int UserId { get; set; }

        public string Currency { get; set; } = "USD";
    }
}

using BankManagement.Model;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class TransactionHistory
    {
        
        public string TransactionType { get; set; }
        public double Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TargetAccountNumber { get; set; }
        public double? Fee { get; set; }
        public string TargetBankName { get; set; }
        public string Description { get; set; }
    }
}

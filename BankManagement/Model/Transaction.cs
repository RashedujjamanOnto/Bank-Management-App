using BankManagement.Enums;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }
        public int AccountId { get; set; }
        public TransactionType TransactionType { get; set; }
        public double Amount { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public string? TargetAccountNumber { get; set; } 
        public double? Fee { get; set; }
        public string? TargetBankName { get; set; }
        public string? Description { get; set; }
        public Account Account { get; set; }
        
    }
}

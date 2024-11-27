using BankManagement.Enums;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class ApplyLoan
    {
        public int AccountId { get; set; }
        public double Amount { get; set; }
        public int LoanType { get; set; }
        public string Remarks { get; set; }
    }
}

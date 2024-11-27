using BankManagement.Enums;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class LoanData
    {

        public int LoanId { get; set; }
        public string CustomerName { get; set; }

        public double Amount { get; set; }

        public double InterestRate { get; set; } 
        public string LoanType { get; set; } 

        public DateTime ApplicationDate { get; set; }

        public string Remarks { get; set; } 

        public int DurationInMonths { get; set; }
        public string Status { get; set; }
        public double TotalRepayableAmount { get; set; }
        public double MonthlyInstallment { get; set; }
    }
}

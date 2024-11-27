using BankManagement.Enums;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class Loan
    {
        [Key]
        public int LoanId { get; set; }

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Loan amount must be greater than zero.")]
        public double Amount { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "Interest rate must be between 0 and 100.")]
        public double InterestRate { get; set; } // Interest rate, e.g., 5.5%

        [Required]
        public LoanType LoanType { get; set; } // e.g., Personal, Home, Education

        public DateTime ApplicationDate { get; set; } = DateTime.Now;

        public string? Remarks { get; set; } // Admin remarks, optional

        [Required]
        [Range(1, 360, ErrorMessage = "Duration must be between 1 and 360 months.")]
        public int DurationInMonths { get; set; } // Duration of the loan in months

        [Required]
        public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected"

        [Required]
        public int UserId { get; set; }

        // Navigation property
        public User User { get; set; }

        // Calculated field
        public double TotalRepayableAmount
        {
            get
            {
                // Simple interest formula: P + (P * R * T) / 100
                double total = Amount + (Amount * InterestRate * DurationInMonths / 1200);
                return Math.Round(total, 2); // Round to 2 decimal places
            }
        }

        public double MonthlyInstallment
        {
            get
            {
                double installment = TotalRepayableAmount / DurationInMonths;
                return Math.Round(installment, 2); // Round to 2 decimal places
            }
        }
    }

}

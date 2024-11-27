using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BankManagement.Model
{
    public class Account
    {
        [Key]
        public int AccountId { get; set; } // Primary Key

        [Required]
        [MaxLength(50)]
        public string AccountType { get; set; } // Account Type: Savings, Checking, Loan, etc.

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Balance must be a positive value.")]
        public double Balance { get; set; } // Account balance

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "USD"; // Currency type, default is USD

        [Required]
        [StringLength(50)]
        public string AccountNumber { get; set; } // Unique Account Number
        public double InterestRate { get; set; } // Account-specific interest rate
        public DateTime LastInterestCreditedDate { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; } // Foreign Key for User table

        public User User { get; set; } // Navigation Property
        public bool IsActive { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Creation Date

        public DateTime? UpdatedAt { get; set; } // Last Updated Date
    }
}


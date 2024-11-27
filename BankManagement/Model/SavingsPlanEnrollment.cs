using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class SavingsPlanEnrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        [Required]
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        public Account Account { get; set; } // Navigation Property

        [Required]
        [ForeignKey("SavingsPlan")]
        public int PlanId { get; set; }
        public SavingsPlan SavingsPlan { get; set; } // Navigation Property

        [Required]
        public double Amount { get; set; } // Deposit Amount

        [Required]
        public DateTime StartDate { get; set; } // Start Date of the plan

        [Required]
        public DateTime EndDate { get; set; } // End Date of the plan

        [Required]
        public string Status { get; set; } = "Active"; // Status of the plan
    }
}

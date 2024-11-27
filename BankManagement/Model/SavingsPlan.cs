using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class SavingsPlan
    {
        [Key] // Mark this as the Primary Key
        public int Id { get; set; }

        [Required]
        public string PlanName { get; set; }

        [Required]
        public decimal InterestRate { get; set; }

        [Required]
        public int DurationInMonths { get; set; }
        [Required]
        public double MinimumAmount { get; set; }
    }
}

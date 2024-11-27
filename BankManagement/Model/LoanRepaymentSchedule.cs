using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class LoanRepaymentSchedule
    {
        [Key]
        public int ScheduleId { get; set; }
        public int LoanId { get; set; }
        public DateTime DueDate { get; set; }
        public double AmountDue { get; set; }
        public double Penalty { get; set; } = 0;
        public bool IsPaid { get; set; } = false;

        public Loan Loan { get; set; }
    }

}

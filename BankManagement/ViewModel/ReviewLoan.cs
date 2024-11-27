namespace BankManagement.ViewModel
{
    public class ReviewLoan
    {
        public int LoanId { get; set; } 
        public string Status { get; set; } 
        public string Remarks{ get; set; } 
        public double InterestRate { get; set; } 
        public int DurationInMonths { get;set; }
    }
}

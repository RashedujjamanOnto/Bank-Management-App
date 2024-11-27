using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class VerifyOtpRequest
    {
        [Required]
        public int UserId { get; set; } 

        [Required]
        public int Otp { get; set; }
    }
}

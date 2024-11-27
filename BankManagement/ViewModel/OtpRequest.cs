using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class OtpRequest
    {
        [Required]
        public int UserId { get; set; } // ইউজারের ID

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}

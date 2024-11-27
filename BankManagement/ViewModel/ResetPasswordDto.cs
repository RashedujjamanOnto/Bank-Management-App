using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class ResetPasswordDto
    {
        [Required]
        public string NewPassword { get; set; }
    }
}

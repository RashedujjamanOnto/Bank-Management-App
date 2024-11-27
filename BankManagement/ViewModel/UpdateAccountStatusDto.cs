using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class UpdateAccountStatusDto
    {
        [Required]
        public bool IsActive { get; set; }
    }
}

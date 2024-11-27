using System.ComponentModel.DataAnnotations;

namespace BankManagement.ViewModel
{
    public class UpdateUserDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public int RoleId { get; set; }
    }
}

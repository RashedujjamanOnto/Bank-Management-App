using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        public bool IsActive { get; set; }

        // Foreign Key to UserRoles
        [ForeignKey("Role")]
        public int RoleId { get; set; } // FK to UserRoles

        // Navigation Property
        public UserRoles Role { get; set; } // Reference to the Role
    }
}

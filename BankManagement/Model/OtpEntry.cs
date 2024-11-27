using System.ComponentModel.DataAnnotations;

namespace BankManagement.Model
{
    public class OtpEntry
    {
        [Key]
        public int Id { get; set; } // Primary Key

        [Required]
        public int UserId { get; set; } // যেই ইউজারের জন্য OTP পাঠানো হয়েছে

        [Required]
        public int OtpCode { get; set; } // OTP কোড

        [Required]
        public DateTime ExpiresAt { get; set; }
    }
}

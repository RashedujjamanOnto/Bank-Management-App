using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class TwoFactorAuthController : ControllerBase
{
    private readonly Dictionary<string, string> _otpStore = new(); // Simulate OTP storage

    // API to generate OTP
    [HttpPost("GenerateOTP")]
    public IActionResult GenerateOTP([FromBody] string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest("Email is required.");
        }

        // Generate a 6-digit OTP
        var otp = new Random().Next(100000, 999999).ToString();

        // Simulate storing OTP against user email (replace with DB storage)
        _otpStore[email] = otp;

        // Simulate sending OTP (replace with email or SMS service)
        Console.WriteLine($"OTP for {email}: {otp}");

        return Ok("OTP sent successfully.");
    }

    [HttpPost("VerifyOTP")]
    public IActionResult VerifyOTP([FromBody] OtpRequest request)
    {
        if (!_otpStore.ContainsKey(request.Email))
        {
            return BadRequest("Invalid email or OTP expired.");
        }

        if (_otpStore[request.Email] != request.Otp)
        {
            return Unauthorized("Invalid OTP.");
        }

        _otpStore.Remove(request.Email);

        // Issue JWT Token (replace with your actual JWT creation logic)
        var claims = new[]
        {
        new Claim(ClaimTypes.Email, request.Email),
        new Claim(ClaimTypes.Role, "Customer")
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKeyHere"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "https://yourdomain.com",
            audience: "https://yourdomain.com",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

}

// DTO for OTP verification
public class OtpRequest
{
    public int UserId { get; set; }
    public string Email { get; set; }
    public string Otp { get; set; }
}

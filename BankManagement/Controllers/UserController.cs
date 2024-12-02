using BankManagement.Data;
using BankManagement.Model;
using BankManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly BankDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(BankDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public IActionResult Register([FromBody] RegisterUserDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = _context.Users.FirstOrDefault(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest("Email already registered.");
            }

            var role = _context.UserRoles.FirstOrDefault(r => r.Id == registerDto.RoleId);
            if (role == null)
            {
                return BadRequest("Invalid role selected.");
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                RoleId = role.Id,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully.");
        }



        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _context.Users.Include(u => u.Role).FirstOrDefault(u => u.Email == loginRequest.Email && u.IsActive);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
            {
                return Unauthorized("Invalid email or password.");
            }

            var claims = new[]
                        {
                            new Claim(ClaimTypes.Name, user.Name),
                            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim(ClaimTypes.Role, user.Role.RoleName) // Use ClaimTypes.Role
                        };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), userId = user.Id, role= user.Role.RoleName });
        }


        [HttpGet("GetRoles")]
        [Authorize(Roles = "Administrator")]
        public IActionResult GetRoles()
        {
            var roles = _context.UserRoles
                .Select(r => new { r.Id, r.RoleName })
                .ToList();

            return Ok(roles);
        }
        
        [HttpGet("GetUsers")]
        [Authorize(Roles = "Administrator")]
        public IActionResult GetUsers()
        {
            var users = _context.Users.Select(u=> new UsersData
            {
                UserId = u.Id,
                Email = u.Email,
                Name = u.Name,
                RoleId = u.RoleId,
                RoleName = u.Role.RoleName,
                IsActive = u.IsActive,
            }).ToList();
            return Ok(users);
        }

        [HttpPut("UpdateUser/{userId}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult UpdateUser(int userId, [FromBody] UpdateUserDto updateDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var role = _context.UserRoles.FirstOrDefault(r => r.Id == updateDto.RoleId);
            if (role == null)
            {
                return BadRequest("Invalid role selected.");
            }

            user.Name = updateDto.Name;
            user.Email = updateDto.Email;
            user.RoleId = updateDto.RoleId;

            _context.SaveChanges();
            return Ok("User updated successfully.");
        }

        [HttpDelete("DeleteUser/{userId}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult DeleteUser(int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok("User deleted successfully.");
        }

        [HttpPut("UpdateAccountStatus/{userId}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult UpdateAccountStatus(int userId, [FromBody] UpdateAccountStatusDto statusDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.IsActive = statusDto.IsActive;
            _context.SaveChanges();
            return Ok($"User status updated to {(statusDto.IsActive ? "Active" : "Inactive")}.");
        }

        [HttpPut("ResetPassword/{userId}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult ResetPassword(int userId, [FromBody] ResetPasswordDto passwordDto)
        {

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(passwordDto.NewPassword);
            _context.SaveChanges();

            return Ok("Password reset successfully.");
        }

    }
}

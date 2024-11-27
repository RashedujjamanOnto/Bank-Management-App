using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BankManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        // Admin Dashboard API
        [Authorize(Roles = "Administrator")]
        [HttpGet("AdminDashboard")]
        public IActionResult AdminDashboard()
        {
            return Ok("Welcome to the Admin Dashboard!");
        }

        // User Dashboard API
        [Authorize(Roles = "Customer")]
        [HttpGet("UserDashboard")]
        public IActionResult UserDashboard()
        {
            return Ok("Welcome to the User Dashboard!");
        }
    }
}

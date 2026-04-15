using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService tokenService;
        private readonly UserManager<IdentityUser> userManager;

        public AuthController(ITokenService _tokenService, UserManager<IdentityUser> _userManager)
        {
            tokenService = _tokenService;
            userManager = _userManager;
        }

        //register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            // ১. নতুন IdentityUser অবজেক্ট তৈরি
            var user = new IdentityUser
            {
                UserName = request.Email,
                Email = request.Email
            };

            // ২
            //1. password validate করে (length, complexity)
            //2. password hash করে 🔐
            //3. user object DB তে save করে
            //4. duplicate email check করে
            var result = await userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                // ৩. ডিফল্টভাবে "Reader" রোল অ্যাসাইন করা
                // (নিশ্চিত করো তোমার DbContext-এ Reader রোলটি আগে তৈরি করা আছে)
                var roleResult = await userManager.AddToRoleAsync(user, "Reader");

                if (roleResult.Succeeded)
                {
                    return Ok("User registered successfully! Now you can login.");
                }
            }

            // যদি কোনো এরর হয় (যেমন: পাসওয়ার্ড উইক বা ইমেইল অলরেডি আছে)
            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);

            if (user != null)
            {
                var checkPasswordResult = await userManager.CheckPasswordAsync(user, request.Password);

                if (checkPasswordResult)
                {
                    // টোকেন জেনারেট করা
                    var roles = await userManager.GetRolesAsync(user);
                    var jwtToken = tokenService.CreateJwtToken(user, roles.ToList());

                    return Ok(new { Email = request.Email, Token = jwtToken, Roles = roles });
                }
            }

            return BadRequest("Invalid Email or Password");
        }
    }
}

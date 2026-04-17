using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CodePulse.API.Repositories
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration configuration;

        public TokenService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public string CreateJwtToken(IdentityUser user, List<string> roles)
        {
            // ১. ক্লেইম (Claims) তৈরি করা: টোকেনের ভেতর কী কী তথ্য থাকবে
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // ২. সিক্রেট কি (Key) তৈরি করা
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

            // ৩. ক্রেডেনশিয়াল তৈরি করা (অ্যালগরিদমসহ)
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // ৪. টোকেনের মূল বডি বা অবজেক্ট তৈরি করা
            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60), // ১ ঘণ্টা মেয়াদ
                signingCredentials: credentials);

            // ৫. টোকেনটিকে স্ট্রিং হিসেবে রিটার্ন করা
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

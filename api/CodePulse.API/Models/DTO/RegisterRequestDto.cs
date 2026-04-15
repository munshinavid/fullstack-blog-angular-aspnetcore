using System.ComponentModel.DataAnnotations;

namespace CodePulse.API.Models.DTO
{
    public class RegisterRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

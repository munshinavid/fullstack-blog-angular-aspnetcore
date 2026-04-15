using Microsoft.AspNetCore.Identity;

namespace CodePulse.API.Repositories
{
    public interface ITokenService
    {
        string CreateJwtToken(IdentityUser user, List<string> roles);
    }
}

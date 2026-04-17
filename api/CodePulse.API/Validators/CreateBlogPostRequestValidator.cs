using CodePulse.API.Models.DTO;
using FluentValidation;

namespace CodePulse.API.Validators
{
    public class CreateBlogPostRequestValidator : AbstractValidator<CreateBlogPostRequestDto>
    {
        public CreateBlogPostRequestValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Content).NotEmpty().WithMessage("Content is required.");
            RuleFor(x => x.UrlHandle).NotEmpty().WithMessage("UrlHandle is required.");
            RuleFor(x => x.Author).NotEmpty().WithMessage("Author is required.");
        }
    }
}
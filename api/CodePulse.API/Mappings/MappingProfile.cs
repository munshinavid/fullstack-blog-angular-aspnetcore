using AutoMapper;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using System.Text.RegularExpressions;
using System;
using System.Linq;

namespace CodePulse.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateCategoryRequestDto, Category>().ReverseMap();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<UpdateCategoryRequestDto, Category>().ReverseMap();
            CreateMap<CreateBlogPostRequestDto, BlogPost>().ReverseMap();

            // BlogPost mapping - এখানে পরিবর্তনটি লক্ষ্য করুন
            CreateMap<BlogPost, BlogPostDto>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src =>
                    src.BlogPostCategories.Select(x => x.Category).ToList()));
            CreateMap<UpdateBlogPostRequestDto, BlogPost>().ReverseMap();

            // Comment Mapping
            CreateMap<Comment, CommentDto>().ReverseMap();
            CreateMap<CreateCommentRequestDto, Comment>().ReverseMap();
            //CreateMap<UpdateCommentRequestDto, Comment>().ReverseMap();
        }
    }
}

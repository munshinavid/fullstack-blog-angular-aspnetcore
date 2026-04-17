using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CodePulse.API.Exceptions
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            this.logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            // 1. Log the Exception using Serilog (integrated via ILogger)
            logger.LogError(exception, "Exception occurred: {Message}. Request Path: {Path}. Timestamp: {Time}", 
                exception.Message, 
                httpContext.Request.Path,
                DateTime.UtcNow);

            // 2. Determine Status Code based on exact Exception Type
            int statusCode = exception switch
            {
                KeyNotFoundException => StatusCodes.Status404NotFound,
                ArgumentException => StatusCodes.Status400BadRequest,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
            };

            // 3. Prepare Consistent JSON Response Data
            var response = new
            {
                message = exception.Message,
                statusCode = statusCode
            };

            // 4. Send Response Object
            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/json";
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

            // Return true to indicate the exception was strictly handled here
            return true;
        }
    }
}
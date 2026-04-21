FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CodePulse.API.csproj", "./"]
RUN dotnet restore "CodePulse.API.csproj"
COPY . .
RUN dotnet build "CodePulse.API.csproj" -c Release -o /app/build
RUN dotnet publish "CodePulse.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CodePulse.API.dll"]

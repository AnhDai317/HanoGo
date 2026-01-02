using HanoGo.Data.Context;
using HanoGo.Data.Abstractions;
using HanoGo.Data.Repositories;
using HanoGo.Service.Abstractions;
using HanoGo.Service.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1. CORS (Cho phép React truy cập)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 2. DATABASE
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TravelDbContext>(options =>
   options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0))));
// 3. REPOSITORIES
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// 4. SERVICES (ĐĂNG KÝ CÁC SERVICE Ở ĐÂY)
builder.Services.AddScoped<IPlaceService, PlaceService>();
builder.Services.AddScoped<IAiService, GeminiService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// >>> BẠN ĐANG THIẾU DÒNG NÀY <<<
builder.Services.AddScoped<IUserLogService, UserLogService>();
// -------------------------------

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Kích hoạt CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();
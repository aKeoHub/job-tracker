using backend_dotnet.Data;
using backend_dotnet.Models;
using backend_dotnet.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                return Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                    && (uri.Host == "localhost" || uri.Host == "127.0.0.1");
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=job-tracker.db");
});
builder.Services.AddScoped<IJobRepository, EfJobRepository>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    dbContext.Database.Migrate();

    if (!dbContext.Jobs.Any())
    {
        dbContext.Jobs.AddRange(
            new Job
            {
                Company = "MNP",
                Position = "Intermediate Full Stack Developer",
                Status = JobStatus.Interviewing,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new Job
            {
                Company = "Contoso",
                Position = "Angular Developer",
                Status = JobStatus.Applied,
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        );

        dbContext.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AngularDev");

var jobs = app.MapGroup("/api/jobs")
    .WithTags("Jobs");

jobs.MapGet("/", async (IJobRepository repository) => Results.Ok(await repository.GetAllAsync()))
    .WithName("GetJobs");

jobs.MapPost("/", async (CreateJobRequest request, IJobRepository repository) =>
{
    var job = await repository.CreateAsync(request);

    return Results.Created($"/api/jobs/{job.Id}", job);
})
    .WithName("CreateJob");

jobs.MapPut("/{id:int}", async (int id, UpdateJobDetailsRequest request, IJobRepository repository) =>
{
    var job = await repository.UpdateDetailsAsync(id, request);

    return job is null ? Results.NotFound() : Results.Ok(job);
})
    .WithName("UpdateJobDetails");

jobs.MapPatch("/{id:int}/status", async (int id, UpdateJobStatusRequest request, IJobRepository repository) =>
{
    var job = await repository.UpdateStatusAsync(id, request);

    return job is null ? Results.NotFound() : Results.Ok(job);
})
    .WithName("UpdateJobStatus");

jobs.MapDelete("/{id:int}", async (int id, IJobRepository repository) =>
{
    return await repository.DeleteAsync(id) ? Results.NoContent() : Results.NotFound();
})
    .WithName("DeleteJob");

app.Run();

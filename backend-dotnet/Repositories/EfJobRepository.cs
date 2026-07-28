using backend_dotnet.Data;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Repositories;

public sealed class EfJobRepository(AppDbContext dbContext) : IJobRepository
{
    public async Task<IReadOnlyCollection<Job>> GetAllAsync()
    {
        return await dbContext.Jobs
            .AsNoTracking()
            .OrderByDescending(job => job.CreatedAt)
            .ToArrayAsync();
    }

    public async Task<Job> CreateAsync(CreateJobRequest request)
    {
        var job = new Job
        {
            Company = request.Company.Trim(),
            Position = request.Position.Trim(),
            Status = request.Status,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Jobs.Add(job);
        await dbContext.SaveChangesAsync();

        return job;
    }

    public async Task<Job?> UpdateDetailsAsync(int id, UpdateJobDetailsRequest request)
    {
        var job = await dbContext.Jobs.FindAsync(id);

        if (job is null)
        {
            return null;
        }

        job.Company = request.Company.Trim();
        job.Position = request.Position.Trim();

        await dbContext.SaveChangesAsync();

        return job;
    }

    public async Task<Job?> UpdateStatusAsync(int id, UpdateJobStatusRequest request)
    {
        var job = await dbContext.Jobs.FindAsync(id);

        if (job is null)
        {
            return null;
        }

        job.Status = request.Status;

        await dbContext.SaveChangesAsync();

        return job;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var job = await dbContext.Jobs.FindAsync(id);

        if (job is null)
        {
            return false;
        }

        dbContext.Jobs.Remove(job);
        await dbContext.SaveChangesAsync();

        return true;
    }
}

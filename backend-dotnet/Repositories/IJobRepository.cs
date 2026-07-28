using backend_dotnet.Models;

namespace backend_dotnet.Repositories;

public interface IJobRepository
{
    Task<IReadOnlyCollection<Job>> GetAllAsync();
    Task<Job> CreateAsync(CreateJobRequest request);
    Task<Job?> UpdateDetailsAsync(int id, UpdateJobDetailsRequest request);
    Task<Job?> UpdateStatusAsync(int id, UpdateJobStatusRequest request);
    Task<bool> DeleteAsync(int id);
}

using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models;

public sealed record CreateJobRequest(
    [Required, MinLength(2)] string Company,
    [Required, MinLength(2)] string Position,
    JobStatus Status
);

public sealed record UpdateJobDetailsRequest(
    [Required, MinLength(2)] string Company,
    [Required, MinLength(2)] string Position
);

public sealed record UpdateJobStatusRequest(JobStatus Status);

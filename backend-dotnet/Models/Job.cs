namespace backend_dotnet.Models;

public enum JobStatus
{
    Saved,
    Applied,
    Interviewing,
    Offer,
    Rejected
}

public sealed class Job
{
    public int Id { get; set; }
    public required string Company { get; set; }
    public required string Position { get; set; }
    public JobStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? JobUrl { get; set; }
}

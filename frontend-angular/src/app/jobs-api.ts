import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateJobRequest, Job, JobStatus, UpdateJobDetailsRequest } from './job.model';

@Injectable({ providedIn: 'root' })
export class JobsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5050/api/jobs';

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.baseUrl);
  }

  createJob(job: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(this.baseUrl, job);
  }

  updateJobDetails(jobId: number, details: UpdateJobDetailsRequest): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/${jobId}`, details);
  }

  updateJobStatus(jobId: number, status: JobStatus): Observable<Job> {
    return this.http.patch<Job>(`${this.baseUrl}/${jobId}/status`, { status });
  }

  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${jobId}`);
  }
}

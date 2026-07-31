import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { JOB_STATUS_OPTIONS, Job, JobStatus } from './job.model';
import { JobsApi } from './jobs-api';

type Notice = {
  type: 'success' | 'error';
  text: string;
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly jobsApi = inject(JobsApi);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly statusOptions = JOB_STATUS_OPTIONS;
  protected readonly jobs = signal<Job[]>([]);
  protected readonly notice = signal<Notice | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly editingJobId = signal<number | null>(null);
  protected readonly deletingJobId = signal<number | null>(null);
  protected readonly updatingJobIds = signal<number[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<JobStatus | 'All'>('All');



  protected readonly filteredJobs = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const statusFilter = this.statusFilter();
    return this.jobs().filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(searchTerm) ||
        job.position.toLowerCase().includes(searchTerm);

      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  });

  protected readonly totals = computed(() => {
    const jobs = this.jobs();

    return {
      saved: jobs.filter((job) => job.status === 'Saved').length,
      applied: jobs.filter((job) => job.status === 'Applied').length,
      interviewing: jobs.filter((job) => job.status === 'Interviewing').length,
      offers: jobs.filter((job) => job.status === 'Offer').length,
    };
  });

  protected readonly jobForm = this.formBuilder.nonNullable.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    jobUrl: [''],
    status: this.formBuilder.nonNullable.control<JobStatus>('Saved', Validators.required),
  });

  protected readonly editForm = this.formBuilder.nonNullable.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    jobUrl: [''],
  });

  constructor() {
    this.loadJobs();
  }

  protected addJob(): void {
    if (this.jobForm.invalid || this.isSaving()) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.notice.set(null);
    this.isSaving.set(true);

    this.jobsApi.createJob(this.jobForm.getRawValue()).pipe(
      finalize(() => this.isSaving.set(false)),
    ).subscribe({
      next: (job) => {
        this.jobs.update((jobs) => [job, ...jobs]);
        this.notice.set({ type: 'success', text: `${job.position} at ${job.company} was added.` });
        this.jobForm.reset({ company: '', position: '', jobUrl: '', status: 'Saved' });
      },
      error: () => this.notice.set({ type: 'error', text: 'Failed to add job.' }),
    });
  }

  protected startEditing(job: Job): void {
    this.editingJobId.set(job.id);
    this.editForm.setValue({ company: job.company, position: job.position, jobUrl: job.jobUrl ?? '' });
  }

  protected cancelEditing(): void {
    this.editingJobId.set(null);
    this.editForm.reset({ company: '', position: '', jobUrl: '' });
  }

  protected saveDetails(jobId: number): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.notice.set(null);
    this.markUpdating(jobId);

    this.jobsApi.updateJobDetails(jobId, this.editForm.getRawValue()).pipe(
      finalize(() => this.unmarkUpdating(jobId)),
    ).subscribe({
      next: (updatedJob) => {
        this.replaceJob(updatedJob);
        this.notice.set({ type: 'success', text: 'Job details updated.' });
        this.cancelEditing();
      },
      error: () => this.notice.set({ type: 'error', text: 'Failed to update job details.' }),
    });
  }

  protected updateStatus(jobId: number, status: string): void {
    this.notice.set(null);
    this.markUpdating(jobId);

    this.jobsApi.updateJobStatus(jobId, status as JobStatus).pipe(
      finalize(() => this.unmarkUpdating(jobId)),
    ).subscribe({
      next: (updatedJob) => {
        this.replaceJob(updatedJob);
        this.notice.set({ type: 'success', text: 'Job status updated.' });
      },
      error: () => this.notice.set({ type: 'error', text: 'Failed to update job status.' }),
    });
  }

  protected deleteJob(jobId: number): void {
    if (!window.confirm('Delete this job?')) {
      return;
    }

    this.notice.set(null);
    this.deletingJobId.set(jobId);

    this.jobsApi.deleteJob(jobId).pipe(
      finalize(() => this.deletingJobId.set(null)),
    ).subscribe({
      next: () => {
        this.jobs.update((jobs) => jobs.filter((job) => job.id !== jobId));
        this.notice.set({ type: 'success', text: 'Job deleted.' });
      },
      error: () => this.notice.set({ type: 'error', text: 'Failed to delete job.' }),
    });
  }

  protected isUpdating(jobId: number): boolean {
    return this.updatingJobIds().includes(jobId);
  }

  private loadJobs(): void {
    this.jobsApi.getJobs().pipe(
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: (jobs) => this.jobs.set(jobs),
      error: () => this.notice.set({ type: 'error', text: 'Failed to load jobs from .NET API.' }),
    });
  }

  private replaceJob(updatedJob: Job): void {
    this.jobs.update((jobs) => jobs.map((job) => job.id === updatedJob.id ? updatedJob : job));
  }

  private markUpdating(jobId: number): void {
    this.updatingJobIds.update((ids) => ids.includes(jobId) ? ids : [...ids, jobId]);
  }

  private unmarkUpdating(jobId: number): void {
    this.updatingJobIds.update((ids) => ids.filter((id) => id !== jobId));
  }
}

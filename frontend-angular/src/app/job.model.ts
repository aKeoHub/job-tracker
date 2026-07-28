export type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  createdAt: string;
}

export interface CreateJobRequest {
  company: string;
  position: string;
  status: JobStatus;
}

export interface UpdateJobDetailsRequest {
  company: string;
  position: string;
}

export interface JobStatusOption {
  value: JobStatus;
  label: string;
}

export const JOB_STATUS_OPTIONS: JobStatusOption[] = [
  { value: 'Saved', label: 'Saved' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

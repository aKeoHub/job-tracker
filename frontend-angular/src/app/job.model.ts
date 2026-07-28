export type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  jobUrl: string | null;
  createdAt: string;
}

export interface CreateJobRequest {
  company: string;
  position: string;
  status: JobStatus;
  jobUrl: string | null;
}

export interface UpdateJobDetailsRequest {
  company: string;
  position: string;
  jobUrl: string | null;
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

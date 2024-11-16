export type JobStatus = 'PENDING' | 'APPLIED' | 'INTERVIEWING' | 'REJECTED' | 'ACCEPTED';

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  location: string;
  salary?: string;
  applicationDeadline?: string;
  interviewDate?: string;
  notes: string;
  appliedDate: string;
  url?: string;
}
import React from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';

interface StatusBoardProps {
  title: string;
  jobs: Job[];
  onEdit: (job: Job) => void;
  color: string;
  icon: React.ReactNode;
}

export function StatusBoard({ title, jobs, onEdit, color, icon }: StatusBoardProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 min-h-[200px]">
      <div className={`flex items-center gap-2 mb-4 ${color}`}>
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="bg-gray-800 px-2 py-0.5 rounded-full text-sm">
          {jobs.length}
        </span>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onEdit={onEdit} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-400">No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
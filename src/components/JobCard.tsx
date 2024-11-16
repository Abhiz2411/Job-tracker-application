import React from 'react';
import { Calendar, Building2, MapPin, DollarSign, ExternalLink, Clock, CalendarCheck } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
}

export function JobCard({ job, onEdit }: JobCardProps) {
  return (
    <div 
      onClick={() => onEdit(job)}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-gray-600"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white mb-1">{job.position}</h3>
        <div className="flex items-center text-gray-400 gap-2">
          <Building2 size={16} />
          <span>{job.company}</span>
        </div>
      </div>

      <div className="space-y-2 text-gray-300 text-sm">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign size={14} />
            <span>{job.salary}</span>
          </div>
        )}
        {job.applicationDeadline && (
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>Due: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
          </div>
        )}
        {job.interviewDate && (
          <div className="flex items-center gap-2">
            <CalendarCheck size={14} />
            <span>Interview: {new Date(job.interviewDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={14} />
          <span>Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>
        </div>
        {job.url && (
          <a 
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={14} />
            <span>View</span>
          </a>
        )}
      </div>
    </div>
  );
}
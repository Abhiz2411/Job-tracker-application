import React from 'react';
import { X } from 'lucide-react';
import { Job, JobStatus } from '../types';

interface JobFormProps {
  job?: Job;
  onSubmit: (job: Job) => void;
  onClose: () => void;
}

export function JobForm({ job, onSubmit, onClose }: JobFormProps) {
  const [formData, setFormData] = React.useState<Partial<Job>>(
    job || {
      company: '',
      position: '',
      status: 'PENDING' as JobStatus,
      location: '',
      salary: '',
      applicationDeadline: '',
      interviewDate: '',
      notes: '',
      url: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: job?.id || crypto.randomUUID(),
      appliedDate: job?.appliedDate || new Date().toISOString(),
      notes: formData.notes || '',
    } as Job);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl my-auto">
        <div className="sticky top-0 bg-gray-800 z-10 p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              {job ? 'Edit Job Application' : 'Add New Job Application'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Salary (Optional)</label>
              <input
                type="text"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value.startsWith('₹') ? e.target.value : `₹${e.target.value}` })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="₹0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as JobStatus })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PENDING">Wishlist</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="REJECTED">Rejected</option>
                <option value="ACCEPTED">Accepted</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Application Deadline</label>
              <input
                type="date"
                value={formData.applicationDeadline?.split('T')[0]}
                onChange={e => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Interview Date</label>
              <input
                type="date"
                value={formData.interviewDate?.split('T')[0]}
                onChange={e => setFormData({ ...formData, interviewDate: e.target.value })}
                className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">Job URL (Optional)</label>
            <input
              type="url"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-3 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>

          <div className="sticky bottom-0 bg-gray-800 pt-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {job ? 'Update' : 'Add'} Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
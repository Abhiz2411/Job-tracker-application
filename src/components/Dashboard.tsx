import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Briefcase, ListTodo, Send, CalendarDays, CheckCircle2, XCircle, LogOut, Menu } from 'lucide-react';
import { Job, JobStatus } from '../types';
import { JobForm } from './JobForm';
import { StatusBoard } from './StatusBoard';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNotifications } from '../hooks/useNotifications';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<Job | undefined>();
  const [search, setSearch] = React.useState('');
  const [showMenu, setShowMenu] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Initialize notifications
  useNotifications();

  React.useEffect(() => {
    if (!user) return;

    const setupFirestore = async () => {
      try {
        await enableNetwork(db);
        const q = query(collection(db, 'jobs'), where('userId', '==', user.uid));
        return onSnapshot(q, (snapshot) => {
          const jobsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Job[];
          setJobs(jobsData);
        });
      } catch (error) {
        console.error('Error setting up Firestore:', error);
        toast.error('Error loading data');
      }
    };

    const unsubscribe = setupFirestore();

    return () => {
      unsubscribe.then(unsub => {
        unsub?.();
        disableNetwork(db);
      });
    };
  }, [user]);

  const handleSubmit = async (job: Job) => {
    try {
      if (editingJob) {
        await updateDoc(doc(db, 'jobs', job.id), {
          ...job,
          userId: user?.uid,
          updatedAt: new Date().toISOString()
        });
        toast.success('Job updated successfully');
      } else {
        await addDoc(collection(db, 'jobs'), {
          ...job,
          userId: user?.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success('Job added successfully');
      }
      setShowForm(false);
      setEditingJob(undefined);
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Error saving job');
    }
  };

  const handleLogout = async () => {
    try {
      await disableNetwork(db);
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.position.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const boards = [
    {
      status: 'PENDING' as JobStatus,
      title: 'Wishlist',
      color: 'text-yellow-500',
      icon: <ListTodo className="w-5 h-5" />,
    },
    {
      status: 'APPLIED' as JobStatus,
      title: 'Applied',
      color: 'text-blue-500',
      icon: <Send className="w-5 h-5" />,
    },
    {
      status: 'INTERVIEWING' as JobStatus,
      title: 'Interviews',
      color: 'text-purple-500',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      status: 'ACCEPTED' as JobStatus,
      title: 'Accepted',
      color: 'text-green-500',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      status: 'REJECTED' as JobStatus,
      title: 'Rejected',
      color: 'text-red-500',
      icon: <XCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-[1800px] mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl md:text-2xl font-bold">Job Tracker</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 md:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Application</span>
              <span className="md:hidden">Add</span>
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center">
            <div className="p-4">
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {boards.map(board => (
            <StatusBoard
              key={board.status}
              title={board.title}
              jobs={filteredJobs.filter(job => job.status === board.status)}
              onEdit={setEditingJob}
              color={board.color}
              icon={board.icon}
            />
          ))}
        </div>
      </div>

      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingJob(undefined);
          }}
        />
      )}
    </div>
  );
}
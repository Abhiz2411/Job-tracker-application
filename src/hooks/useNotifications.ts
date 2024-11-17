import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types';
import { sendInterviewReminder } from '../lib/notifications';
import toast from 'react-hot-toast';

export function useNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkAndSendNotifications = async (jobs: Job[]) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const jobsWithInterviewTomorrow = jobs.filter(job => {
        if (!job.interviewDate) return false;
        const interviewDate = new Date(job.interviewDate);
        interviewDate.setHours(0, 0, 0, 0);
        return interviewDate.getTime() === tomorrow.getTime() && job.status === 'INTERVIEWING';
      });

      for (const job of jobsWithInterviewTomorrow) {
        try {
          const success = await sendInterviewReminder({
            to_email: user.email!,
            to_name: user.displayName || user.email!.split('@')[0],
            company: job.company,
            position: job.position,
            interview_date: new Date(job.interviewDate!).toLocaleDateString(),
          });

          if (success) {
            console.log(`Interview reminder sent for ${job.company}`);
            toast.success(`Interview reminder sent for ${job.company}`);
          }
        } catch (error) {
          console.error('Error sending notification:', error);
          toast.error(`Failed to send reminder for ${job.company}`);
        }
      }
    };

    const q = query(collection(db, 'jobs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      
      checkAndSendNotifications(jobs);
    });

    return () => unsubscribe();
  }, [user]);
}
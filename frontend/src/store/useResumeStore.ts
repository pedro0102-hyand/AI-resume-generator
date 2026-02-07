import { create } from 'zustand';
import api from '../services/api';
import { Resume } from '../types/resume';

interface ResumeState {
  resumes: Resume[];
  isLoading: boolean;
  fetchResumes: () => Promise<void>;
  deleteResume: (id: number) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  isLoading: false,
  fetchResumes: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/resumes/');
      set({ resumes: response.data });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteResume: async (id: number) => {
    await api.delete(`/resumes/${id}`);
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
    }));
  },
}));
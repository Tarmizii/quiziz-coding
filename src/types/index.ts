export interface Question {
  id: string;
  title: string;
  content: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Essay' | 'True-False';
  isPremium: boolean;
  isAnswered?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  questionCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
}

export interface FilterState {
  subjects: string[];
  difficulty: string;
  type: string;
  search: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
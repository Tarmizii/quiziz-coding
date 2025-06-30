import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, Lock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question, FilterState, PaginationState } from '../../types';
import { questions, subjects } from '../../data/mockData';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function QuestionCatalog() {
  const [filters, setFilters] = useLocalStorage<FilterState>('questionFilters', {
    subjects: [],
    difficulty: '',
    type: '',
    search: ''
  });
  
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (debouncedSearch) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.content.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.subjects.length > 0) {
      filtered = filtered.filter(q => filters.subjects.includes(q.subject));
    }

    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.type) {
      filtered = filtered.filter(q => q.type === filters.type);
    }

    return filtered;
  }, [debouncedSearch, filters.subjects, filters.difficulty, filters.type]);

  // Update pagination when filtered questions change
  useEffect(() => {
    const totalPages = Math.ceil(filteredQuestions.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [filteredQuestions.length, pagination.itemsPerPage]);

  // Get current page questions
  const currentQuestions = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, pagination.currentPage, pagination.itemsPerPage]);

  // Simulate loading when search changes
  useEffect(() => {
    if (debouncedSearch) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearch]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    if (value && !searchHistory.includes(value)) {
      setSearchHistory(prev => [value, ...prev.slice(0, 4)]);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return '📝';
      case 'Essay': return '✍️';
      case 'True-False': return '✅';
      default: return '❓';
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page
    if (totalPages > 0) pages.push(1);
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
    
    return pages;
  };

  const unansweredCount = currentQuestions.filter(q => !q.isAnswered).length;

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Question Catalog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our extensive collection of verified questions across multiple subjects
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-20 z-40">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search questions"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
              
              {/* Search History */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2">Recent searches</div>
                    {searchHistory.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(term)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subjects.slice(0, 8).map((subject) => (
                      <label key={subject.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.subjects.includes(subject.name)}
                          onChange={() => handleSubjectToggle(subject.name)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {subject.name} ({subject.questionCount})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="MCQ">Multiple Choice</option>
                    <option value="Essay">Essay</option>
                    <option value="True-False">True/False</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State for Unanswered Questions */}
        {unansweredCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''} on this page
              </span>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : currentQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentQuestions.map((question) => (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 h-[200px] flex flex-col ${
                  !question.isAnswered ? 'border-2 border-red-300' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(question.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  {question.isPremium && (
                    <Lock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {question.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 flex-1 line-clamp-3">
                  {question.content.substring(0, 120)}...
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{question.subject}</span>
                  {!question.isAnswered && (
                    <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
                      Unanswered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {generatePageNumbers().map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    pagination.currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
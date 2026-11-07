import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Bookmark, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Eye, 
  Trash2,
  FileCheck,
  GraduationCap,
  AlertCircle,
  Share2,
  BookOpenCheck
} from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { AcademicResource, ResourceType } from '../types';

interface ResourceRepositoryProps {
  onOpenUpload: () => void;
  onOpenAiSummarizer: (resource: AcademicResource) => void;
}

export const ResourceRepository: React.FC<ResourceRepositoryProps> = ({
  onOpenUpload,
  onOpenAiSummarizer,
}) => {
  const { resources, deleteResource, incrementDownload } = useResources();
  const { currentUser, permissions, toggleBookmark, isBookmarked } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [activePreviewResource, setActivePreviewResource] = useState<AcademicResource | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const departments = useMemo(() => {
    const list = Array.from(new Set(resources.map(r => r.department)));
    return ['all', ...list];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      // Type filter
      if (selectedType !== 'all' && res.resourceType !== selectedType) {
        return false;
      }
      // Department filter
      if (selectedDepartment !== 'all' && res.department !== selectedDepartment) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'all' && res.academicYear !== selectedYear) {
        return false;
      }
      // Search query (title, courseCode, tags, summary)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesCode = res.courseCode.toLowerCase().includes(q);
        const matchesDept = res.department.toLowerCase().includes(q);
        const matchesTags = res.tags.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesCode || matchesDept || matchesTags;
      }
      return true;
    });
  }, [resources, selectedType, selectedDepartment, selectedYear, searchQuery]);

  const handleDownload = (res: AcademicResource) => {
    incrementDownload(res.id);
    showToast(`Downloading "${res.fileName}" (${res.fileSize})`);
  };

  const getFormatBadgeStyle = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'DOCX':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ZIP':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeLabel = (type: ResourceType) => {
    switch (type) {
      case 'past_paper':
        return 'Past Examination Paper';
      case 'lecture_notes':
        return 'Lecture Notes';
      case 'syllabus':
        return 'Official Syllabus';
      case 'lab_manual':
        return 'Lab Manual';
      case 'project_doc':
        return 'Project Blueprint / SRS';
      case 'marking_scheme':
        return 'Model Marking Scheme';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <BookOpenCheck className="w-3.5 h-3.5" />
            Centralized Academic Repository & Past Examination Archive
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Resources & Past Papers
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Access past semester papers, verified model solutions, lecture slides, and laboratory workbooks cataloged for Mwangaza School students and faculty.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              {permissions.canUploadOfficial ? 'Upload Past Paper / Note' : 'Share Student Revision Note'}
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/60">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>All uploads auto-indexed by <strong>Gemini 3.8 Flash</strong></span>
            </div>
          </div>
        </div>

        {/* Decorative Grid Backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by course (e.g. CS 201), topic (Algorithms, Organic), or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Academic Years</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2022/2023">2022/2023</option>
            </select>
          </div>
        </div>

        {/* Quick Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'past_paper', label: 'Past Papers (Official)' },
            { id: 'lecture_notes', label: 'Lecture Notes' },
            { id: 'lab_manual', label: 'Lab Manuals' },
            { id: 'syllabus', label: 'Syllabi' },
            { id: 'project_doc', label: 'Project Blueprints' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong>{filteredResources.length}</strong> academic resources cataloged</span>
        <span className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          Synchronized with Cloud Firestore
        </span>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No resources found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your course query or clearing filters. You can also upload the first document for this course unit.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedDepartment('all');
              setSearchQuery('');
            }}
            className="mt-4 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl group"
            >
              <div>
                {/* Header row: Course Code & Format badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {res.courseCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getFormatBadgeStyle(res.fileFormat)}`}>
                      {res.fileFormat} • {res.fileSize}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(res.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isBookmarked(res.id)
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                    title={isBookmarked(res.id) ? 'Remove bookmark' : 'Bookmark for revision'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Resource Title */}
                <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-blue-300 transition-colors">
                  {res.title}
                </h3>

                {/* Subtitle / Department */}
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {res.department} • {res.academicYear} ({res.semester})
                </p>

                {/* Faculty Verified Badge */}
                <div className="mt-2.5 flex items-center gap-2">
                  {res.verifiedByFaculty ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Faculty Endorsed Solution
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      Peer Contribution
                    </span>
                  )}
                  {res.difficultyLevel && (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {res.difficultyLevel}
                    </span>
                  )}
                </div>

                {/* AI Executive Summary Snippet */}
                {res.summary && (
                  <div className="mt-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-400 mb-1">
                      <Sparkles className="w-3 h-3" />
                      Gemini Academic Summary
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {res.summary}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {res.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                  {res.tags.length > 3 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{res.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{res.downloadCount} downloads</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActivePreviewResource(res)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View details & key takeaways"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenAiSummarizer(res)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Generate exam review flashcards with Gemini"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI Review
                  </button>

                  <button
                    onClick={() => handleDownload(res)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Get File
                  </button>

                  {permissions.canDeleteAnyResource && (
                    <button
                      onClick={() => deleteResource(res.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      title="Admin Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Full Resource Details & AI Study Takeaways */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/40">
                    {activePreviewResource.courseCode}
                  </span>
                  <span className="text-xs text-slate-400">
                    {getTypeLabel(activePreviewResource.resourceType)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {activePreviewResource.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Uploaded by {activePreviewResource.uploaderName} • {activePreviewResource.academicYear}
                </p>
              </div>
              <button
                onClick={() => setActivePreviewResource(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Executive Summary */}
              {activePreviewResource.summary && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    Executive Academic Overview (Gemini 3.8 Flash)
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activePreviewResource.summary}
                  </p>
                </div>
              )}

              {/* Key Learning Takeaways */}
              {activePreviewResource.keyTakeaways && activePreviewResource.keyTakeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Syllabus Takeaways & Exam Pointers
                  </h4>
                  <ul className="space-y-1.5">
                    {activePreviewResource.keyTakeaways.map((point, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">File Format</span>
                  <span className="font-semibold text-slate-200">{activePreviewResource.fileFormat} ({activePreviewResource.fileSize})</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Difficulty</span>
                  <span className="font-semibold text-slate-200">{activePreviewResource.difficultyLevel || 'Standard'}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Estimated Read</span>
                  <span className="font-semibold text-slate-200">{activePreviewResource.estimatedReadTimeMinutes || 20} mins</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Downloads</span>
                  <span className="font-semibold text-slate-200">{activePreviewResource.downloadCount}</span>
                </div>
              </div>

              {/* All Tags */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Curriculum Taxonomy Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {activePreviewResource.tags.map((t, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-blue-900/30 text-blue-300 border border-blue-800/50">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenAiSummarizer(activePreviewResource);
                  setActivePreviewResource(null);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Full AI Copilot Analysis
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePreviewResource(null)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(activePreviewResource);
                    setActivePreviewResource(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

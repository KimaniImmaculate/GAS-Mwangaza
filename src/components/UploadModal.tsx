import React, { useState } from 'react';
import { 
  Upload, 
  X, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Tag as TagIcon,
  Loader2
} from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { geminiService } from '../services/geminiService';
import { ResourceType, FileFormat } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addResource } = useResources();
  const { currentUser, permissions } = useAuth();

  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS 201');
  const [courseName, setCourseName] = useState('Data Structures and Algorithms');
  const [department, setDepartment] = useState('School of Computing & Informatics');
  const [faculty, setFaculty] = useState('Science & Technology');
  const [resourceType, setResourceType] = useState<ResourceType>('past_paper');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [semester, setSemester] = useState('Semester 1');
  const [fileFormat, setFileFormat] = useState<FileFormat>('PDF');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [textContent, setTextContent] = useState('');
  const [customTags, setCustomTags] = useState('Algorithms, ExamPrep, Semester1');

  // AI Generation States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiTakeaways, setAiTakeaways] = useState<string[]>([]);
  const [aiDifficulty, setAiDifficulty] = useState<'Foundational' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [aiEstimatedTime, setAiEstimatedTime] = useState(15);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunGeminiAutoAnalysis = async () => {
    if (!title.trim()) {
      alert('Please enter a Resource Title first so Gemini can analyze context.');
      return;
    }

    setIsAiLoading(true);
    setAiNotice(null);

    try {
      const result = await geminiService.summarizeResource({
        title,
        subject: courseName || courseCode,
        faculty,
        resourceType,
        textContent: textContent || title,
      });

      setAiSummary(result.summary);
      setAiTakeaways(result.keyTakeaways);
      setAiDifficulty(result.difficultyLevel);
      setAiEstimatedTime(result.estimatedReadTimeMinutes);
      if (result.tags && result.tags.length > 0) {
        setCustomTags(result.tags.join(', '));
      }
      setAiNotice('Gemini 3.8 Flash auto-generated tags & summary successfully!');
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setAiNotice('Note: Fallback academic heuristic tags applied.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !courseCode.trim()) {
      alert('Please fill in required fields (Title and Course Code).');
      return;
    }

    const parsedTags = customTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const isOfficial = permissions.canUploadOfficial;

    addResource({
      title,
      courseCode: courseCode.toUpperCase(),
      courseName: courseName || courseCode,
      department,
      faculty,
      resourceType,
      academicYear,
      semester,
      fileName: `${courseCode.replace(/\s+/g, '_')}_${Date.now()}.${fileFormat.toLowerCase()}`,
      fileSize,
      fileFormat,
      downloadUrl: '#',
      uploadedBy: currentUser.uid,
      uploaderRole: currentUser.role,
      uploaderName: currentUser.displayName,
      status: isOfficial ? 'approved' : 'pending_moderation',
      summary: aiSummary || `Academic resource uploaded by ${currentUser.displayName} for ${courseCode}.`,
      keyTakeaways: aiTakeaways.length > 0 ? aiTakeaways : ['Complete coverage of syllabus unit.', 'Preparation guide for semester evaluations.'],
      tags: parsedTags.length > 0 ? parsedTags : [courseCode, 'Curriculum'],
      difficultyLevel: aiDifficulty,
      estimatedReadTimeMinutes: aiEstimatedTime,
      verifiedByFaculty: isOfficial,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {permissions.canUploadOfficial ? 'Faculty Publishing' : 'Student Submission'}
              </span>
              <span className="text-xs text-slate-400">Cloud Firestore & Storage Ingestion</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Upload Academic Resource
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* RBAC notice banner */}
          <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
            permissions.canUploadOfficial
              ? 'bg-blue-950/40 border-blue-600/40 text-blue-200'
              : 'bg-amber-950/40 border-amber-600/40 text-amber-200'
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              {permissions.canUploadOfficial ? (
                <span>
                  <strong>Faculty / Admin Mode:</strong> Your upload will be automatically cataloged as an <strong>Official Approved Resource</strong> with verified faculty solutions badge.
                </span>
              ) : (
                <span>
                  <strong>Student Contributor Mode:</strong> Upload will be assigned to your student profile (Amara Otieno) and marked for faculty review before global past paper indexing.
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Resource Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems Final Exam 2024 (With Solutions)"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                placeholder="e.g. CS 201"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Full Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={e => setCourseName(e.target.value)}
                placeholder="e.g. Data Structures and Algorithms"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Department and Resource Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="School of Computing & Informatics">School of Computing & Informatics</option>
                <option value="Pure & Applied Sciences">Pure & Applied Sciences</option>
                <option value="School of Business & Economics">School of Business & Economics</option>
                <option value="School of Electrical & Electronic Engineering">School of Electrical & Electronic Engineering</option>
                <option value="School of Law & Governance">School of Law & Governance</option>
                <option value="School of Medicine & Health Sciences">School of Medicine & Health Sciences</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Resource Category
              </label>
              <select
                value={resourceType}
                onChange={e => setResourceType(e.target.value as ResourceType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="past_paper">Past Examination Paper</option>
                <option value="lecture_notes">Lecture Notes / Slides</option>
                <option value="syllabus">Official Course Syllabus</option>
                <option value="lab_manual">Lab Manual / Practical Guide</option>
                <option value="project_doc">Project Documentation / SRS</option>
                <option value="marking_scheme">Model Marking Scheme</option>
              </select>
            </div>
          </div>

          {/* Academic Year and Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
                <option value="2022/2023">2022/2023</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Special Exam Term">Special Exam Term</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                File Format
              </label>
              <select
                value={fileFormat}
                onChange={e => setFileFormat(e.target.value as FileFormat)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOCX">Microsoft Word (DOCX)</option>
                <option value="ZIP">ZIP Archive</option>
                <option value="PPTX">PowerPoint (PPTX)</option>
              </select>
            </div>
          </div>

          {/* Syllabus or Paper Content Excerpt (For AI Auto-summarization) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Resource Text / Exam Topics (Optional for AI analysis)
              </label>
              <button
                type="button"
                onClick={handleRunGeminiAutoAnalysis}
                disabled={isAiLoading}
                className="text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing with Gemini 3.8 Flash...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Auto-Generate Summary & Tags
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={3}
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="Paste syllabus extract, past paper questions, or lecture summary here to trigger automated AI classification..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* AI Generated Preview Card */}
          {aiSummary && (
            <div className="bg-purple-950/30 border border-purple-600/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Summary Preview
                </span>
                <span className="text-[10px] bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded-full">
                  Level: {aiDifficulty} • ~{aiEstimatedTime} min read
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiSummary}
              </p>
              {aiTakeaways.length > 0 && (
                <div className="text-[11px] text-slate-400 space-y-1">
                  <strong className="text-slate-300">Generated Takeaways:</strong>
                  {aiTakeaways.slice(0, 2).map((pt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-purple-400">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Taxonomy Tags (Comma separated)
            </label>
            <input
              type="text"
              value={customTags}
              onChange={e => setCustomTags(e.target.value)}
              placeholder="e.g. GraphTraversal, AVL-Trees, Exam-Prep"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Drag & Drop Simulation Zone */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/80 rounded-xl p-5 text-center transition-colors bg-slate-950/40 cursor-pointer">
            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-300">
              Drag & Drop syllabus or past paper here, or <span className="text-blue-400 underline">browse files</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Supports PDF, DOCX, ZIP up to 50MB per institutional guidelines
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Publishing as: <span className="text-slate-300 font-medium">{currentUser.displayName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Complete Ingestion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

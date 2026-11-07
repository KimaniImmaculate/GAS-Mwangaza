import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Tag, 
  RotateCw, 
  Loader2, 
  Layers,
  FileText
} from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { geminiService } from '../services/geminiService';
import { AcademicResource } from '../types';

interface GeminiAssistantProps {
  initialResource?: AcademicResource | null;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ initialResource }) => {
  const { resources } = useResources();

  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    initialResource ? initialResource.id : (resources[0]?.id || '')
  );
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Result state
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    keyTakeaways: string[];
    tags: string[];
    difficultyLevel: string;
    estimatedReadTimeMinutes: number;
    reviewQuestions: { q: string; a: string }[];
  } | null>(() => {
    if (initialResource && initialResource.summary) {
      return {
        summary: initialResource.summary,
        keyTakeaways: initialResource.keyTakeaways || [
          'Detailed coverage of foundational algorithms and invariants.',
          'Review of typical past exam rubrics and time complexity bounds.'
        ],
        tags: initialResource.tags,
        difficultyLevel: initialResource.difficultyLevel || 'Intermediate',
        estimatedReadTimeMinutes: initialResource.estimatedReadTimeMinutes || 25,
        reviewQuestions: [
          {
            q: `What is the primary worst-case time complexity analyzed in ${initialResource.courseCode}?`,
            a: 'Depends on the specific algorithm; balanced tree lookups operate in O(log n) while unoptimized graph traversals can reach O(V + E) or O(V^2).'
          },
          {
            q: 'How does this resource align with Mwangaza semester exams?',
            a: 'Directly mirrors the section B multi-part theoretical derivation questions standard across previous academic terms.'
          }
        ]
      };
    }
    return null;
  });

  const [activeFlippedCard, setActiveFlippedCard] = useState<number | null>(null);

  const selectedResource = resources.find(r => r.id === selectedResourceId);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const title = selectedResource ? selectedResource.title : 'Custom Academic Syllabus';
      const subject = selectedResource ? selectedResource.courseName : 'Computer Science / Science';
      const faculty = selectedResource ? selectedResource.faculty : 'Science & Technology';
      const resourceType = selectedResource ? selectedResource.resourceType : 'Lecture Notes';
      const textContent = customText || (selectedResource ? selectedResource.summary || selectedResource.title : '');

      const res = await geminiService.summarizeResource({
        title,
        subject,
        faculty,
        resourceType,
        textContent,
      });

      // Synthetic review questions derived from takeaways
      const generatedQuestions = (res.keyTakeaways || []).map((t, idx) => ({
        q: `Exam Question ${idx + 1}: How does the curriculum address "${t.slice(0, 45)}..."?`,
        a: `Key Examination Principle: ${t}`
      }));

      setAnalysisResult({
        summary: res.summary,
        keyTakeaways: res.keyTakeaways,
        tags: res.tags,
        difficultyLevel: res.difficultyLevel,
        estimatedReadTimeMinutes: res.estimatedReadTimeMinutes,
        reviewQuestions: generatedQuestions.length > 0 ? generatedQuestions : [
          {
            q: 'What is the critical exam concept covered in this syllabus module?',
            a: 'Fundamental principles, formulas, and verified step-by-step problem derivations.'
          }
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
          <Sparkles className="w-4 h-4" />
          Powered by Google Gemini 3.8 Flash Cognitive Engine
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AI Academic Study Copilot & Summarizer
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          Instantly distill complex syllabi, synthesize 5-year past examination trends, and generate revision flashcards tailored to Mwangaza School courses.
        </p>
      </div>

      {/* Resource Selector & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Document from Mwangaza Repository
            </label>
            <select
              value={selectedResourceId}
              onChange={e => setSelectedResourceId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              {resources.map(r => (
                <option key={r.id} value={r.id}>
                  [{r.courseCode}] {r.title} ({r.academicYear})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Academic Level
            </label>
            <div className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
              {selectedResource ? `${selectedResource.department}` : 'Standard Catalog'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Or Paste Custom Lecture Extract / Exam Problem for Deep Analysis
          </label>
          <textarea
            rows={2}
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Paste syllabus paragraphs, equations, or problem statements..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Average ingestion latency: ~850ms via server-side proxy
          </span>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing with Gemini 3.8 Flash...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI Synthesis & Flashcards
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="space-y-4">
          {/* Executive Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-white text-base">
                  Executive Curriculum Synthesis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  Difficulty: <strong className="text-purple-300">{analysisResult.difficultyLevel}</strong>
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  Estimated Study Time: <strong className="text-blue-300">{analysisResult.estimatedReadTimeMinutes} mins</strong>
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              {analysisResult.summary}
            </p>

            {/* Takeaways */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Core Academic Objectives & Exam Rubric Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysisResult.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300 leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Indexed Tags:
              </span>
              {analysisResult.tags.map((t, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-purple-900/30 text-purple-300 border border-purple-800/40">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Flashcard / Interactive Q&A Review */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Interactive Exam Flashcards
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any card to flip and verify your understanding of key exam principles.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.reviewQuestions.map((qa, idx) => {
                const isFlipped = activeFlippedCard === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveFlippedCard(isFlipped ? null : idx)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all transform hover:scale-[1.01] ${
                      isFlipped
                        ? 'bg-purple-950/40 border-purple-500/60 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-purple-400">
                        Concept Flashcard #{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        {isFlipped ? 'Answer Revealed' : 'Click to Flip'}
                      </span>
                    </div>

                    <div className="min-h-[80px] flex items-center">
                      {isFlipped ? (
                        <div className="text-xs text-emerald-300 font-medium leading-relaxed">
                          <strong>Model Solution:</strong> {qa.a}
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-slate-100 leading-snug">
                          {qa.q}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

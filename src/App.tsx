import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ResourceProvider } from './context/ResourceContext';
import { Navbar } from './components/Navbar';
import { ResourceRepository } from './components/ResourceRepository';
import { TimetableSchedule } from './components/TimetableSchedule';
import { DiscussionCollab } from './components/DiscussionCollab';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ArchitectureSpecViewer } from './components/ArchitectureSpecViewer';
import { UploadModal } from './components/UploadModal';
import { AcademicResource } from './types';
import { GraduationCap, ShieldCheck, Database, Sparkles, Terminal } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'resources' | 'timetable' | 'discussions' | 'ai-assistant' | 'architecture'>('resources');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAiResource, setSelectedAiResource] = useState<AcademicResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenAiSummarizer = (res: AcademicResource) => {
    setSelectedAiResource(res);
    setActiveTab('ai-assistant');
  };

  return (
    <div className="min-h-screen bg-[#0c111d] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation & Role Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openUploadModal={() => setIsUploadOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'resources' && (
          <ResourceRepository
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenAiSummarizer={handleOpenAiSummarizer}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableSchedule />
        )}

        {activeTab === 'discussions' && (
          <DiscussionCollab />
        )}

        {activeTab === 'ai-assistant' && (
          <GeminiAssistant initialResource={selectedAiResource} />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureSpecViewer />
        )}
      </main>

      {/* Global Resource Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Institutional Production Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Mwangaza School • Student Resource Hub & Technical Platform
              </p>
              <p className="text-[11px] text-slate-500">
                Cloud-Native Academic Architecture • Directorate of ICT & Academic Services
              </p>
            </div>
          </div>

          {/* System Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Firestore: Multi-Region Active
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI: Gemini 3.8 Flash Proxy
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              Auth: RBAC Enforced
            </span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="px-2.5 py-1 rounded-md bg-indigo-900/30 text-indigo-300 border border-indigo-700/40 hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              Inspect Spec
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ResourceProvider>
        <AppContent />
      </ResourceProvider>
    </AuthProvider>
  );
}

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  FileCode2, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown,
  Layers,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: 'resources' | 'timetable' | 'discussions' | 'ai-assistant' | 'architecture';
  setActiveTab: (tab: 'resources' | 'timetable' | 'discussions' | 'ai-assistant' | 'architecture') => void;
  openUploadModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openUploadModal,
  searchQuery,
  setSearchQuery,
}) => {
  const { currentUser, switchUser, permissions } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);

  const rolesList: { role: UserRole; label: string; desc: string; badgeColor: string }[] = [
    {
      role: 'student',
      label: 'Student (Amara Otieno)',
      desc: 'Browse, download past papers, upload study notes',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      role: 'faculty',
      label: 'Faculty (Dr. Kwame Mensah)',
      desc: 'Publish official past papers, verify Q&A, manage schedule',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      role: 'admin',
      label: 'Administrator (Mwangaza Registry)',
      desc: 'Full governance, audit rules, user moderation',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c111d]/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border-b border-blue-500/20 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Mwangaza School Academic Portal 2024/2025</span>
          <span className="hidden sm:inline text-slate-400">• Semester 1 Exam Archive & Timetable Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden md:inline">Current Role:</span>
          <span className="font-medium text-blue-400 capitalize flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {currentUser.role} View
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <button 
            onClick={() => setActiveTab('architecture')}
            className="text-xs text-indigo-300 hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            View Technical Spec
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & School Branding */}
          <div 
            onClick={() => setActiveTab('resources')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-blue-300 transition-colors">
                  Mwangaza
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Resource Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Academic Repository & Student Services
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'resources'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Resource Archive
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'timetable'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Timetable & Classes
            </button>

            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'discussions'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Discussions & Groups
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'ai-assistant'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Gemini AI Study Copilot
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/30'
              }`}
            >
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              Technical Spec & Blueprint
            </button>
          </nav>

          {/* Right Action: Role Switcher & Upload */}
          <div className="flex items-center gap-3">
            {/* Quick Upload CTA */}
            <button
              onClick={openUploadModal}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              {permissions.canUploadOfficial ? 'Upload Resource' : 'Share Study Notes'}
            </button>

            {/* Role Simulation Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-all text-left"
                title="Switch test persona to verify RBAC logic"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-blue-400 capitalize font-medium flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" />
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-2.5 py-2 border-b border-slate-800 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Simulate RBAC User Role
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Verify security rules and access gates across user tiers.
                    </p>
                  </div>

                  <div className="space-y-1">
                    {rolesList.map(item => (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchUser(item.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                          currentUser.role === item.role
                            ? 'bg-blue-950/60 border border-blue-500/40 text-blue-200'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          <div className={`w-2 h-2 rounded-full ${currentUser.role === item.role ? 'bg-blue-400' : 'bg-slate-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-100 flex items-center justify-between">
                            {item.label}
                            {currentUser.role === item.role && (
                              <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-500/30 text-blue-300">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 px-2 text-[10px] text-slate-500">
                    Department: <span className="text-slate-300">{currentUser.department}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/90 px-3 py-2 flex items-center justify-around overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Archive
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'timetable' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Timetable
        </button>
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'discussions' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Discussions
        </button>
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ai-assistant' ? 'bg-purple-600 text-white' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Copilot
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          Tech Spec
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  ThumbsUp, 
  CheckCircle2, 
  Send, 
  Plus, 
  Link as LinkIcon, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  Video,
  ExternalLink
} from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { DiscussionPost, StudyGroup } from '../types';

export const DiscussionCollab: React.FC = () => {
  const { 
    discussions, 
    studyGroups, 
    addDiscussionPost, 
    addDiscussionReply, 
    toggleUpvote, 
    addStudyGroup 
  } = useResources();
  const { currentUser, permissions, toggleJoinGroup, isGroupJoined } = useAuth();

  const [activeTab, setActiveTab] = useState<'discussions' | 'study-groups'>('discussions');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // New Post Form
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCourse, setPostCourse] = useState('CS 201');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('Algorithms, Midterm');

  // New Study Group Form
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupCourse, setGroupCourse] = useState('CS 201');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupPlatform, setGroupPlatform] = useState<'Google Meet' | 'Discord' | 'Science Library Rm 2B' | 'Engineering Lab 4'>('Google Meet');
  const [groupMeetLink, setGroupMeetLink] = useState('https://meet.google.com/mwg-study');
  const [groupSchedule, setGroupSchedule] = useState('Wednesdays, 17:00 EAT');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addDiscussionPost({
      title: postTitle,
      content: postContent,
      courseCode: postCourse.toUpperCase(),
      authorName: currentUser.displayName,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      tags: postTags.split(',').map(t => t.trim()).filter(Boolean),
    });

    setPostTitle('');
    setPostContent('');
    setIsNewPostOpen(false);
  };

  const handleSendReply = (postId: string) => {
    if (!replyText.trim()) return;
    addDiscussionReply(
      postId,
      replyText,
      currentUser.displayName,
      currentUser.role,
      currentUser.avatarUrl
    );
    setReplyText('');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim()) return;

    addStudyGroup({
      title: groupTitle,
      courseCode: groupCourse.toUpperCase(),
      description: groupDesc || 'Collaborative study group for Mwangaza students.',
      platform: groupPlatform,
      meetLink: groupMeetLink,
      maxMembers: 12,
      leaderName: currentUser.displayName,
      scheduleTime: groupSchedule,
      tags: [groupCourse, 'PeerGroup', 'Revision'],
    });

    setGroupTitle('');
    setGroupDesc('');
    setIsNewGroupOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Users className="w-4 h-4" />
            Peer Collaboration & Academic Inquiries
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Academic Discussion & Study Circles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Engage with faculty lecturers, clarify tricky past paper questions, and join peer-led study groups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'discussions' ? (
            <button
              onClick={() => setIsNewPostOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ask Academic Question
            </button>
          ) : (
            <button
              onClick={() => setIsNewGroupOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Study Group
            </button>
          )}
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'discussions'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Academic Q&A Forum ({discussions.length})
        </button>

        <button
          onClick={() => setActiveTab('study-groups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'study-groups'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Peer Study Circles & Meet Links ({studyGroups.length})
        </button>
      </div>

      {/* TAB 1: Discussions Forum */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          {discussions.map(post => (
            <div
              key={post.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 flex-shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {post.authorName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 capitalize">
                        {post.authorRole}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                        {post.courseCode}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upvote & Verification status */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleUpvote(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      post.isUpvoted
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  {post.isFacultyVerified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Faculty Endorsed
                    </span>
                  )}
                </div>
              </div>

              {/* Replies Section */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                {post.replies.map(rep => (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-xl border text-xs ${
                      rep.isFacultyEndorsed
                        ? 'bg-blue-950/40 border-blue-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={rep.authorAvatar}
                          alt={rep.authorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-200">{rep.authorName}</span>
                        {rep.authorRole === 'faculty' && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            Faculty Lecturer
                          </span>
                        )}
                      </div>
                      {rep.isFacultyEndorsed && (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Solution
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed pl-7">
                      {rep.content}
                    </p>
                  </div>
                ))}

                {/* Reply Input Box */}
                <div className="flex items-center gap-2 mt-3 pl-2">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30"
                  />
                  <input
                    type="text"
                    value={selectedPostId === post.id ? replyText : ''}
                    onFocus={() => setSelectedPostId(post.id)}
                    onChange={e => {
                      setSelectedPostId(post.id);
                      setReplyText(e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSendReply(post.id);
                      }
                    }}
                    placeholder={`Reply as ${currentUser.displayName}...`}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSendReply(post.id)}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                    title="Send Reply"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Study Groups */}
      {activeTab === 'study-groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyGroups.map(grp => {
            const joined = isGroupJoined(grp.id) || grp.isJoined;
            return (
              <div
                key={grp.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {grp.courseCode}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {grp.memberCount} / {grp.maxMembers} Members
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">
                    {grp.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {grp.description}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{grp.scheduleTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-purple-400" />
                      <span>Venue: {grp.platform}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Lead: <span className="text-slate-200 font-medium">{grp.leaderName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {grp.meetLink && (
                    <a
                      href={grp.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Link
                    </a>
                  )}

                  <button
                    onClick={() => toggleJoinGroup(grp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      joined
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {joined ? '✓ Member of Circle' : 'Join Study Circle'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Question Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">
              Ask an Academic Question
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Post to Mwangaza course discussion board for faculty and peer feedback.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={postCourse}
                  onChange={e => setPostCourse(e.target.value)}
                  placeholder="e.g. CS 201"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="e.g. Clarification on Dijkstra negative weight cycles"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Details</label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Explain what concept or past paper problem you need help with..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags</label>
                <input
                  type="text"
                  value={postTags}
                  onChange={e => setPostTags(e.target.value)}
                  placeholder="Algorithms, Graphs, ExamPrep"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Study Group Modal */}
      {isNewGroupOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">
              Create a Peer Study Circle
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Gather classmates for weekly problem-solving and exam revision sprints.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Study Group Title</label>
                <input
                  type="text"
                  required
                  value={groupTitle}
                  onChange={e => setGroupTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Lab Sprint"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={groupCourse}
                    onChange={e => setGroupCourse(e.target.value)}
                    placeholder="e.g. CS 201"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Schedule Time</label>
                  <input
                    type="text"
                    value={groupSchedule}
                    onChange={e => setGroupSchedule(e.target.value)}
                    placeholder="e.g. Fridays 18:00 EAT"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Platform / Location</label>
                <select
                  value={groupPlatform}
                  onChange={e => setGroupPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Discord">Discord Channel</option>
                  <option value="Science Library Rm 2B">Science Library Rm 2B</option>
                  <option value="Engineering Lab 4">Engineering Lab 4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Collaboration Link</label>
                <input
                  type="text"
                  value={groupMeetLink}
                  onChange={e => setGroupMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Focus</label>
                <textarea
                  rows={2}
                  value={groupDesc}
                  onChange={e => setGroupDesc(e.target.value)}
                  placeholder="Goals for this study circle..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewGroupOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Publish Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

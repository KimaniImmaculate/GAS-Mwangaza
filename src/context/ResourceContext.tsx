import React, { createContext, useContext, useState, useEffect } from 'react';
import { AcademicResource, TimetableSlot, DiscussionPost, StudyGroup } from '../types';
import { 
  INITIAL_RESOURCES, 
  INITIAL_TIMETABLE, 
  INITIAL_DISCUSSIONS, 
  INITIAL_STUDY_GROUPS 
} from '../data/seedData';

interface ResourceContextType {
  resources: AcademicResource[];
  timetable: TimetableSlot[];
  discussions: DiscussionPost[];
  studyGroups: StudyGroup[];
  addResource: (resource: Omit<AcademicResource, 'id' | 'createdAt' | 'downloadCount' | 'rating'>) => void;
  deleteResource: (id: string) => void;
  incrementDownload: (id: string) => void;
  addDiscussionPost: (post: Omit<DiscussionPost, 'id' | 'createdAt' | 'upvotes' | 'repliesCount' | 'replies' | 'isFacultyVerified'>) => void;
  addDiscussionReply: (postId: string, content: string, authorName: string, authorRole: any, authorAvatar: string) => void;
  toggleUpvote: (postId: string) => void;
  verifyDiscussionPost: (postId: string) => void;
  addStudyGroup: (group: Omit<StudyGroup, 'id' | 'memberCount' | 'isJoined'>) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<AcademicResource[]>(() => {
    const saved = localStorage.getItem('mwangaza_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('mwangaza_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [discussions, setDiscussions] = useState<DiscussionPost[]>(() => {
    const saved = localStorage.getItem('mwangaza_discussions');
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('mwangaza_study_groups');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('mwangaza_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('mwangaza_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('mwangaza_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('mwangaza_study_groups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  const addResource = (resData: Omit<AcademicResource, 'id' | 'createdAt' | 'downloadCount' | 'rating'>) => {
    const newResource: AcademicResource = {
      ...resData,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      rating: 5.0,
    };
    setResources(prev => [newResource, ...prev]);
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const incrementDownload = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
  };

  const addDiscussionPost = (postData: Omit<DiscussionPost, 'id' | 'createdAt' | 'upvotes' | 'repliesCount' | 'replies' | 'isFacultyVerified'>) => {
    const newPost: DiscussionPost = {
      ...postData,
      id: `disc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      isUpvoted: true,
      repliesCount: 0,
      isFacultyVerified: postData.authorRole === 'faculty',
      replies: []
    };
    setDiscussions(prev => [newPost, ...prev]);
  };

  const addDiscussionReply = (postId: string, content: string, authorName: string, authorRole: any, authorAvatar: string) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      authorName,
      authorRole,
      authorAvatar,
      content,
      isFacultyEndorsed: authorRole === 'faculty',
      createdAt: new Date().toISOString(),
    };

    setDiscussions(prev => prev.map(d => {
      if (d.id === postId) {
        return {
          ...d,
          repliesCount: d.repliesCount + 1,
          isFacultyVerified: d.isFacultyVerified || authorRole === 'faculty',
          replies: [...d.replies, newReply]
        };
      }
      return d;
    }));
  };

  const toggleUpvote = (postId: string) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === postId) {
        const isCurrentlyUpvoted = Boolean(d.isUpvoted);
        return {
          ...d,
          isUpvoted: !isCurrentlyUpvoted,
          upvotes: isCurrentlyUpvoted ? d.upvotes - 1 : d.upvotes + 1
        };
      }
      return d;
    }));
  };

  const verifyDiscussionPost = (postId: string) => {
    setDiscussions(prev => prev.map(d => d.id === postId ? { ...d, isFacultyVerified: true } : d));
  };

  const addStudyGroup = (groupData: Omit<StudyGroup, 'id' | 'memberCount' | 'isJoined'>) => {
    const newGroup: StudyGroup = {
      ...groupData,
      id: `grp-${Date.now()}`,
      memberCount: 1,
      isJoined: true
    };
    setStudyGroups(prev => [newGroup, ...prev]);
  };

  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `time-${Date.now()}`
    };
    setTimetable(prev => [...prev, newSlot]);
  };

  return (
    <ResourceContext.Provider
      value={{
        resources,
        timetable,
        discussions,
        studyGroups,
        addResource,
        deleteResource,
        incrementDownload,
        addDiscussionPost,
        addDiscussionReply,
        toggleUpvote,
        verifyDiscussionPost,
        addStudyGroup,
        addTimetableSlot,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = (): ResourceContextType => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};

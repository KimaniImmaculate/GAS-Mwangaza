import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: UserProfile;
  switchUser: (role: UserRole) => void;
  toggleBookmark: (resourceId: string) => void;
  toggleJoinGroup: (groupId: string) => void;
  isBookmarked: (resourceId: string) => boolean;
  isGroupJoined: (groupId: string) => boolean;
  permissions: {
    canUploadOfficial: boolean;
    canModerateResources: boolean;
    canVerifyDiscussions: boolean;
    canManageTimetable: boolean;
    canDeleteAnyResource: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mwangaza_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Student default
  });

  useEffect(() => {
    localStorage.setItem('mwangaza_active_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (role: UserRole) => {
    const target = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
  };

  const toggleBookmark = (resourceId: string) => {
    setCurrentUser(prev => {
      const exists = prev.bookmarkedResourceIds.includes(resourceId);
      const nextBookmarks = exists 
        ? prev.bookmarkedResourceIds.filter(id => id !== resourceId)
        : [...prev.bookmarkedResourceIds, resourceId];
      return { ...prev, bookmarkedResourceIds: nextBookmarks };
    });
  };

  const toggleJoinGroup = (groupId: string) => {
    setCurrentUser(prev => {
      const exists = prev.joinedGroupIds.includes(groupId);
      const nextGroups = exists
        ? prev.joinedGroupIds.filter(id => id !== groupId)
        : [...prev.joinedGroupIds, groupId];
      return { ...prev, joinedGroupIds: nextGroups };
    });
  };

  const isBookmarked = (resourceId: string) => {
    return currentUser.bookmarkedResourceIds.includes(resourceId);
  };

  const isGroupJoined = (groupId: string) => {
    return currentUser.joinedGroupIds.includes(groupId);
  };

  const permissions = {
    canUploadOfficial: currentUser.role === 'faculty' || currentUser.role === 'admin',
    canModerateResources: currentUser.role === 'admin' || currentUser.role === 'faculty',
    canVerifyDiscussions: currentUser.role === 'faculty' || currentUser.role === 'admin',
    canManageTimetable: currentUser.role === 'faculty' || currentUser.role === 'admin',
    canDeleteAnyResource: currentUser.role === 'admin',
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        toggleBookmark,
        toggleJoinGroup,
        isBookmarked,
        isGroupJoined,
        permissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

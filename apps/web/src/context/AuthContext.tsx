import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/features/auth/components/AuthScreen';

export interface AuthUser {
  token?: string;
  phoneNumber: string;
  role: UserRole;
  isProfileComplete: boolean;
  fullName?: string;
  avatarUrl?: string;
  age?: string;
  nationalId?: string;
  height?: string;
  weight?: string;
  bicep?: string;
  calf?: string;
  chest?: string;
  thigh?: string;
  bodyPhotoUrl?: string;
  experienceYears?: string;
  preferredFoot?: string;
  position?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (user: Partial<AuthUser> & { phoneNumber: string; role: UserRole }) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSecretAdminOpen: boolean;
  setIsSecretAdminOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'first_touch_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);

  // Sync auth state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Hidden stealth access for Secret Admin (via secret URL param, hash or Ctrl+Alt+Shift+A)
  useEffect(() => {
    const checkSecretRoute = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('secret_admin') === 'ft-console-secure-x99' ||
        window.location.hash === '#ft-secret-terminal'
      ) {
        setIsSecretAdminOpen(true);
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Key: Ctrl + Shift + Alt + A
      if (e.ctrlKey && e.shiftKey && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش')) {
        e.preventDefault();
        setIsSecretAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkSecretRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const login = (user: Partial<AuthUser> & { phoneNumber: string; role: UserRole }) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...user,
      token: user.token ?? prev?.token,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isProfileComplete: user.isProfileComplete ?? prev?.isProfileComplete ?? false,
      fullName: user.fullName || prev?.fullName || 'کاربر گرامی',
      avatarUrl: user.avatarUrl ?? prev?.avatarUrl,
      nationalId: user.nationalId ?? prev?.nationalId,
      age: user.age ?? prev?.age,
      height: user.height ?? prev?.height,
      weight: user.weight ?? prev?.weight,
      preferredFoot: user.preferredFoot ?? prev?.preferredFoot,
      position: user.position ?? prev?.position,
      experienceYears: user.experienceYears ?? prev?.experienceYears,
      bicep: user.bicep ?? prev?.bicep,
      calf: user.calf ?? prev?.calf,
      chest: user.chest ?? prev?.chest,
      thigh: user.thigh ?? prev?.thigh,
      bodyPhotoUrl: user.bodyPhotoUrl ?? prev?.bodyPhotoUrl,
    }));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        updateUser,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSecretAdminOpen,
        setIsSecretAdminOpen,
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

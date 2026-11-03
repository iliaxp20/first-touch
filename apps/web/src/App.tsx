import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { FootballCustomCursor } from './components/ui/FootballCustomCursor';
import { ProfileCompletionModal } from './features/profile/components/ProfileCompletionModal';
import { SecretAdminPortal } from './features/admin/SecretAdminPortal';

const AppContent: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    updateUser,
    isSecretAdminOpen,
    setIsSecretAdminOpen,
  } = useAuth();

  return (
    <>
      <AppRoutes />

      {/* Multi-Step Profile Completion Wizard Modal */}
      <ProfileCompletionModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onComplete={(profileData) => {
          updateUser({
            isProfileComplete: true,
            fullName: profileData.fullName || 'کاربر گرامی',
            avatarUrl: profileData.avatarUrl,
          });
          setIsProfileModalOpen(false);
        }}
      />

      {/* Secret Stealth Admin Console */}
      <SecretAdminPortal
        isOpen={isSecretAdminOpen}
        onClose={() => setIsSecretAdminOpen(false)}
      />

      {/* Football Tactical Custom Cursor */}
      <FootballCustomCursor />
    </>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

import { API_BASE_URL } from '@/lib/api';
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
    currentUser,
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
        initialData={currentUser}
        onComplete={(profileData) => {
          const updatedUserFields = {
            isProfileComplete: true,
            fullName: profileData.fullName.trim(),
            avatarUrl: profileData.avatarUrl,
            age: profileData.age,
            nationalId: profileData.nationalId,
            height: profileData.height,
            weight: profileData.weight,
            bicep: profileData.bicep,
            calf: profileData.calf,
            chest: profileData.chest,
            thigh: profileData.thigh,
            bodyPhotoUrl: profileData.bodyPhotoUrl,
            experienceYears: profileData.experienceYears,
            preferredFoot: profileData.preferredFoot,
            position: profileData.favPosition,
          };

          updateUser(updatedUserFields);
          setIsProfileModalOpen(false);

          // Persist directly to API + Database
          if (currentUser?.phoneNumber) {
            const apiBase = window.location.hostname !== 'localhost' ? '' : `${API_BASE_URL}`;
            fetch(`${apiBase}/auth/profile`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phoneNumber: currentUser.phoneNumber,
                fullName: profileData.fullName.trim(),
                nationalId: profileData.nationalId.trim(),
                age: String(profileData.age).trim(),
                height: String(profileData.height).trim(),
                weight: String(profileData.weight).trim(),
                preferredFoot: profileData.preferredFoot,
                position: profileData.favPosition,
                avatarUrl: profileData.avatarUrl,
                experienceYears: profileData.experienceYears,
                bicep: profileData.bicep,
                calf: profileData.calf,
                chest: profileData.chest,
                thigh: profileData.thigh,
                bodyPhotoUrl: profileData.bodyPhotoUrl,
              }),
            }).catch((err) => console.warn('Could not persist profile to API:', err));
          }
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

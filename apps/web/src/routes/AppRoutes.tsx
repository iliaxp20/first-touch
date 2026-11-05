import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardView } from '@/features/dashboard/DashboardView';
import { PlanList } from '@/features/plans/components/PlanList';
import { TacticsBoard } from '@/features/tactics/components/TacticsBoard';
import { SubscriptionCard } from '@/features/subscriptions/components/SubscriptionCard';
import { SettingsView } from '@/features/settings/SettingsView';
import { QuizRewardsView } from '@/features/quiz/QuizRewardsView';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { LockedFeatureView } from '@/components/ui/LockedFeatureView';
import { SecretAdminPortal } from '@/features/admin/SecretAdminPortal';

// Layout wrapper for authenticated pages
const AuthenticatedLayout: React.FC = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

// Practice / Plans page wrapped in profile lock
const PracticeRoute: React.FC = () => {
  const { currentUser, setIsProfileModalOpen } = useAuth();
  const isUnlocked = currentUser?.isProfileComplete ?? false;

  return (
    <LockedFeatureView
      title="برنامه‌های تمرینی غیرفعال است"
      description="برنامه‌های تمرینی اختصاصی پس از ثبت قد، وزن و اندازه‌گیری‌های فیزیکی برای شما فعال و صادر می‌گردد."
      isUnlocked={isUnlocked}
      onUnlockClick={() => setIsProfileModalOpen(true)}
    >
      <PlanList />
    </LockedFeatureView>
  );
};

// Subscriptions page wrapped in profile lock
const SubscriptionsRoute: React.FC = () => {
  const { currentUser, setIsProfileModalOpen } = useAuth();
  const isUnlocked = currentUser?.isProfileComplete ?? false;

  return (
    <LockedFeatureView
      title="خرید و تمدید اشتراک نیازمند ثبت مشخصات است"
      description="جهت صدور فاکتور و اتصال به مربی اختصاصی، ثبت مشخصات ورزشی الزامی است."
      isUnlocked={isUnlocked}
      onUnlockClick={() => setIsProfileModalOpen(true)}
    >
      <SubscriptionCard />
    </LockedFeatureView>
  );
};

// Login Route component
const LoginRoute: React.FC = () => {
  const { currentUser, login } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  return (
    <AuthScreen
      onLoginSuccess={(user) => {
        login(user);
      }}
    />
  );
};

// Admin Route component
const AdminRoute: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SecretAdminPortal
      isOpen={true}
      onClose={() => navigate(-1)}
    />
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<AdminRoute />} />

      {/* Publicly accessible Tactics Room for link sharing (also works for logged-in coaches & players) */}
      <Route
        path="/tactics"
        element={
          <AppLayout>
            <TacticsBoard />
          </AppLayout>
        }
      />
      <Route
        path="/tactics/:boardId"
        element={
          <AppLayout>
            <TacticsBoard />
          </AppLayout>
        }
      />

      {/* Protected routes wrapped with layout */}
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardView />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Practice and exercises routes */}
        <Route path="/practice" element={<PracticeRoute />} />
        <Route path="/plans" element={<Navigate to="/practice" replace />} />
        <Route path="/exercises" element={<Navigate to="/practice" replace />} />

        {/* Subscriptions route */}
        <Route path="/subscriptions" element={<SubscriptionsRoute />} />
        <Route path="/students" element={<Navigate to="/subscriptions" replace />} />

        {/* User settings route */}
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />

        {/* Quiz & Rewards game route */}
        <Route path="/rewards" element={<QuizRewardsView />} />
        <Route path="/quiz" element={<Navigate to="/rewards" replace />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

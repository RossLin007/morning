
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthProvider } from '@/contexts/AuthContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { ToastProvider } from '@/contexts/ToastContext'; 
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'; 
import { Icon } from '@/components/ui/Icon';
import { QueryClientProvider } from '@tanstack/react-query'; 
import { queryClient } from '@/lib/queryClient'; 
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { RewardsOverlay } from '@/components/business/gamification/RewardsOverlay';
import { PWAInstallBanner } from '@/components/layout/PWAInstallBanner';

// Static Imports
import { Dashboard } from '@/pages/Dashboard';
import Community from '@/pages/Community';
import { Reading } from '@/pages/Reading';
import { Profile } from '@/pages/Profile';
import { Login } from '@/pages/Login';
import { Tasks } from '@/pages/Tasks';
import { CourseDetail } from '@/pages/CourseDetail';
import { Relationships } from '@/pages/Relationships';
import { EditProfile } from '@/pages/EditProfile';
import { PartnerMatch } from '@/pages/PartnerMatch';
import { LiveRoom } from '@/pages/LiveRoom';
import { Notes } from '@/pages/Notes';
import { NoteEditor } from '@/pages/NoteEditor';
import { History } from '@/pages/History';
import { Achievements } from '@/pages/Achievements';
import { LearningReport } from '@/pages/LearningReport';
import { Membership } from '@/pages/Membership';
import { AICoach } from '@/pages/AICoach';
import { Notifications } from '@/pages/Notifications';
import { ZenShop } from '@/pages/ZenShop';
import { Settings } from '@/pages/Settings';
import { AccountSecurity } from '@/pages/AccountSecurity';
import { PostDetail } from '@/pages/PostDetail';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavPaths = ['/course/', '/notes/', '/note/new', '/match', '/live', '/settings', '/login', '/relationships', '/membership', '/coach', '/profile/edit', '/history', '/notifications', '/report', '/post/', '/security', '/shop'];
  const showBottomNav = !hideNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-[#050505] flex justify-center items-start md:py-8 transition-colors duration-500 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none bg-fixed">
      <div className="w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl bg-background-light dark:bg-background-dark min-h-screen md:min-h-[90vh] md:rounded-[40px] md:border-[8px] md:border-white/20 dark:md:border-gray-800/20 shadow-2xl relative overflow-x-hidden overflow-y-auto no-scrollbar ring-1 ring-black/5 flex flex-col">
        <PWAInstallBanner />
        <RewardsOverlay />
        <ScrollToTop /> 
        <div className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/reading" element={<ProtectedRoute><Reading /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><LearningReport /></ProtectedRoute>} />
              <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><AccountSecurity /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
              <Route path="/relationships" element={<ProtectedRoute><Relationships /></ProtectedRoute>} />
              <Route path="/match" element={<ProtectedRoute><PartnerMatch /></ProtectedRoute>} />
              <Route path="/live" element={<ProtectedRoute><LiveRoom /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/note/new" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
              <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
              <Route path="/shop" element={<ProtectedRoute><ZenShop /></ProtectedRoute>} />
              <Route path="/coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <GamificationProvider>
            <Router>
              <AppContent />
            </Router>
          </GamificationProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

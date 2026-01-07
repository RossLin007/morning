
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthProvider } from '@/contexts/AuthContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { RewardsOverlay } from '@/components/business/gamification/RewardsOverlay';
import { PWAInstallBanner } from '@/components/layout/PWAInstallBanner';

// New Pages
import { InitiateMorningReading } from '@/pages/InitiateMorningReading';
import { UnderstandMode } from '@/pages/UnderstandMode';

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
import { FanChat } from '@/pages/FanChat';
import { Notifications } from '@/pages/Notifications';
import { ZenShop } from '@/pages/ZenShop';
import { Settings } from '@/pages/Settings';
import { AccountSecurity } from '@/pages/AccountSecurity';
import { PostDetail } from '@/pages/PostDetail';
import { DiaryList } from '@/pages/DiaryList';
import { InsightsList } from '@/pages/InsightsList';
import { AwarenessDiary } from '@/pages/AwarenessDiary';
import { PastSessions } from '@/pages/PastSessions';
import { DiaryDetail } from '@/pages/DiaryDetail';
import { InsightDetail } from '@/pages/InsightDetail';
import { PeerProfile } from '@/pages/PeerProfile';
import { OpeningCeremony, ClosingCeremony } from '@/pages/Ceremony';
import { Favorites } from '@/pages/Favorites';
import { MyReading } from '@/pages/MyReading';
import { StoryViewer } from '@/pages/StoryViewer';
import { FeedDetail } from '@/pages/FeedDetail';
import { StoryPublish } from '@/pages/StoryPublish';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavPaths = ['/course/', '/notes/', '/note/new', '/match', '/live', '/settings', '/login', '/relationships', '/membership', '/coach', '/profile/edit', '/history', '/notifications', '/report', '/post/', '/security', '/shop', '/diary', '/insights', '/sessions', '/ceremony', '/favorites', '/my-reading', '/fan', '/story/', '/feed/', '/story/new'];
  const showBottomNav = !hideNavPaths.some(path => location.pathname.startsWith(path));

  // Expo Push Token Debugging
  React.useEffect(() => {
    const checkToken = setInterval(() => {
      if (window.expoPushToken) {
        console.log('🔥 Expo Push Token:', window.expoPushToken);
        // FIXME: Remove this alert in production after testing
        alert('Push Token: ' + window.expoPushToken);
        clearInterval(checkToken);
      }
    }, 1000);
    return () => clearInterval(checkToken);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F2EF] dark:bg-[#050505] flex justify-center items-start md:py-8 transition-colors duration-500 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] dark:bg-none bg-fixed">
      <div className="w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl bg-background-light dark:bg-background-dark h-[100dvh] md:h-[90vh] md:rounded-[40px] md:border-[8px] md:border-white/20 dark:md:border-gray-800/20 shadow-2xl relative overflow-hidden flex flex-col">
        <PWAInstallBanner />
        <RewardsOverlay />
        <ScrollToTop />
        <div id="main-content" className="flex-1 overflow-y-auto w-full relative no-scrollbar">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/diary" element={<ProtectedRoute><DiaryList /></ProtectedRoute>} />
                <Route path="/diary/new" element={<ProtectedRoute><AwarenessDiary /></ProtectedRoute>} />
                <Route path="/diary/:id" element={<ProtectedRoute><DiaryDetail /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><InsightsList /></ProtectedRoute>} />
                <Route path="/insight/:id" element={<ProtectedRoute><InsightDetail /></ProtectedRoute>} />
                <Route path="/user/:id" element={<ProtectedRoute><PeerProfile /></ProtectedRoute>} />
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
                <Route path="/coach" element={<ProtectedRoute><FanChat /></ProtectedRoute>} />
                <Route path="/fan" element={<ProtectedRoute><FanChat /></ProtectedRoute>} />
                <Route path="/ai-coach" element={<ProtectedRoute><FanChat /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><PastSessions /></ProtectedRoute>} />
                <Route path="/ceremony/opening" element={<ProtectedRoute><OpeningCeremony /></ProtectedRoute>} />
                <Route path="/ceremony/closing" element={<ProtectedRoute><ClosingCeremony /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path="/my-reading" element={<ProtectedRoute><MyReading /></ProtectedRoute>} />
                <Route path="/story/:id" element={<ProtectedRoute><StoryViewer /></ProtectedRoute>} />
                <Route path="/story/new" element={<ProtectedRoute><StoryPublish /></ProtectedRoute>} />
                <Route path="/feed/:id" element={<ProtectedRoute><FeedDetail /></ProtectedRoute>} />
                <Route path="/initiate" element={<ProtectedRoute><InitiateMorningReading /></ProtectedRoute>} />
                <Route path="/understand" element={<ProtectedRoute><UnderstandMode /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
        {showBottomNav && (
          <div className="flex-none z-50 w-full bg-[#F7F7F7] dark:bg-[#111]">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <GamificationProvider>
              <Router>
                <AppContent />
              </Router>
            </GamificationProvider>
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

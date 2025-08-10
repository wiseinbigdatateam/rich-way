import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import SessionExpiryAlert from "@/components/SessionExpiryAlert";
import ErrorBoundary from "@/components/ErrorBoundary";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import FaqPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";

const CoachingPage = lazy(() => import("./pages/CoachingPage"));
const CoachingApplicationPage = lazy(() => import("./pages/CoachingApplicationPage"));
const CoachingSuccessPage = lazy(() => import("./pages/CoachingSuccessPage"));
const DiagnosisPage = lazy(() => import("./pages/DiagnosisPage"));
const DiagnosisDetailPage = lazy(() => import("./pages/DiagnosisDetailPage"));
const FinanceDiagnosisPage = lazy(() => import("./pages/FinanceDiagnosisPage"));
const MbtiDiagnosisPage = lazy(() => import("./pages/MbtiDiagnosisPage"));
const MbtiDiagnosisResultPage = lazy(() => import("./pages/MbtiDiagnosisResultPage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const LectureDetailPage = lazy(() => import("./pages/LectureDetailPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const PlaygroundPage = lazy(() => import("./pages/PlaygroundPage"));
const PlaygroundPostPage = lazy(() => import("./pages/PlaygroundPostPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ExpertLoginPage = lazy(() => import("./pages/ExpertLoginPage"));
const ExpertPage = lazy(() => import("./pages/ExpertPage"));
const ExpertRegistrationPage = lazy(() => import("./pages/ExpertRegistrationPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FinanceDiagnosisResultPage = lazy(() => import("./pages/FinanceDiagnosisResultPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const SupabaseTestPage = lazy(() => import("./pages/SupabaseTestPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Toaster />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
          <SessionExpiryAlert />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/coaching" element={<CoachingPage />} />
            <Route path="/coaching/apply" element={<CoachingApplicationPage />} />
            <Route path="/coaching/success" element={<CoachingSuccessPage />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/diagnosis-detail/:type/:id" element={<DiagnosisDetailPage />} />
            <Route path="/diagnosis/finance" element={<FinanceDiagnosisPage />} />
            <Route path="/diagnosis/mbti" element={<MbtiDiagnosisPage />} />
            <Route path="/diagnosis/mbti/result" element={<MbtiDiagnosisResultPage />} />
            <Route path="/diagnosis/finance/result" element={<FinanceDiagnosisResultPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/education/:id" element={<LectureDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/playground/post/:id" element={<PlaygroundPostPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/expert/login" element={<ExpertLoginPage />} />
            <Route path="/expert/register" element={<ExpertRegistrationPage />} />
            <Route path="/expert" element={<ExpertPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/test-supabase" element={<SupabaseTestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAppLayout } from "@/components/layout/AdminAppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import Dashboard from "./pages/Dashboard";
import Quotations from "./pages/Quotations";
import QuotationCreate from "./pages/QuotationCreate";
import QuotationDetail from "./pages/QuotationDetail";
import Settlements from "./pages/Settlements";
import SettlementCreate from "./pages/SettlementCreate";
import SettlementDetail from "./pages/SettlementDetail";
import GuideAssignment from "./pages/GuideAssignment";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import GuideMain from "./pages/mobile/GuideMain";
import GuideProfiles from "./pages/GuideProfiles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* 공개 경로 — 인증 불필요 */}
          <Route path="/login" element={<Login />} />

          {/* 인증 보호 영역 */}
          <Route element={<AuthGuard />}>
            {/* 모바일 화면 (Guide/Local Manager) */}
            <Route
              path="/"
              element={
                <MobileLayout>
                  <GuideMain />
                </MobileLayout>
              }
            />

            {/* 관리자 데스크탑 화면 (Admin) */}
            <Route
              path="/admin"
              element={
                <AdminAppLayout>
                  <Dashboard />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/quotations"
              element={
                <AdminAppLayout>
                  <Quotations />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/quotations/new"
              element={
                <AdminAppLayout>
                  <QuotationCreate />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/quotations/:id"
              element={
                <AdminAppLayout>
                  <QuotationDetail />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/settlements"
              element={
                <AdminAppLayout>
                  <Settlements />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/settlements/new"
              element={
                <AdminAppLayout>
                  <SettlementCreate />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/settlements/:id"
              element={
                <AdminAppLayout>
                  <SettlementDetail />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/guides"
              element={
                <AdminAppLayout>
                  <GuideProfiles />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/guide-assignment"
              element={
                <AdminAppLayout>
                  <GuideAssignment />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminAppLayout>
                  <Reports />
                </AdminAppLayout>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminAppLayout>
                  <Settings />
                </AdminAppLayout>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

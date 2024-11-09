import { ThemeProvider } from '@/components/theme-provider';
import { MoniteProvider } from '@/contexts/MoniteContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import DashboardLayout from '@/components/DashboardLayout';
import { Home } from '@/components/pages/Home';
import { Dashboard } from '@/components/pages/Dashboard';
import { BillPay } from '@/components/pages/BillPay';
import { Invoicing } from '@/components/pages/Invoicing';
import { Capital } from '@/components/pages/Capital';
import { CardPayments } from '@/components/pages/CardPayments';
import { Clients } from '@/components/pages/Clients';
import { Banking } from '@/components/pages/Banking';
import { Integrations } from '@/components/pages/Integrations';
import { Profile } from '@/components/pages/Profile';
import { Settings } from '@/components/pages/Settings';
import { Toaster } from '@/components/ui/toaster';
import { BuilderPage } from '@/components/builder/BuilderPage';
import { initBuilder } from '@/lib/builder';

// Initialize Builder.io
initBuilder();

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="wonderpay-theme">
        <MoniteProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wonder-home" element={<BuilderPage model="wonder-pay-home-page" />} />
            <Route path="/pages/*" element={<BuilderPage model="page" />} />
            <Route path="/signin" element={
              <div className="min-h-screen w-full flex bg-background">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                  <div className="w-full max-w-md">
                    <SignInForm />
                  </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800" />
              </div>
            } />
            <Route path="/signup" element={
              <div className="min-h-screen w-full flex bg-background">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                  <div className="w-full max-w-md">
                    <SignUpForm />
                  </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800" />
              </div>
            } />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bill-pay" element={<BillPay />} />
              <Route path="invoicing" element={<Invoicing />} />
              <Route path="capital" element={<Capital />} />
              <Route path="card" element={<CardPayments />} />
              <Route path="clients" element={<Clients />} />
              <Route path="banking" element={<Banking />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </MoniteProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
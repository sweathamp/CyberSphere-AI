/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AppProvider, useApp } from './context/AppContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { AgentsPage } from './pages/AgentsPage';
import { HistoryPage } from './pages/HistoryPage';
import { UploadsPage } from './pages/UploadsPage';


/*
============================================
PROTECTED ROUTE
============================================

Prevents users from directly accessing
application pages without authentication.
*/

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/auth"
        replace
      />
    );

  }

  return <>{children}</>;

};


/*
============================================
APPLICATION ROUTES
============================================
*/

const AppRoutes: React.FC = () => {

  const { isAuthenticated } = useApp();

  return (

    <>
      <Navbar />

      <main className="flex-1 flex flex-col">

        <Routes>

          {/* LANDING PAGE */}
          <Route
            path="/"
            element={<LandingPage />}
          />


          {/* AUTH PAGE */}
          <Route
            path="/auth"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <AuthPage />
            }
          />


          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />


          {/* AI ASSISTANT */}
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />


          {/* AGENTS */}
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AgentsPage />
              </ProtectedRoute>
            }
          />


          {/* HISTORY */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />


          {/* SECURITY VAULT */}
          <Route
            path="/uploads"
            element={
              <ProtectedRoute>
                <UploadsPage />
              </ProtectedRoute>
            }
          />


          {/* UNKNOWN ROUTES */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

      <Footer />
    </>

  );

};


/*
============================================
MAIN APPLICATION
============================================
*/

export default function App() {

  return (

    <AppProvider>

      <Router>

        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

          <AppRoutes />

        </div>

      </Router>

    </AppProvider>

  );

}
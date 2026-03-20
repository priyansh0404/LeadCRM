import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import { Loader2, ShieldCheck } from 'lucide-react';

const PrivateRoute = ({ children }) => {
    const { admin } = useAuth();
    return admin ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { admin } = useAuth();
    return !admin ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
    const { loading } = useAuth();
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                <p className="text-slate-900 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Data...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-primary-500/30 selection:text-primary-700 antialiased">
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-white text-slate-900 border border-slate-200 shadow-[0_15px_60px_rgba(0,0,0,0.1)] rounded-2xl font-bold py-4 px-6',
                    duration: 4000,
                }}
            />
            {!isAuthPage && <Navbar />}
            <main className="flex-1 w-full">
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </main>
            {!isAuthPage && (
                <footer className="footer bg-blue-900 py-10 px-6 text-center shadow-lg border-t border-blue-500">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 border border-blue-400">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                            </div>
                           <p className="text-white font-black text-2xl tracking-tighter">LeadCRM</p>
                        </div>
                        <p className="text-blue-100 font-bold text-xs uppercase tracking-widest opacity-80">
                            © {new Date().getFullYear()} LeadCRM. Engineered for Excellence.
                        </p>
                        <div className="flex items-center space-x-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest opacity-80">System Operational</span>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

const AppContent = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;


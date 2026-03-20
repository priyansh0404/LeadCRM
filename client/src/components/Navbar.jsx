import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Database, Menu, X, User, ShieldCheck } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!admin) return null;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full h-20 bg-blue-900/95 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 z-[100] transition-all duration-300">
            {/* Logo Section */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 shadow-lg shadow-white/10 transition-all border border-slate-700">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-white font-black text-2xl tracking-tighter">LeadCRM</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center space-x-2 font-black text-sm uppercase tracking-widest transition-all hover:scale-105 ${
                            location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <link.icon className={`w-4 h-4 ${location.pathname === link.path ? 'text-white' : 'text-slate-500'}`} />
                        <span>{link.name}</span>
                    </Link>
                ))}

                <div className="h-8 w-px bg-slate-100 mx-2" />

                <div className="flex items-center space-x-5">
                    <div className="flex flex-col items-end">
                        <span className="text-white text-[0.75rem] font-black uppercase tracking-tight leading-none">{admin?.username}</span>
                        <span className="text-slate-400 text-[0.6rem] font-bold uppercase tracking-widest">{admin?.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-3 bg-white hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all border border-slate-700 hover:border-red-500/50 active:scale-95 group"
                        title="Logout Session"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="absolute top-22 left-4 right-4 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:hidden overflow-hidden backdrop-blur-2xl px-2 pt-2 pb-6"
                    >
                        <div className="p-4 space-y-6">
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-4 p-5 rounded-3xl transition-all ${
                                            location.pathname === link.path 
                                            ? 'bg-white text-slate-900 shadow-xl shadow-white/10' 
                                            : 'text-slate-400 hover:bg-slate-800 font-black'
                                        }`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span className="font-black uppercase tracking-widest text-xs">{link.name}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="p-6 bg-slate-800 rounded-[2rem] flex items-center justify-between border border-slate-700">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center shadow-md border border-slate-600">
                                        <User className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-black uppercase">{admin?.username}</p>
                                        <p className="text-slate-400 text-[0.65rem] font-bold lowercase">{admin?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-12 h-12 flex items-center justify-center bg-white text-red-500 rounded-2xl border border-red-50 border-dashed hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;


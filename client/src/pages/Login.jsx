import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, ShieldCheck, Mail, User, Lock, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import loginbg from "../assets/login.png";

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/admin/login', formData);
            login(data);
            toast.success(`Welcome back!`);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const loginFormContent = (
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col justify-center h-full mx-auto">
            <div className="mb-10 text-left">
                <h2 className="text-slate-950 text-[2.5rem] font-bold tracking-tight mb-2">Welcome Back!</h2>
                <p className="text-slate-700 text-sm font-medium">Log in to manage your leads with precision and ease.</p>
            </div>

            <div className="space-y-5 mb-8">
                <div className="relative group">
                    <label className="text-xs font-bold text-slate-900 mb-2 block">Email or Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="identifier"
                            required
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="Input your email or username"
                            className="w-full bg-white border border-slate-500 rounded-xl py-4 pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all outline-none"
                        />
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    </div>
                </div>
                <div className="relative group">
                    <label className="text-xs font-bold text-slate-900 mb-2 block">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            autoComplete="new-password"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Input your password"
                            className="w-full bg-white border border-slate-500 rounded-xl py-4 pl-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all outline-none"
                        />
                        <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black"
            >
              <Eye className="w-5 h-5" />
            </button>
                    </div>
                </div>
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-black to-slate-700 group-hover:from-slate-800 group-hover:to-black transition-all"></span>

            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>

            <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative px-4 bg-white text-xs text-slate-600">Secure Access</span>
            </div>

            <p className="text-slate-700 text-center text-sm mt-8 hidden md:block">
                Don't have an account?{" "}
                <Link to="/register" className="text-slate-950 font-bold hover:underline">
                    Register here
                </Link>
            </p>
        </form>
    );

    return (
        <div className="relative min-h-[100svh] w-full flex overflow-hidden bg-slate-950">
            {/* 1. LAYER ONE: FULL SCREEN EDGE-TO-EDGE BACKGROUND */}
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-90"
                style={{ backgroundImage: `url(${loginbg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/40 to-transparent" />

            {/* 2. LAYER TWO: ABSOLUTE NAV OVERLAYS */}
            <div className="absolute top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none md:justify-start">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link to="/" className="flex items-center gap-3 text-white pointer-events-auto hover:opacity-80 transition-opacity drop-shadow-lg">
                        <div className="w-10 h-10 bg-white text-primary-600 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">LeadCRM</span>
                    </Link>
                </div>
            </div>

            {/* 3. LAYER THREE: MOBILE VIEW */}
            <div className="md:hidden flex flex-col w-full h-full items-center justify-center p-4 z-20 relative pt-24 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-2xl">
                    {loginFormContent}
                    <p className="text-slate-500 text-center text-sm mt-8 block md:hidden">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-slate-950 font-bold hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>

            {/* 4. LAYER FOUR: DESKTOP FLOATING LAYOUT */}
            <div className="hidden md:block absolute inset-0 z-10 p-4">
                <motion.div
                    initial={{ opacity: 0, x: -50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-end p-20 pb-24 z-10"
                >
                    <h1 className="text-5xl lg:text-[4rem] font-bold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-xl text-left">
                        Lead Intelligence. <br /> Seamless CRM. <br /> Maximum Growth.
                    </h1>
                    <p className="text-slate-300 text-lg max-w-lg leading-relaxed drop-shadow-md text-left">
                        Access your command center to track, nurture, and close leads with state-of-the-art management tools designed for high-performance teams.
                    </p>
                    <div className="w-12 h-1 bg-white mt-12 rounded-full opacity-50" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-4 bottom-4 right-4 w-[calc(50%-1rem)] bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex items-center justify-center p-12 overflow-hidden z-30"
                >
                    <div className="w-full flex justify-center">
                        {loginFormContent}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
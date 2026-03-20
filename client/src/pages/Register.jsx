import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, ShieldCheck, Mail, User, Lock, Loader2, UserPlus, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import loginbg from "../assets/login.png";

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/admin/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            login(data);
            toast.success('Registration successful! Welcome to LeadCRM.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const signupFormContent = (
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col justify-center h-full mx-auto">
            <div className="mb-8 text-left">
                <h2 className="text-slate-950 text-[2.5rem] font-bold tracking-tight mb-2">Create Account</h2>
                <p className="text-slate-800 text-sm font-medium">Join our network of elite CRM administrators.</p>
            </div>

            <div className="space-y-4 mb-8">
                <div className="relative group">
                    <label className="text-xs font-bold text-slate-900 mb-1 block">Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="username"
                            required
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Priyanshu"
                            className="w-full bg-white border border-slate-500 rounded-xl py-3.5 pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all outline-none"
                        />
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    </div>
                </div>
                <div className="relative group">
                    <label className="text-xs font-bold text-slate-900 mb-1 block">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="priyanshu@example.com"
                            className="w-full bg-white border border-slate-500 rounded-xl py-3.5 pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all outline-none"
                        />
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    </div>
                </div>
                <div className="relative group">
                    <label className="text-xs font-bold text-slate-900 mb-1 block">Password</label>
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
                            placeholder="Create a password"
                            className="w-full bg-white border border-slate-500 rounded-xl py-4 pl-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all outline-none"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="relative group">
                    <label className="text-xs font-bold text-slate-900 mb-1 block">Confirm Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            autoComplete="new-password"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Verify your password"
                            className="w-full bg-white border border-slate-500 rounded-xl py-3.5 pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all outline-none"
                        />
                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] mb-8 flex items-center justify-center space-x-2"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Establish Admin Account</span>}
            </button>

            <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative px-4 bg-white text-xs text-slate-600">Identity Verification</span>
            </div>

            <p className="text-slate-700 text-center text-sm mt-8 hidden md:block">
                Already an Admin?{" "}
                <Link to="/login" className="text-slate-950 font-bold hover:underline">
                    Login here
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
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/40 to-slate-950/60" />

            {/* 2. LAYER TWO: ABSOLUTE NAV OVERLAYS */}
            <div className="absolute top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none md:justify-end">
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
                    {signupFormContent}
                    <p className="text-slate-500 text-center text-sm mt-8 block md:hidden">
                        Joined us before?{" "}
                        <Link to="/login" className="text-slate-950 font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>

            {/* 4. LAYER FOUR: DESKTOP FLOATING LAYOUT */}
            <div className="hidden md:block absolute inset-0 z-10 p-4">
                <motion.div
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-end p-20 pb-24 items-end text-right z-10"
                >
                    <h1 className="text-5xl lg:text-[4rem] font-bold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-xl text-right">
                        Join the Core. <br /> Master Your <br /> Pipeline.
                    </h1>
                    <p className="text-slate-300 text-lg max-w-lg leading-relaxed drop-shadow-md text-right">
                        Create an account to gain full access to our proprietary lead management system and accelerate your business growth today.
                    </p>
                    <div className="w-12 h-1 bg-white mt-12 rounded-full opacity-50 ml-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-4 bottom-4 left-4 w-[calc(50%-1rem)] bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex items-center justify-center p-12 overflow-hidden z-30"
                >
                    <div className="w-full flex justify-center">
                        {signupFormContent}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

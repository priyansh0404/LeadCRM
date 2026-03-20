import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, Loader2, Trash2, Pencil, ImageIcon, Send, Phone, Mail, Clock, MoreVertical, Database, Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { admin } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'New',
    });
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/leads', {
                headers: { Authorization: `Bearer ${admin?.token}` }
            });
            setLeads(data);
        } catch (error) {
            toast.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (lead) => {
        setEditingLead(lead);
        setFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            status: lead.status,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/leads/${id}`, {
                headers: { Authorization: `Bearer ${admin?.token}` }
            });
            toast.success('Lead deleted');
            fetchLeads();
        } catch (error) {
            toast.error('Failed to delete lead');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('status', formData.status);
        if (file) data.append('image', file);

        try {
            if (editingLead) {
                await axios.put(`http://localhost:5000/api/leads/${editingLead._id}`, data, {
                    headers: {
                        Authorization: `Bearer ${admin?.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Lead updated');
            } else {
                await axios.post('http://localhost:5000/api/leads', data, {
                    headers: {
                        Authorization: `Bearer ${admin?.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Lead created');
            }
            setShowModal(false);
            resetForm();
            fetchLeads();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingLead(null);
        setFormData({ name: '', email: '', phone: '', status: 'New' });
        setFile(null);
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: leads.length,
        new: leads.filter(lead => lead.status === 'New').length,
        contacted: leads.filter(lead => lead.status === 'Contacted').length,
        converted: leads.filter(lead => lead.status === 'Converted').length,
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden pb-12">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div 
                    animate={{ 
                        x: [0, 50, 0], 
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                    }} 
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-gradient-to-br from-blue-100/60 to-indigo-100/60 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -40, 0], 
                        y: [0, 50, 0],
                        scale: [1, 1.15, 1],
                        rotate: [0, -3, 0]
                    }} 
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[55%] bg-gradient-to-br from-purple-100/60 to-pink-100/60 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, 30, 0], 
                        y: [0, -20, 0],
                        scale: [1, 1.05, 1]
                    }} 
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] left-[10%] w-[20%] h-[30%] bg-gradient-to-br from-cyan-100/40 to-teal-100/40 rounded-full blur-[80px]" 
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/80 p-8 rounded-[2.5rem] border border-slate-200/50 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Leads <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-black">HQ</span></h1>
                        </div>
                        <p className="text-slate-700 font-semibold tracking-wide ml-1.5 flex items-center space-x-2">
                           <span>Control Center</span>
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60" />
                           <span className="opacity-90 text-sm">Managing {leads.length} Active Profiles</span>
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="group bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-black py-4 px-10 rounded-[1.25rem] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-3 w-full sm:w-auto overflow-hidden relative"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500 relative z-10" />
                        <span className="relative z-10">Create Profile</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 p-6 rounded-[2rem] border border-slate-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl group hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">Total Leads</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-bold text-sm">Active Pipeline</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 p-6 rounded-[2rem] border border-slate-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl group hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">New Leads</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{stats.new}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 font-bold text-sm">Ready for Outreach</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 p-6 rounded-[2rem] border border-slate-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl group hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">Contacted</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{stats.contacted}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-orange-600 font-bold text-sm">In Progress</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 p-6 rounded-[2rem] border border-slate-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl group hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">Converted</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{stats.converted}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-purple-600 font-bold text-sm">Success Rate</span>
                        </div>
                    </motion.div>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-white/80 p-5 rounded-[2rem] border border-slate-200/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                    <div className="relative group md:col-span-8">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find records by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-14 pr-5 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold tracking-tight text-lg"
                        />
                    </div>
                    <div className="flex items-center space-x-4 md:col-span-4 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 group focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <Filter className="w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 bg-transparent border-none text-slate-900 focus:outline-none appearance-none font-black cursor-pointer text-lg tracking-tight"
                        >
                            <option value="All">Global Records</option>
                            <option value="New">Fresh Leads</option>
                            <option value="Contacted">Active Contacts</option>
                            <option value="Converted">Sales Verified</option>
                        </select>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
                            <Loader2 className="w-16 h-16 text-primary-500 animate-spin absolute inset-0" />
                        </div>
                        <p className="text-slate-900 font-extrabold text-xl animate-pulse tracking-tight">Syncing Database...</p>
                    </div>
                ) : (
                    <div className="space-y-8 pb-10">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white/80 border border-slate-400 shadow-[0_30px_100px_rgba(0,0,0,0.18)] rounded-[2.5rem] overflow-hidden backdrop-blur-3xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="px-8 py-7 text-slate-700 font-black text-[0.7rem]">Identity Details</th>
                                            <th className="px-8 py-7 text-slate-700 font-black text-[0.7rem]">Contact Line</th>
                                            <th className="px-8 py-7 text-slate-700 font-black text-[0.7rem]">Current Status</th>
                                            <th className="px-8 py-7 text-slate-700 font-black text-[0.7rem]">Registration Date</th>
                                            <th className="px-8 py-7 text-slate-700 font-black text-[0.7rem] text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredLeads.map((lead) => (
                                            <tr key={lead._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary-500 group-hover:shadow-2xl group-hover:shadow-primary-500/20 group-hover:-translate-y-1 duration-500">
                                                            {lead.image ? (
                                                                <img
                                                                    src={`http://localhost:5000/${lead.image}`}
                                                                    alt={lead.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                                                />
                                                            ) : (
                                                                <span className="text-slate-900 text-2xl font-black">{lead.name[0]}</span>
                                                            )}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-slate-900 font-black text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{lead.name}</p>
                                                            <p className="text-slate-600 text-sm font-bold lowercase tracking-normal">{lead.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-slate-800 text-base font-black font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-400">{lead.phone}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm inline-block ${
                                                        lead.status === 'New' ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20' :
                                                        lead.status === 'Contacted' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' :
                                                        'bg-green-500/10 text-green-600 border border-green-500/20'
                                                    }`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-slate-700 text-sm font-black">
                                                    <div className="flex items-center space-x-3">
                                                        <Clock className="w-5 h-5 text-slate-500" />
                                                        <span>{new Date(lead.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                        <button
                                                            onClick={() => handleEdit(lead)}
                                                            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-[1rem] shadow-lg hover:shadow-xl transition-all border border-slate-100"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(lead._id)}
                                                            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-red-600 text-slate-400 hover:text-white rounded-[1rem] shadow-lg hover:shadow-xl transition-all border border-slate-100"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden grid grid-cols-1 gap-6">
                            {filteredLeads.map((lead) => (
                                <div key={lead._id} className="bg-white border border-slate-400 shadow-[0_25px_70px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-xl shadow-slate-100/50">
                                                {lead.image ? (
                                                    <img
                                                        src={`http://localhost:5000/${lead.image}`}
                                                        alt={lead.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-slate-900 text-3xl font-black">{lead.name[0]}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{lead.name}</h3>
                                                <p className="text-slate-600 text-sm font-bold">{lead.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest ${
                                            lead.status === 'New' ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20' :
                                            lead.status === 'Contacted' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' :
                                            'bg-green-500/10 text-green-600 border border-green-500/20'
                                        }`}>
                                            {lead.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 py-6 border-y border-slate-300 relative z-10">
                                        <div className="flex items-center text-slate-600 space-x-4">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-primary-500" />
                                            </div>
                                            <span className="text-lg font-black font-mono">{lead.phone}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600 space-x-4">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <span className="text-base font-bold uppercase">{new Date(lead.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 pt-2 relative z-10">
                                        <button
                                            onClick={() => handleEdit(lead)}
                                            className="flex-1 px-6 py-4 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-widest text-xs"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            <span>Update</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lead._id)}
                                            className="w-16 h-16 bg-white hover:bg-red-50 text-red-500 rounded-2xl transition-all border border-slate-200 flex items-center justify-center shadow-lg active:scale-95"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Hover Background Accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>

                        {filteredLeads.length === 0 && (
                            <div className="bg-slate-50 border-2 border-slate-500 border-dashed rounded-[3rem] py-32 text-center space-y-6">
                                <div className="w-24 h-24 bg-white shadow-2xl rounded-full flex items-center justify-center mx-auto border border-slate-500">
                                    <Database className="w-12 h-12 text-slate-500" />
                                </div>
                                <div className="space-y-2 px-6">
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sync Null</h3>
                                    <p className="text-slate-500 font-bold max-w-xs mx-auto">Zero records detected for the selected filter sequence.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" 
                                onClick={() => setShowModal(false)} 
                            />
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] relative z-[120] overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
                            >
                                <div className="p-10 pb-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-50">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-8 bg-primary-500 rounded-full" />
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                                {editingLead ? "Edit" : "New"} <span className="text-primary-500">Lead</span>
                                            </h2>
                                        </div>
                                        <p className="text-slate-600 text-sm font-bold uppercase tracking-widest pl-4">Identification Sequence</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-slate-900 text-slate-300 hover:text-white rounded-2xl transition-all hover:rotate-90 shadow-sm border border-slate-100">
                                        <X className="w-10 h-10" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-8 overflow-y-auto">
                                    <div className="space-y-8">
                                        <div className="group space-y-3">
                                            <label className="text-[0.65rem] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Assigned Full Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-400 rounded-[1.25rem] py-5 px-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-black text-lg shadow-sm"
                                                    placeholder="e.g. PRIYANSHU"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="group space-y-3">
                                                <label className="text-[0.65rem] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-400 rounded-[1.25rem] py-5 px-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-black shadow-sm"
                                                    placeholder="priyanshu@example.com"
                                                />
                                            </div>
                                            <div className="group space-y-3">
                                                <label className="text-[0.65rem] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Phone Link</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-400 rounded-[1.25rem] py-5 px-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-black shadow-sm"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>
                                        <div className="group space-y-3">
                                            <label className="text-[0.65rem] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Lead Classification</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-400 rounded-[1.25rem] py-5 px-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-black appearance-none cursor-pointer shadow-sm text-lg"
                                                >
                                                    <option value="New">Initiate Profile (New)</option>
                                                    <option value="Contacted">Active Outreach (Contacted)</option>
                                                    <option value="Converted">Target Acquired (Converted)</option>
                                                </select>
                                                <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="group space-y-3">
                                            <label className="text-[0.65rem] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Visual Artifact (Optional)</label>
                                            <div className="relative group/file">
                                                <input
                                                    type="file"
                                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label 
                                                    htmlFor="file-upload"
                                                    className="w-full flex items-center justify-between bg-slate-50 border-2 border-dashed border-slate-400 rounded-[1.5rem] py-6 px-8 text-slate-600 cursor-pointer hover:border-primary-500 hover:bg-slate-100/50 transition-all shadow-sm"
                                                >
                                                    <div className="flex items-center space-x-5">
                                                        <div className="w-12 h-12 bg-white shadow-xl rounded-xl flex items-center justify-center border border-slate-100">
                                                            <ImageIcon className="w-6 h-6 text-primary-500" />
                                                        </div>
                                                        <span className="font-black text-sm uppercase tracking-tight">{file ? file.name : 'Upload Identity Image...'}</span>
                                                    </div>
                                                    <span className="text-[0.6rem] font-black text-white bg-slate-900 px-4 py-2.5 rounded-xl uppercase tracking-widest shadow-lg">Browse</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex space-x-5 pb-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 font-black py-5 rounded-2xl transition-all border border-slate-400 uppercase tracking-[0.2em] text-xs shadow-sm"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-3xl shadow-slate-900/20 transition-all flex items-center justify-center space-x-4 disabled:opacity-70 disabled:cursor-not-allowed group uppercase tracking-[0.2em] text-xs"
                                        >
                                            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                <>
                                                    <span>{editingLead ? 'Commit Update' : 'Initialize Profile'}</span>
                                                    <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const X = ({ className }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default Dashboard;


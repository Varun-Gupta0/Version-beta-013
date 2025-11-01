'use client';

import React, { useState } from 'react';
import './auth.module.css';

export default function AuthPage() {
    const [activeRole, setActiveRole] = useState<'patient' | 'doctor' | 'lab'>('patient');

    const getTabClassName = (role: 'patient' | 'doctor' | 'lab') => {
        const base = 'w-full py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-300';
        if (role === activeRole) {
            return `${base} bg-white shadow-md`;
        }
        return `${base} bg-transparent hover:bg-white/50`;
    };

    const getRegisterBtnClassName = (role: 'patient' | 'doctor' | 'lab') => {
        const base = 'w-full py-2.5 px-4 text-center font-medium border rounded-lg transition-colors';
        if (role === activeRole) {
            return `${base} register-btn active`;
        }
        return `${base} text-gray-700 border-gray-400 hover:bg-gray-50`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex gap-8 items-center max-w-6xl w-full">
                {/* Image Section */}
                <div className="hidden lg:block w-1/2">
                    <img 
                        src="/medical-dashboard.jpg" 
                        alt="Medical Dashboard Preview" 
                        className="rounded-2xl shadow-2xl w-full h-auto"
                    />
                </div>
                
                <div className="w-full lg:w-1/2">
                    <div id="login-card" className={`bg-white p-8 md:p-10 rounded-2xl w-full max-w-md mx-auto transition-all duration-400 ease-out shadow-xl ${activeRole}-theme`}>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl font-bold bg-gradient-to-r 
                            ${activeRole === 'patient' ? 'from-indigo-600 to-indigo-400' : 
                              activeRole === 'doctor' ? 'from-emerald-600 to-emerald-400' : 
                              'from-cyan-600 to-cyan-400'} 
                            bg-clip-text text-transparent`}>
                            MedWallet
                        </h1>
                        <p className="text-gray-500 mt-2">Sign in to your account</p>
                    </div>

                {/* Role Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-6 rounded-lg p-1.5 bg-gray-100">
                    <button 
                        id="patient-tab" 
                        className={getTabClassName('patient')}
                        onClick={() => setActiveRole('patient')}
                    >
                        <span className={activeRole === 'patient' ? 'bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent' : ''}>
                            Patient
                        </span>
                    </button>
                    <button 
                        id="doctor-tab" 
                        className={getTabClassName('doctor')}
                        onClick={() => setActiveRole('doctor')}
                    >
                        <span className={activeRole === 'doctor' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent' : ''}>
                            Doctor
                        </span>
                    </button>
                    <button 
                        id="lab-tab" 
                        className={getTabClassName('lab')}
                        onClick={() => setActiveRole('lab')}
                    >
                        <span className={activeRole === 'lab' ? 'bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent' : ''}>
                            Lab
                        </span>
                    </button>
                </div>

                {/* Login Form */}
                <form id="login-form" action="#" method="POST">
                    <h2 id="form-title" className="text-xl font-semibold text-center mb-6">
                        <span className={`
                            bg-gradient-to-r 
                            ${activeRole === 'patient' ? 'from-indigo-600 to-indigo-400' : 
                              activeRole === 'doctor' ? 'from-emerald-600 to-emerald-400' : 
                              'from-cyan-600 to-cyan-400'} 
                            bg-clip-text text-transparent
                        `}>
                            {`${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Login`}
                        </span>
                    </h2>
                    
                    <div className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email / User ID
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>
                        
                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="form-link text-sm font-medium">
                                    Forgot?
                                </a>
                            </div>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="mt-8">
                        <button 
                            type="submit"
                            className="submit-btn w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <hr className="my-8 border-gray-200" />

                {/* Registration Section */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">Don't have an account?</p>
                    <div className="mt-4">
                        <a href={`/register/${activeRole}`} className={getRegisterBtnClassName(activeRole)}>
                            Register as a {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
                        </a>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

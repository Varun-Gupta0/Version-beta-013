'use client'; // This component needs state and event handlers, so it must be a client component.

import React, { useState } from 'react';
// import Link from 'next/link'; // Use Next.js Link for navigation - temporarily replaced with <a>

export default function AuthPage() {
    // State to manage the active role
    const [activeRole, setActiveRole] = useState<'patient' | 'doctor' | 'lab'>('patient');

    // Define theme styles for each role using Tailwind classes
    const themeStyles = {
        patient: {
            shadow: 'shadow-[0_0_40px_-15px_#a5b4fc]',
            header: 'from-[#4F46E5] to-[#6366F1]',
            tabActive: 'text-[#4F46E5] bg-white',
            link: 'text-[#4F46E5] hover:text-[#6366F1]',
            submit: 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5]',
            register: 'text-[#4F46E5] border-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF]',
        },
        doctor: {
            shadow: 'shadow-[0_0_40px_-15px_#86efac]',
            header: 'from-[#16A34A] to-[#22C55E]',
            tabActive: 'text-[#16A34A] bg-white',
            link: 'text-[#16A34A] hover:text-[#15803D]',
            submit: 'bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803D] hover:to-[#16A34A]',
            register: 'text-[#16A34A] border-[#16A34A] bg-[#F0FDF4] hover:bg-[#DCFCE7]',
        },
        lab: {
            shadow: 'shadow-[0_0_40px_-15px_#5eead4]',
            header: 'from-[#0D9488] to-[#14B8A6]',
            tabActive: 'text-[#0D9488] bg-white',
            link: 'text-[#0D9488] hover:text-[#0F766E]',
            submit: 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] hover:from-[#0F766E] hover:to-[#0D9488]',
            register: 'text-[#0D9488] border-[#0D9488] bg-[#F0FDFA] hover:bg-[#CCFBF1]',
        }
    };

    // Get the current theme based on the active role
    const currentTheme = themeStyles[activeRole];

    const getTabClassName = (role: 'patient' | 'doctor' | 'lab') => {
        const base = 'w-full py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-300';
        if (role === activeRole) {
            return `${base} ${currentTheme.tabActive} shadow-md`;
        }
        return `${base} bg-transparent text-gray-600`;
    };

    const getRegisterBtnClassName = (role: 'patient' | 'doctor' | 'lab') => {
        const base = 'w-full py-2.5 px-4 text-center font-medium border rounded-lg transition-colors';
        if (role === activeRole) {
            return `${base} ${currentTheme.register}`;
        }
        return `${base} text-gray-700 border-gray-400 hover:bg-gray-50`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            <div className={`bg-white p-8 md:p-10 rounded-2xl w-full max-w-md transition-all duration-400 ease-out 
                shadow-[0_25px_50px_-12px_rgb(0,0,0,0.15)] ${currentTheme.shadow}`}
                style={{
                    boxShadow: `0 25px 50px -12px rgb(0 0 0 / 0.15), ${currentTheme.shadow.includes('a5b4fc') ? '0 0 40px -15px #a5b4fc' : 
                                                                        currentTheme.shadow.includes('86efac') ? '0 0 40px -15px #86efac' :
                                                                        '0 0 40px -15px #5eead4'}`
                }}>
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.header}`}
                        style={{
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                        }}>
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
                        Patient
                    </button>
                    <button 
                        id="doctor-tab" 
                        className={getTabClassName('doctor')}
                        onClick={() => setActiveRole('doctor')}
                    >
                        Doctor
                    </button>
                    <button 
                        id="lab-tab" 
                        className={getTabClassName('lab')}
                        onClick={() => setActiveRole('lab')}
                    >
                        Lab
                    </button>
                </div>

                {/* Login Form */}
                <form id="login-form" action="#" method="POST">
                    <h2 id="form-title" className="text-xl font-semibold text-center mb-6 text-gray-800">
                        {`${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Login`}
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
                                <a href="#" className={`form-link text-sm font-medium ${currentTheme.link}`}>
                                    Forgot?
                                </a>
                            </div>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="mt-8">
                        <button 
                            type="submit"
                            className={`submit-btn w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ${currentTheme.submit}`}
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
                    <div className="flex flex-col space-y-3 mt-4">
                        {/* Replaced Next/Link with <a> for preview compatibility */}
                        <a href="/register/patient" className={getRegisterBtnClassName('patient')}>
                            Register as a Patient
                        </a>
                        <a href="/register/doctor" className={getRegisterBtnClassName('doctor')}>
                            Register as a Doctor
                        </a>
                        <a href="/register/lab" className={getRegisterBtnClassName('lab')}>
                            Register as a Lab
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}


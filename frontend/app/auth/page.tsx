'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type UserType = 'patient' | 'doctor' | 'lab';
type AuthMode = 'login' | 'register';

const userTypeColors = {
  patient: {
    primary: '#4F46E5', // Indigo
    gradient: 'from-indigo-50 to-indigo-100',
    shadow: 'shadow-indigo-200'
  },
  doctor: {
    primary: '#059669', // Emerald
    gradient: 'from-emerald-50 to-emerald-100',
    shadow: 'shadow-emerald-200'
  },
  lab: {
    primary: '#DC2626', // Red
    gradient: 'from-red-50 to-red-100',
    shadow: 'shadow-red-200'
  }
};

export default function AuthPage() {
  const [userType, setUserType] = useState<UserType>('patient');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`/api/auth/${authMode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      if (!response.ok) throw new Error('Authentication failed');
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
        toast.success(`Successfully ${authMode === 'login' ? 'logged in' : 'registered'}!`);
      }
    } catch (error) {
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const colors = userTypeColors[userType];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center p-4`}>
      <div className={`bg-white rounded-xl ${colors.shadow} p-8 max-w-md w-full transition-all duration-300`}>
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          MedWallet
        </h1>
        
        {/* User Type Selector */}
        <div className="flex gap-2 mb-6">
          {(['patient', 'doctor', 'lab'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-2 rounded-lg capitalize transition-all
                ${userType === type 
                  ? `bg-${type}-100 text-${type}-700 font-medium`
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
            style={{ 
              '--tw-ring-color': colors.primary + '20',
              borderColor: userType === 'patient' ? '#818CF8' 
                : userType === 'doctor' ? '#34D399'
                : '#F87171'
            } as any}
          />
          
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
            style={{ 
              '--tw-ring-color': colors.primary + '20',
              borderColor: userType === 'patient' ? '#818CF8' 
                : userType === 'doctor' ? '#34D399'
                : '#F87171'
            } as any}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white font-medium transition-all"
            style={{ backgroundColor: colors.primary }}
            disabled={isLoading}
          >
            {isLoading ? '...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="font-medium transition-colors"
            style={{ color: colors.primary }}
          >
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

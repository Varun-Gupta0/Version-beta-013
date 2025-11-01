'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface AiAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axios.post('/api/ai-assistant', { query });
            setResponse(result.data.response);
        } catch (error) {
            console.error('Error querying AI assistant:', error);
            setResponse('Sorry, there was an error processing your request.');
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">AI Assistant</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="How can I help you?"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Ask'}
                    </button>
                </form>

                {response && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiAssistant;
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { query, userId, context } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Call the Python AI service
        const aiServicePath = path.join(process.cwd(), '..', '..', 'backend', 'server', 'src', 'ai_service.py');
        const result = await new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [aiServicePath], {
                env: {
                    ...process.env,
                    QUERY: query,
                    USER_ID: userId || '',
                    CONTEXT: JSON.stringify(context || {})
                }
            });

            let outputData = '';
            let errorData = '';

            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(errorData || 'AI service failed'));
                } else {
                    try {
                        resolve(JSON.parse(outputData));
                    } catch (e) {
                        reject(new Error('Invalid AI response'));
                    }
                }
            });
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Assistant API Error:', error);
        return NextResponse.json(
            { error: error.message || 'AI service unavailable' },
            { status: 500 }
        );
    }
}

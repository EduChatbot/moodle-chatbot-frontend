"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const { theme } = useTheme();
    const router = useRouter();
    return (
        <div className="relative min-h-screen">
            <button 
                onClick={() => router.back()}
                className={`fixed top-4 left-4 z-10 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors shadow-lg ${
                    theme === 'light' 
                        ? 'bg-white/80 hover:bg-gray-100/80 text-gray-700 border border-gray-200' 
                        : 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border border-gray-600'
                }`}
            >
                ← Go Back
            </button>
            
            <div className="flex flex-col items-center px-4 pt-2 pb-12">
                <div className={`max-w-4xl mx-auto p-8 rounded-2xl backdrop-blur-sm ${
                    theme === 'light' 
                        ? 'bg-white/90 border border-gray-200 text-gray-800 shadow-2xl' 
                        : 'bg-gray-800/90 border border-gray-700 text-gray-100 shadow-2xl'
                }`} style={{
                    boxShadow: theme === 'light' 
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}>
                
                <h1 className={`text-4xl font-bold mb-4 text-center ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>About Us</h1>

                <div className="space-y-3 mb-6">
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        We are studying Data Science at Warsaw University of Technology.<br />
                        This project was made as a part of our studies, for our bachelor thesis.
                    </p>
                    <p className={`text-lg text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Feel free to reach out to us!
                    </p>
                </div>

                <div className="mb-12" style={{ borderBottom: '1px solid lightgray' }}>
                    <h3 className={`text-2xl font-semibold mb-4 text-center ${
                        theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                    }`}>Team Members:</h3>
                    <div className="space-y-3 pb-6">
                        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            <strong>Anna Ostrowska</strong> - 
                            <a href="mailto:anna.ostrowska@example.com" className={`ml-2 ${
                                theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                            } transition-colors`}>anna.ostrowska@example.com</a> - 
                            <a href="https://github.com/anna-ostrowska" className={`ml-2 ${
                                theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                            } transition-colors`}>GitHub</a>
                        </p>
                        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            <strong>Gabriela Majstrak</strong> - 
                            <a href="mailto:gabriela.majstrak@example.com" className={`ml-2 ${
                                theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                            } transition-colors`}>gabriela.majstrak@example.com</a> - 
                            <a href="https://github.com/gabriela-majstrak" className={`ml-2 ${
                                theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                            } transition-colors`}>GitHub</a>
                        </p>
                        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            <strong>Jan Opala</strong> - 
                            <a href="mailto:jan.opala@example.com" className={`ml-2 ${
                                theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                            } transition-colors`}>jan.opala@example.com</a> - 
                            <a href="https://github.com/jan-opala" className={`ml-2 ${
                                theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                            } transition-colors`}>GitHub</a>
                        </p>
                    </div>
                </div>

                <div className="text-center mb-4 -mt-5">
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        <strong>Project Repository on GitHub:</strong> 
                        <a href="https://github.com/your-repo" className={`ml-2 ${
                            theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                        } transition-colors`}>https://github.com/your-repo</a>
                    </p>
                </div>

                <div className="text-center">
                    <h3 className={`text-2xl font-semibold mb-4 ${
                        theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                    }`}>Contact Us:</h3>
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        If you have any questions or inquiries, feel free to reach out!
                    </p>
                </div>
            </div>
        </div>
        </div>
    )
}
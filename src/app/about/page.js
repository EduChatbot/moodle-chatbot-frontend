"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const { theme } = useTheme();
    const router = useRouter();
    return (
        <div className="relative min-h-screen py-16 px-4">
            {/* Back Button */}
            <button 
                onClick={() => router.push('/')}
                className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold
                         hover:scale-105 transition-all duration-300 animate-fade-in-left"
                style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
            >
                ← Home
            </button>
            
            <div className="flex flex-col items-center pt-20">
                {/* Main Content Card */}
                <div className="max-w-5xl mx-auto glass-strong p-12 rounded-3xl shadow-2xl animate-scale-in duration-dramatic ease-elastic">
                
                {/* Hero Title */}
                <h1 className={`font-playfair text-5xl md:text-6xl font-bold mb-8 text-center animate-fade-in-down duration-slow ease-bounce ${
                  theme === 'light'
                    ? 'gradient-text-light'
                    : 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'
                }`}>
                    About Us
                </h1>

                {/* Introduction */}
                <div className="space-y-6 mb-12 animate-fade-in-up delay-250 duration-slower ease-smooth">
                    <p className={`font-inter text-xl text-center leading-relaxed ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                    }`}>
                        We are passionate Data Science students at <span className={`font-montserrat font-semibold ${
                          theme === 'light' ? 'text-blue-600' : 'text-blue-300'
                        }`}>Warsaw University of Technology</span>, 
                        combining cutting-edge AI technology with educational innovation.
                    </p>
                    <p className={`font-inter text-lg text-center leading-relaxed ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                        This project represents our bachelor thesis work, showcasing our commitment to 
                        enhancing the learning experience through intelligent chatbot technology.
                    </p>
                    <p className={`font-space text-xl text-center font-semibold ${
                      theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'
                    }`}>
                        💡 Feel free to reach out to us!
                    </p>
                </div>

                {/* Team Members Section */}
                <div className={`mb-12 pb-8 animate-fade-in-up delay-400 duration-slow ease-smooth ${
                  theme === 'light' ? 'border-b border-gray-300' : 'border-b border-white/20'
                }`}>
                    <h3 className={`font-montserrat text-3xl font-bold mb-8 text-center ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                        🎓 Our Team
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Team Member 1 */}
                        <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300
                                      animate-fade-in-left delay-550 duration-slower ease-bounce">
                            <div className="text-4xl mb-3">👩‍💻</div>
                            <h4 className={`font-montserrat text-xl font-bold mb-3 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                                Anna Ostrowska
                            </h4>
                            <a href="mailto:anna.ostrowska@example.com" 
                               className={`font-inter text-sm transition-colors block mb-2 ${
                                 theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-300 hover:text-blue-200'
                               }`}>
                                📧 Email
                            </a>
                            <a href="https://github.com/anna-ostrowska" 
                               className={`font-inter text-sm transition-colors block ${
                                 theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-300 hover:text-purple-200'
                               }`}>
                                🔗 GitHub
                            </a>
                        </div>

                        {/* Team Member 2 */}
                        <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300
                                      animate-fade-in-up delay-700 duration-slow ease-elastic">
                            <div className="text-4xl mb-3">👩‍💻</div>
                            <h4 className={`font-montserrat text-xl font-bold mb-3 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                                Gabriela Majstrak
                            </h4>
                            <a href="mailto:gabriela.majstrak@example.com" 
                               className={`font-inter text-sm transition-colors block mb-2 ${
                                 theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-300 hover:text-blue-200'
                               }`}>
                                📧 Email
                            </a>
                            <a href="https://github.com/gabriela-majstrak" 
                               className={`font-inter text-sm transition-colors block ${
                                 theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-300 hover:text-purple-200'
                               }`}>
                                🔗 GitHub
                            </a>
                        </div>

                        {/* Team Member 3 */}
                        <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300
                                      animate-fade-in-right delay-900 duration-slower ease-bounce">
                            <div className="text-4xl mb-3">👨‍💻</div>
                            <h4 className={`font-montserrat text-xl font-bold mb-3 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                                Jan Opala
                            </h4>
                            <a href="mailto:jan.opala@example.com" 
                               className={`font-inter text-sm transition-colors block mb-2 ${
                                 theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-300 hover:text-blue-200'
                               }`}>
                                📧 Email
                            </a>
                            <a href="https://github.com/jan-opala" 
                               className={`font-inter text-sm transition-colors block ${
                                 theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-300 hover:text-purple-200'
                               }`}>
                                🔗 GitHub
                            </a>
                        </div>
                    </div>
                </div>

                {/* Project Repository */}
                <div className="text-center mb-12 animate-fade-in-up delay-1000 duration-medium ease-smooth">
                    <div className="glass p-6 rounded-2xl inline-block">
                        <p className={`font-inter mb-2 ${
                          theme === 'light' ? 'text-gray-800' : 'text-white'
                        }`}>
                            <strong className="font-montserrat text-xl">📦 Project Repository</strong>
                        </p>
                        <a href="https://github.com/your-repo" 
                           className={`font-space transition-colors text-lg ${
                             theme === 'light' ? 'text-emerald-600 hover:text-emerald-700' : 'text-emerald-300 hover:text-emerald-200'
                           }`}>
                            github.com/your-repo →
                        </a>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="text-center animate-fade-in-up delay-1200 duration-slowest ease-elastic">
                    <h3 className={`font-montserrat text-3xl font-bold mb-4 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                        💬 Get In Touch
                    </h3>
                    <p className={`font-inter text-lg max-w-2xl mx-auto ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                        Have questions or want to collaborate? We'd love to hear from you! 
                        Reach out through any of the channels above.
                    </p>
                </div>
            </div>
        </div>
        </div>
    )
}
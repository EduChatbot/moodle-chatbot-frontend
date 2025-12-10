"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

export default function AboutPage() {
    const { theme } = useTheme();
    const { backgroundColor } = useAnimation();
    const router = useRouter();
    const aboutSectionRef = useRef(null);

    // Auto-scroll to About Us section on mount
    useEffect(() => {
        if (aboutSectionRef.current) {
            aboutSectionRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
        }
    }, []);

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
                <div ref={aboutSectionRef} className="max-w-4xl mx-auto glass-strong p-8 rounded-3xl shadow-2xl">
                
                {/* Hero Title */}
                <h1 className={`font-playfair text-4xl md:text-5xl font-bold mb-6 text-center ${
                  theme === 'light'
                    ? backgroundColor === 'cream'
                      ? 'bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 bg-clip-text text-transparent'
                      : 'gradient-text-light'
                    : backgroundColor === 'gray'
                    ? 'bg-gradient-to-r from-zinc-400 via-zinc-300 to-zinc-400 bg-clip-text text-transparent'
                    : backgroundColor === 'darkblue'
                    ? 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'
                }`}>
                    About Us
                </h1>

                {/* Introduction */}
                <div className="space-y-4 mb-8">
                    <p className={`font-inter text-lg text-center leading-relaxed ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                    }`}>
                        We are passionate Data Science students at <span className={`font-montserrat font-semibold ${
                          theme === 'light' 
                            ? backgroundColor === 'cream' 
                              ? 'text-stone-700' 
                              : 'text-blue-600'
                            : backgroundColor === 'cream'
                            ? 'text-stone-400'
                            : 'text-blue-300'
                        }`}>Warsaw University of Technology</span>, 
                        combining cutting-edge AI technology with educational innovation.
                    </p>
                    <p className={`font-inter text-base text-center leading-relaxed ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                        This project represents our bachelor thesis work, showcasing our commitment to 
                        enhancing the learning experience through intelligent chatbot technology.
                    </p>
                    <p className={`font-space text-lg text-center font-semibold ${
                      theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'
                    }`}>
                        Feel free to reach out to us!
                    </p>
                </div>

                {/* Team Members Section */}
                <div className={`mb-8 pb-6 ${
                  theme === 'light' ? 'border-b border-gray-300' : 'border-b border-white/20'
                }`}>
                    <h3 className={`font-montserrat text-2xl font-bold mb-6 text-center ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                        🎓 Our Team
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-5 text-center hover:scale-105 transition-all duration-300">
                            <div className="text-3xl mb-2">👩‍💻</div>
                            <h4 className={`font-montserrat text-lg font-bold mb-2 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                                Anna Ostrowska
                            </h4>
                            <a href="mailto:anna.ostrowska@example.com" 
                               className={`font-inter text-sm transition-colors block mb-2 ${
                                 theme === 'light' 
                                   ? backgroundColor === 'cream'
                                     ? 'text-stone-700 hover:text-stone-800'
                                     : 'text-blue-600 hover:text-blue-700'
                                   : backgroundColor === 'cream'
                                   ? 'text-stone-400 hover:text-stone-300'
                                   : 'text-blue-300 hover:text-blue-200'
                               }`}>
                                📧 Email
                            </a>
                            <a href="https://github.com/anna-ostrowska" 
                               className={`font-inter text-sm transition-colors block ${
                                 theme === 'light'
                                   ? backgroundColor === 'cream'
                                     ? 'text-stone-600 hover:text-stone-700'
                                     : 'text-purple-600 hover:text-purple-700'
                                   : backgroundColor === 'cream'
                                   ? 'text-stone-500 hover:text-stone-400'
                                   : 'text-purple-300 hover:text-purple-200'
                               }`}>
                                🔗 GitHub
                            </a>
                        </div>

                        <div className="glass-card p-5 text-center hover:scale-105 transition-all duration-300">
                            <div className="text-3xl mb-2">👩‍💻</div>
                            <h4 className={`font-montserrat text-lg font-bold mb-2 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                                Gabriela Majstrak
                            </h4>
                            <a href="mailto:gabriela.majstrak@example.com" 
                               className={`font-inter text-sm transition-colors block mb-2 ${
                                 theme === 'light'
                                   ? backgroundColor === 'cream'
                                     ? 'text-stone-700 hover:text-stone-800'
                                     : 'text-blue-600 hover:text-blue-700'
                                   : backgroundColor === 'cream'
                                   ? 'text-stone-400 hover:text-stone-300'
                                   : 'text-blue-300 hover:text-blue-200'
                               }`}>
                                📧 Email
                            </a>
                            <a href="https://github.com/gabriela-majstrak" 
                               className={`font-inter text-sm transition-colors block ${
                                 theme === 'light'
                                   ? backgroundColor === 'cream'
                                     ? 'text-stone-600 hover:text-stone-700'
                                     : 'text-purple-600 hover:text-purple-700'
                                   : backgroundColor === 'cream'
                                   ? 'text-stone-500 hover:text-stone-400'
                                   : 'text-purple-300 hover:text-purple-200'
                               }`}>
                                🔗 GitHub
                            </a>
                        </div>

                        <div className="glass-card p-5 text-center hover:scale-105 transition-all duration-300">
                            <div className="text-3xl mb-2">👨‍💻</div>
                            <h4 className={`font-montserrat text-lg font-bold mb-2 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                                Jan Opala
                            </h4>
                            <a href="mailto:jan.opala@example.com" 
                               className={`font-inter text-sm transition-colors block mb-2 ${
                                 theme === 'light'
                                   ? backgroundColor === 'cream'
                                     ? 'text-stone-700 hover:text-stone-800'
                                     : 'text-blue-600 hover:text-blue-700'
                                   : backgroundColor === 'cream'
                                   ? 'text-stone-400 hover:text-stone-300'
                                   : 'text-blue-300 hover:text-blue-200'
                               }`}>
                                📧 Email
                            </a>
                            <a href="https://github.com/jan-opala" 
                               className={`font-inter text-sm transition-colors block ${
                                 theme === 'light'
                                   ? backgroundColor === 'cream'
                                     ? 'text-stone-600 hover:text-stone-700'
                                     : 'text-purple-600 hover:text-purple-700'
                                   : backgroundColor === 'cream'
                                   ? 'text-stone-500 hover:text-stone-400'
                                   : 'text-purple-300 hover:text-purple-200'
                               }`}>
                                🔗 GitHub
                            </a>
                        </div>
                    </div>
                </div>

                {/* Project Repository */}
                <div className="text-center mb-8">
                    <div className="glass p-5 rounded-2xl inline-block">
                        <p className={`font-inter mb-2 ${
                          theme === 'light' ? 'text-gray-800' : 'text-white'
                        }`}>
                            <strong className="font-montserrat text-xl">Project Repository</strong>
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
                <div className="text-center">
                    <h3 className={`font-montserrat text-2xl font-bold mb-3 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                        💬 Get In Touch
                    </h3>
                    <p className={`font-inter text-base max-w-2xl mx-auto ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                        Have questions or want to collaborate? We&apos;d love to hear from you! 
                        Reach out through any of the channels above.
                    </p>
                </div>
            </div>
        </div>
        </div>
    )
}
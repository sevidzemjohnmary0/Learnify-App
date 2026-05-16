/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS, COMMUNITIES, SUBJECTS } from './constants';
import { useAIAssistant } from './services/aiService';
import OfflineTracker from './services/trackerService';

type View = 'home' | 'ai' | 'communities' | 'library' | 'tracker' | 'auth';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ name: string; level: string } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<typeof SUBJECTS[0] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { messages, loading, sendMessage, snapAndSolve } = useAIAssistant();
  const { missedLessons, addMissed, removeMissed } = OfflineTracker();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMockAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string || 'Student';
    const level = formData.get('level') as string || 'Form 5';
    setUser({ name, level });
    setView('ai');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        snapAndSolve(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <img 
                src="https://i.pinimg.com/1200x/df/04/c4/df04c42c7f85f8bb47d1986c10fab17f.jpg" 
                alt="Learnify Logo" 
                className="w-10 h-10 rounded-lg object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-display font-bold tracking-tight">Learnify</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavButton active={view === 'home'} onClick={() => setView('home')}>Home</NavButton>
              {user ? (
                <>
                  <NavButton active={view === 'ai'} onClick={() => setView('ai')}>AI Tutor</NavButton>
                  <NavButton active={view === 'communities'} onClick={() => setView('communities')}>Communities</NavButton>
                  <NavButton active={view === 'library'} onClick={() => setView('library')}>Library</NavButton>
                  <NavButton active={view === 'tracker'} onClick={() => setView('tracker')}>Tracker</NavButton>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="w-6 h-6 bg-brand-royal rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{user.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <NavButton active={false} onClick={() => { setView('auth'); setAuthMode('login'); }}>Log In</NavButton>
                  <button 
                    onClick={() => { setView('auth'); setAuthMode('signup'); }}
                    className="bg-brand-royal text-white px-5 py-2 rounded-lg font-bold hover:bg-brand-navy transition-colors shadow-md"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <ICONS.X /> : <ICONS.Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass fixed inset-x-0 top-16 z-40 border-b p-4 space-y-4"
          >
            <MobileNavButton active={view === 'home'} onClick={() => { setView('home'); setIsMenuOpen(false); }}>Home</MobileNavButton>
            {user ? (
              <>
                <MobileNavButton active={view === 'ai'} onClick={() => { setView('ai'); setIsMenuOpen(false); }}>AI Tutor</MobileNavButton>
                <MobileNavButton active={view === 'communities'} onClick={() => { setView('communities'); setIsMenuOpen(false); }}>Communities</MobileNavButton>
                <MobileNavButton active={view === 'library'} onClick={() => { setView('library'); setIsMenuOpen(false); }}>Library</MobileNavButton>
                <MobileNavButton active={view === 'tracker'} onClick={() => { setView('tracker'); setIsMenuOpen(false); }}>Tracker</MobileNavButton>
              </>
            ) : (
              <>
                <MobileNavButton active={false} onClick={() => { setView('auth'); setAuthMode('login'); setIsMenuOpen(false); }}>Log In</MobileNavButton>
                <MobileNavButton active={false} onClick={() => { setView('auth'); setAuthMode('signup'); setIsMenuOpen(false); }}>Sign Up</MobileNavButton>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {view === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white">
            {/* Khan-style Hero */}
            <section className="relative min-h-[600px] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://i.pinimg.com/736x/06/11/77/06117735cd9aa77f0e23a02d88075622.jpg" 
                  alt="Hero Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
              </div>
              
              <div className="max-w-7xl mx-auto px-4 w-full relative z-10 text-center space-y-8 py-24">
                <h1 className="text-4xl md:text-7xl font-extrabold text-brand-navy leading-tight max-w-4xl mx-auto drop-shadow-sm">
                  Free, world-class education for anyone, anywhere.
                </h1>
                <p className="text-xl text-brand-navy/90 max-w-2xl mx-auto font-medium">
                  Learnify is a digital lifeline for students in Cameroon. Join our collaborative community to recover lost learning time and master your subjects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => { setView('auth'); setAuthMode('signup'); }} 
                    className="bg-brand-royal text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-navy transition-all shadow-xl active:scale-95"
                  >
                    Learners, start here
                  </button>
                  <button 
                    onClick={() => { setView('auth'); setAuthMode('signup'); }} 
                    className="bg-white text-brand-royal border-2 border-brand-royal px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-royal/10 transition-all shadow-xl active:scale-95"
                  >
                    Join the community
                  </button>
                </div>
              </div>
            </section>

            {/* Why it works - Segmented */}
            <section className="bg-gray-50 section-spacing">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Learnify Works</h2>
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 shadow-md border-4 border-white">
                      <img 
                        src="https://i.pinimg.com/1200x/41/04/77/41047752bbb211d5064516ee12e88fb9.jpg" 
                        alt="Personalized Learning" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">Personalized Learning</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our AI Tutor identifies your learning gaps and provides tailored explanations to help you master concepts at your own pace.
                    </p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 shadow-md border-4 border-white">
                      <img 
                        src="https://i.pinimg.com/1200x/15/21/c7/1521c7781296d344caf0426669695a5d.jpg" 
                        alt="Trusted Community" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">Trusted Community</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Created with experts and local teachers to ensure all content aligns with the GCE and local academic standards.
                    </p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 shadow-md border-4 border-white">
                      <img 
                        src="https://i.pinimg.com/1200x/77/a8/a4/77a8a40608f9f4105c93961f56b1dcb4.jpg" 
                        alt="Resilience Powered" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">Resilience Powered</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Designed to work offline and with low data, ensuring education continues even during power outages or lockdowns.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Subject Segments */}
            <section className="section-spacing">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-bold">Explore Our Content</h2>
                  <button onClick={() => setView('library')} className="text-brand-royal font-bold hover:underline">See all subjects</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {SUBJECTS.map((s, i) => (
                    <div 
                      key={s.name} 
                      onClick={() => setSelectedSubject(s)}
                      className="khan-card group cursor-pointer"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img 
                          src={s.image} 
                          alt={s.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm tracking-tight text-brand-navy">{s.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Support Message */}
            <section className="relative section-spacing py-24 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://i.pinimg.com/1200x/2e/d0/37/2ed037bdea2e0af0a5a0bc95ee8f5252.jpg" 
                  alt="Students Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm" />
              </div>
              
              <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white">Join 12,000+ Students Already Learning</h2>
                <p className="text-xl text-blue-100 font-medium">
                  Whether you're in Bamenda, Buea, or a rural village, your education shouldn't be on hold. Let's rebuild your academic future together.
                </p>
                <button 
                  onClick={() => { setView('auth'); setAuthMode('signup'); }}
                  className="bg-brand-cyan text-brand-navy px-12 py-5 rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-2xl"
                >
                  Get Started for Free
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'auth' && (
          <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center">
            <div className="w-16 h-16 mb-6">
              <img 
                src="https://i.pinimg.com/1200x/df/04/c4/df04c42c7f85f8bb47d1986c10fab17f.jpg" 
                alt="Logo" 
                className="w-full h-full rounded-2xl object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">
              {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              {authMode === 'signup' 
                ? 'Join thousands of students across Cameroon continuing their education.' 
                : 'Log in to continue your learning journey.'}
            </p>

            <form onSubmit={handleMockAuth} className="w-full space-y-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-1.5">Full Name</label>
                    <input 
                      required 
                      name="name"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-royal outline-none" 
                      placeholder="e.g. John Mary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-1.5">Current Academic Level</label>
                    <select 
                      name="level"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-royal outline-none bg-white font-medium"
                    >
                      <option>Form 5 (O-Level)</option>
                      <option>Upper Sixth (A-Level)</option>
                      <option>University / Higher Ed</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-1.5">Your Location</label>
                    <input 
                      required 
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-royal outline-none" 
                      placeholder="e.g. Bamenda, NW Region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-navy mb-1.5">What is your biggest learning challenge right now?</label>
                    <textarea 
                      className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-royal outline-none min-h-[100px]" 
                      placeholder="e.g. Missing notes, lack of teachers, slow internet..."
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-royal outline-none" 
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-navy mb-1.5">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-royal outline-none" 
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full h-12 bg-brand-royal text-white rounded-xl font-bold hover:bg-brand-navy transition-all shadow-lg active:scale-[0.98]"
              >
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-sm text-gray-500">
              {authMode === 'signup' ? (
                <span>Already have an account? <button onClick={() => setAuthMode('login')} className="text-brand-royal font-bold hover:underline">Log in</button></span>
              ) : (
                <span>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-brand-royal font-bold hover:underline">Sign up</button></span>
              )}
            </div>
          </div>
        )}

        {view === 'ai' && (
          <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-6 pb-24 messenger-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-20 space-y-4">
                  <div className="w-16 h-16 bg-brand-royal/10 rounded-full flex items-center justify-center mx-auto">
                    <ICONS.MessageSquare className="w-8 h-8 text-brand-royal" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Ask anything, learn everything</h2>
                  <p className="text-gray-500">How can I help you with your studies today, {user?.name}?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-brand-royal text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl p-4 animate-pulse text-gray-400">
                    Learnify is thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-gray-50 pt-10 pb-6 px-4">
              <div className="max-w-4xl mx-auto flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                  title="Snap & Solve"
                >
                  <ICONS.Camera className="w-6 h-6 text-gray-600" />
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Ask about Chemistry, Maths, History..." 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        sendMessage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full h-14 bg-white border border-gray-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-royal shadow-sm"
                  />
                  <button className="absolute right-3 top-2.5 p-2 text-brand-royal">
                    <ICONS.ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'communities' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold">Study Communities</h2>
                <p className="text-gray-500 mt-2">Connect with thousands of students across Cameroon</p>
              </div>
              <button className="bg-brand-royal text-white px-6 py-2 rounded-xl font-medium">Create Group</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMUNITIES.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <ICONS.Users className="text-brand-royal w-6 h-6" />
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded">Active Now</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{c.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{c.members.toLocaleString()} students studying together</p>
                  <button className="w-full py-3 bg-gray-50 text-brand-navy rounded-xl font-bold hover:bg-gray-100 transition-colors">Join Discussion</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'tracker' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-display font-bold mb-4">Continuity Tracker</h2>
            <p className="text-gray-500 mb-12">Don't let lockdowns disrupt your progress. Track what you missed and recover lost time.</p>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b bg-gray-50/50">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Enter missed lesson (e.g., Organic Chem Week 2)" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        addMissed(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 h-12 px-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-royal"
                  />
                  <button className="bg-brand-navy text-white px-6 rounded-xl font-bold">Add to List</button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                {missedLessons.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 italic">No missed lessons tracked. You're doing great!</div>
                ) : (
                  missedLessons.map((lesson, i) => (
                    <motion.div 
                      key={i} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400">{i+1}</div>
                        <span className="font-medium text-gray-700">{lesson}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setView('ai')}
                          className="px-4 py-2 bg-brand-royal/10 text-brand-royal rounded-lg text-sm font-bold hover:bg-brand-royal hover:text-white transition-all"
                        >
                          Catch Up with AI
                        </button>
                        <button 
                          onClick={() => removeMissed(i)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                        >
                          <ICONS.X className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'library' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-4xl font-display font-bold mb-12">Resource Library</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {SUBJECTS.map(s => (
                <div key={s.name} onClick={() => setSelectedSubject(s)} className="khan-card group cursor-pointer">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={s.image} 
                      alt={s.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">{s.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-sm text-gray-600">{s.description}</p>
                    <button className="text-brand-royal font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Course Outline <ICONS.ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-brand-navy rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Offline Learning Support</h3>
                <p className="text-blue-100 max-w-md">Download resources once and access them anytime. We optimize data usage for low bandwidth areas.</p>
                <div className="flex items-center gap-4 text-sm text-brand-cyan font-bold uppercase tracking-widest">
                  <ICONS.Smartphone className="w-4 h-4" /> Device Caching Enabled
                </div>
              </div>
              <button className="bg-white text-brand-navy px-8 py-4 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap">
                Manage Downloads
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="space-y-4 col-span-2">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.pinimg.com/1200x/df/04/c4/df04c42c7f85f8bb47d1986c10fab17f.jpg" 
                alt="Learnify Logo" 
                className="w-8 h-8 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-display font-bold">Learnify</span>
            </div>
            <p className="text-gray-500 max-w-sm">Empowering resilient learners across Cameroon. Quality education should reach every student, everywhere.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Platform</h4>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-royal">About Us</a></li>
              <li><a href="#" className="hover:text-brand-royal">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-royal">Terms of Service</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Community</h4>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-royal">Guidelines</a></li>
              <li><a href="#" className="hover:text-brand-royal">Teacher Support</a></li>
              <li><a href="#" className="hover:text-brand-royal">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-12 border-t mt-12 text-center text-gray-400 text-sm">
          © 2026 Learnify. Rebuilding education through technology.
        </div>
      </footer>

      <AnimatePresence>
        {selectedSubject && (
          <CourseOutlineModal 
            course={selectedSubject} 
            onClose={() => setSelectedSubject(null)} 
            onStart={() => {
              setSelectedSubject(null);
              setView('ai');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseOutlineModal({ course, onClose, onStart }: { course: typeof SUBJECTS[0], onClose: () => void, onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="relative h-48 sm:h-64 shrink-0">
          <img 
            src={course.image} 
            alt={course.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-colors"
          >
            <ICONS.X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-8 text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">{course.name}</h2>
            <div className="flex gap-4 text-sm font-medium opacity-90">
              <span>{course.duration}</span>
              <span>•</span>
              <span>{course.modules.length} Modules</span>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-brand-navy">Course Overview</h3>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-brand-navy">
                <span>Course Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  className="h-full bg-brand-cyan"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-brand-navy">Full Course Outline</h3>
            {course.modules.map((m, i) => (
              <div key={i} className="space-y-4">
                <h4 className="font-bold text-brand-royal flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-royal/10 flex items-center justify-center text-xs">
                    {i+1}
                  </div>
                  {m.title}
                </h4>
                <div className="grid gap-3 ml-8">
                  {m.lessons.map((lesson, li) => (
                    <label key={li} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-royal focus:ring-brand-royal" />
                      <span className="text-gray-700 text-sm font-medium group-hover:text-brand-navy">{lesson}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
          >
            Close
          </button>
          <button 
            onClick={onStart}
            className="flex-[2] py-4 px-6 bg-brand-royal text-white rounded-xl font-bold hover:bg-brand-navy transition-all shadow-xl active:scale-[0.98]"
          >
            Start Learning Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-1 py-1 font-medium transition-all relative ${active ? 'text-brand-royal' : 'text-gray-500 hover:text-brand-navy'}`}
    >
      {children}
      {active && <motion.div layoutId="nav-underline" className="absolute -bottom-1 inset-x-0 h-0.5 bg-brand-royal rounded-full" />}
    </button>
  );
}

function MobileNavButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left py-3 px-4 rounded-xl font-medium ${active ? 'bg-brand-royal/10 text-brand-royal' : 'text-gray-600'}`}
    >
      {children}
    </button>
  );
}

function FeatureCard({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
      <div className="text-brand-royal font-bold flex items-center gap-2 text-sm group-hover:gap-4 transition-all">
        Try It Now <ICONS.ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}

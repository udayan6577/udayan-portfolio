import React, { useEffect } from 'react';
import { ChevronLeft, Award, Users, Globe, Zap } from 'lucide-react';

// --- 1. Helper: Reveal Animation ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

// --- 2. Helper: Glass Shape ---
const GlassShape = ({ className, delay = "0s", type = "sphere" }) => {
  const floatStyle = {
    animation: `float 6s ease-in-out infinite`,
    animationDelay: delay,
  };
  return (
    <div className={`absolute pointer-events-none ${className}`} style={floatStyle}>
      <div className={`relative w-full h-full transform preserve-3d`}>
        <div className={`absolute inset-0 rounded-3xl opacity-90 blur-sm
          ${type === 'cube' ? 'bg-gradient-to-br from-purple-500/30 via-cyan-400/30 to-yellow-200/30' : 'bg-gradient-to-tr from-pink-500/30 via-blue-400/30 to-emerald-300/30'}
          border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl`}
        >
          <div className="absolute top-2 left-2 right-2 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"></div>
          <div className="absolute bottom-2 right-2 w-1/3 h-1/3 bg-purple-500/20 blur-xl rounded-full mix-blend-screen"></div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Component ---
const AboutPage = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 animate-fade-in relative overflow-hidden">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>

      {/* Floating Background Shapes */}
      <GlassShape className="w-48 h-48 top-20 left-[-5%] z-0 rotate-45 opacity-40 blur-md" delay="0s" type="cube" />
      <GlassShape className="w-32 h-32 bottom-40 right-[10%] z-0 -rotate-12 opacity-50" delay="2s" type="sphere" />

      {/* Nav */}
      <nav className="flex justify-between items-center mb-16 relative z-10">
         <div className="text-xl font-bold tracking-tighter">social.</div>
         <a href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={16} />
            Back to Home
         </a>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-24 text-center reveal-on-scroll relative z-10">
        <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-8">
          WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">SOCIAL.</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          We are not just a web agency; we are digital architects. We bridge the gap between imagination and reality, crafting online experiences that defy expectations.
        </p>
      </header>

      {/* Values Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative z-10">
        <div className="p-8 rounded-3xl border border-white/10 bg-white/5 reveal-on-scroll">
          <Zap className="text-purple-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Innovation First</h3>
          <p className="text-gray-400 text-sm">We don't follow trends; we set them. Our team is constantly exploring new technologies to give you the edge.</p>
        </div>
        <div className="p-8 rounded-3xl border border-white/10 bg-white/5 reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
          <Users className="text-blue-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Client Centric</h3>
          <p className="text-gray-400 text-sm">Your vision is our blueprint. We collaborate closely with you to ensure every pixel aligns with your brand goals.</p>
        </div>
        <div className="p-8 rounded-3xl border border-white/10 bg-white/5 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
          <Globe className="text-emerald-400 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Global Impact</h3>
          <p className="text-gray-400 text-sm">From local startups to global enterprises, our digital solutions are designed to scale and succeed anywhere.</p>
        </div>
      </div>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto mb-32 reveal-on-scroll relative z-10">
        <h2 className="text-4xl font-light mb-12 border-b border-white/10 pb-8">THE LEADERSHIP</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {/* Team Member 1 */}
           <div className="group">
             <div className="h-80 rounded-2xl overflow-hidden mb-4 relative">
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="CEO" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
             </div>
             <h3 className="text-lg font-bold">Alex Morgan</h3>
             <p className="text-purple-400 text-xs uppercase tracking-widest">Founder & CEO</p>
           </div>
           {/* Team Member 2 */}
           <div className="group">
             <div className="h-80 rounded-2xl overflow-hidden mb-4 relative">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" alt="Creative Director" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
             </div>
             <h3 className="text-lg font-bold">Sarah Jenkins</h3>
             <p className="text-purple-400 text-xs uppercase tracking-widest">Creative Director</p>
           </div>
           {/* Team Member 3 */}
           <div className="group">
             <div className="h-80 rounded-2xl overflow-hidden mb-4 relative">
               <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" alt="Tech Lead" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
             </div>
             <h3 className="text-lg font-bold">David Chen</h3>
             <p className="text-purple-400 text-xs uppercase tracking-widest">Tech Lead</p>
           </div>
            {/* Team Member 4 */}
            <div className="group">
             <div className="h-80 rounded-2xl overflow-hidden mb-4 relative">
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Marketing Head" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
             </div>
             <h3 className="text-lg font-bold">Emily Rose</h3>
             <p className="text-purple-400 text-xs uppercase tracking-widest">Marketing Head</p>
           </div>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 py-16 border-t border-white/10 reveal-on-scroll">
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">100+</div>
          <div className="text-gray-500 text-sm uppercase tracking-widest">Projects Completed</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">32</div>
          <div className="text-gray-500 text-sm uppercase tracking-widest">Global Partners</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">5</div>
          <div className="text-gray-500 text-sm uppercase tracking-widest">Years of Excellence</div>
        </div>
      </div>

      <footer className="text-center text-gray-700 text-[10px] uppercase tracking-widest pb-8 pt-20">
        © 2024 Social Agency. All Rights Reserved.
      </footer>
    </div>
  );
};

export default AboutPage;
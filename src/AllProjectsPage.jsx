import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

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

// --- 3. Data ---
const ALL_PROJECTS = [
  {
    title: "Neon City Brand",
    category: "Branding / Identity",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
    description: "A futuristic rebrand for a leading tech conglomerate in Tokyo."
  },
  {
    title: "Abstract Architecture",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    description: "Award-winning portfolio site for modern minimalist architects."
  },
  {
    title: "Cyberpunk UI Kit",
    category: "Development",
    image: "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&w=800&q=80",
    description: "A comprehensive React component library for dashboard applications."
  },
  {
    title: "Holographic Fashion",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    description: "Viral social media campaign for the season's hottest wearable tech."
  },
  {
    title: "Virtual Reality Expo",
    category: "Experience Design",
    image: "https://images.unsplash.com/photo-1592478411213-61535fdd861d?auto=format&fit=crop&w=800&q=80",
    description: "Immersive VR environment for a global electronics trade show."
  },
  {
    title: "Eco-Tech Dashboard",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    description: "Monitoring interface for sustainable energy grid management."
  },
  {
    title: "Fintech Mobile App",
    category: "App Development",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "Secure and sleek mobile banking application for Gen Z."
  },
  {
    title: "Digital Art Gallery",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    description: "Online exhibition space for NFT artists and collectors."
  }
];

// --- 4. Main Component for this File ---
const AllProjectsPage = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 animate-fade-in relative overflow-hidden">
      {/* Inline styles for this page specifically */}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>

      {/* Background Floating Shapes */}
      <GlassShape className="w-32 h-32 top-20 right-[5%] z-0 rotate-12 opacity-60" delay="0s" type="cube" />
      <GlassShape className="w-20 h-20 bottom-32 left-[8%] z-0 -rotate-12 opacity-40" delay="2s" type="sphere" />
      <GlassShape className="w-48 h-48 top-1/3 left-[-5%] z-0 rotate-45 opacity-20 blur-md" delay="4s" type="cube" />
      <GlassShape className="w-40 h-40 bottom-10 right-[-5%] z-0 -rotate-12 opacity-30" delay="1s" type="sphere" />

      <nav className="flex justify-between items-center mb-16 relative z-10">
         <div className="text-xl font-bold tracking-tighter">social.</div>
         <a href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={16} />
            Back to Home
         </a>
      </nav>

      <header className="max-w-7xl mx-auto mb-20 text-center reveal-on-scroll relative z-10">
        <GlassShape className="w-64 h-64 top-0 left-1/2 -translate-x-1/2 opacity-20 -z-10 blur-xl" type="sphere" />
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6">ALL PROJECTS</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          A comprehensive archive of our digital craftsmanship. From branding to full-stack development.
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 relative z-10">
        {ALL_PROJECTS.map((project, index) => (
          <div key={index} className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 bg-white/5 reveal-on-scroll cursor-pointer hover:border-white/30 transition-colors">
            <div className="absolute inset-0">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
               <span className="text-purple-400 text-[10px] font-bold tracking-wider uppercase mb-1">{project.category}</span>
               <h3 className="text-xl font-medium leading-tight mb-2 group-hover:text-white transition-colors">{project.title}</h3>
               <p className="text-gray-400 text-xs line-clamp-2 group-hover:text-gray-200">{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center text-gray-700 text-[10px] uppercase tracking-widest pb-8 relative z-10">
        © 2024 Social Agency. All Rights Reserved.
      </footer>
    </div>
  );
};

export default AllProjectsPage;
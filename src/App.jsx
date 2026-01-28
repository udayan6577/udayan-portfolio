import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import emailjs from "@emailjs/browser";
import ReactGA from "react-ga4";
import Lenis from "lenis";

// --- RESTORED IMPORTS ---
import ClickSpark from "./ClickSpark";
import BlobCursor from "./BlobCursor";

// --- ASSET IMPORTS ---
import cafeImg from "./assets/cafe.jpeg";
import cubePng from "./assets/cube.png";
import furniHomePng from "./assets/furnihome.png";

import {
  ArrowRight,
  Menu,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
  Instagram,
  MessageCircle,
  CheckCircle,
  Plus,
  Minus,
  Linkedin, 
  Code2,
  Cpu,
  Brain,
  Loader2,
  Lock,
  MapPin,
  GraduationCap,
  User,
} from "lucide-react";

// ==========================================
// CONFIG: BRANDING
// ==========================================
const BRAND_NAME = "Udayan";

// ==========================================
// UTILITY: DETECT MOBILE
// ==========================================
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

// ==========================================
// SECTION 0: ASSETS
// ==========================================

const SnowOverlay = () => {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  const particleCount = 20;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-80"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 300),
            y: -20,
            scale: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: (typeof window !== "undefined" ? window.innerHeight : 800) + 20,
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 300),
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
          style={{ width: "6px", height: "6px", filter: "blur(1px)" }}
        />
      ))}
    </div>
  );
};

// ==========================================
// SECTION 1: CONTEXT & UTILITIES (LENIS)
// ==========================================

const ScrollContext = createContext({
  lenis: null,
});

const useLenis = () => useContext(ScrollContext);

const SmoothScrollWrapper = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    setLenisInstance(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <ScrollContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </ScrollContext.Provider>
  );
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const ParallaxGlassShape = ({ className, type = "cube", speed = 6 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300 * speed]);

  return (
    <motion.div
      style={{ y }}
      className={`absolute pointer-events-none ${className} z-0`}
    >
      <div className="animate-float w-full h-full">
        <div className={`relative w-full h-full transform preserve-3d`}>
          <div
            className={`absolute inset-0 rounded-3xl opacity-90 blur-sm
            ${
              type === "cube"
                ? "bg-gradient-to-br from-purple-500/30 via-cyan-400/30 to-yellow-200/30"
                : "bg-gradient-to-tr from-pink-500/30 via-blue-400/30 to-emerald-300/30"
            }
            border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl`}
          >
            <div className="absolute top-2 left-2 right-2 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"></div>
            <div className="absolute bottom-2 right-2 w-1/3 h-1/3 bg-purple-500/20 blur-xl rounded-full mix-blend-screen"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const XSocialIcon = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ==========================================
// SECTION 2: COMPONENTS (Contact)
// ==========================================

const ContactModal = ({ isOpen, onClose }) => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const SERVICE_ID = "service_0z0ymad";
    const TEMPLATE_ID = "template_7u0ahzo";
    const PUBLIC_KEY = "nq3Rv-mgitwtfV7a8";

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          ReactGA.event({
            category: "Lead",
            action: "Form Submitted",
            label: "Contact Modal",
          });
          alert("Message sent successfully!");
          e.target.reset();
          onClose();
          setIsSending(false);
        },
        (error) => {
          console.error("FAILED...", error.text);
          alert("Failed to send message. Please try again.");
          setIsSending(false);
        },
      );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl md:text-3xl font-medium text-white mb-2">
          Tell Us Your Story
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          We don't just want specs. We want to know your goals.
        </p>

        <form ref={form} className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Email"
            required
          />
          <textarea
            rows="4"
            name="message"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="What are you struggling with right now?"
            required
          ></textarea>
          <button
            type="submit"
            disabled={isSending}
            className={`w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-purple-100 transition-colors flex justify-center items-center gap-2 ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span>{isSending ? "Sending..." : "Let's Grow"}</span>{" "}
            {!isSending && <Send size={16} />}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// SECTION 3: PAGES
// ==========================================

const MAIN_PROJECTS = [
  {
    title: "Furni Home",
    category: "E-Commerce UI",
    image: furniHomePng,
    description:
      "A scalable e-commerce interface focusing on conversion optimization and seamless product filtering.",
  },
  {
    title: "Morning Brew",
    category: "Hospitality UX",
    image: cafeImg,
    description:
      "Digital storefront concept designed to capture local traffic and showcase brand atmosphere.",
  },
  {
    title: "Modern Agency",
    category: "Corporate Identity",
    image: cubePng,
    description:
      "Minimalist B2B portfolio layout emphasizing typography, speed, and clear value propositions.",
  },
];
const ALL_PROJECTS = [...MAIN_PROJECTS];

const AllProjectsPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen text-white p-6 md:p-12 relative overflow-hidden">
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } } .animate-float { animation: float 6s ease-in-out infinite; }`}</style>

      <ParallaxGlassShape
        className="w-32 h-32 top-20 right-[5%] rotate-12 opacity-60"
        type="cube"
        speed={5}
      />
      <ParallaxGlassShape
        className="w-20 h-20 bottom-32 left-[8%] -rotate-12 opacity-40"
        type="sphere"
        speed={1.2}
      />

      <nav className="flex justify-between items-center mb-10 md:mb-16 relative z-[2]">
        <div className="z-50 relative flex items-center gap-3">
          {/* LOGO */}
          <span className="text-white font-bold tracking-tight text-xl font-mono group-hover:text-purple-400 transition-colors">
            <span className="text-purple-500">&lt;</span> {BRAND_NAME}{" "}
            <span className="text-purple-500">/&gt;</span>
          </span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />{" "}
          <span className="hidden md:inline">Back to Home</span>
          <span className="md:hidden">Back</span>
        </a>
      </nav>

      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto mb-12 md:mb-20 text-center relative z-[2]"
      >
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-4 md:mb-6">
            REAL RESULTS
          </h1>
        </div>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          See how digital transformation drives growth.
        </p>
      </motion.header>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20 relative z-[2]"
      >
        {ALL_PROJECTS.map((project, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={window.innerWidth > 768 ? { scale: 1.02 } : {}}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer hover:border-purple-500/30 transition-colors"
          >
            <div className="absolute inset-0">
              {project.video && hoveredIndex === index ? (
                <video
                  src={project.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <img
                  src={project.image}
                  loading="lazy"
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-100 group-hover:brightness-110"
                />
              )}
              <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
                <span className="text-purple-400 text-[10px] font-bold tracking-wider uppercase mb-1">
                  {project.category}
                </span>
                <h3 className="text-xl font-medium leading-tight mb-2 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen text-white p-6 md:p-12 relative overflow-hidden">
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } } .animate-float { animation: float 6s ease-in-out infinite; }`}</style>

      <ParallaxGlassShape
        className="w-32 h-32 top-20 right-[5%] rotate-12 opacity-60"
        type="cube"
        speed={5}
      />
      <ParallaxGlassShape
        className="w-32 h-32 bottom-40 right-[10%] -rotate-12 opacity-50"
        type="sphere"
        speed={1.5}
      />

      <nav className="flex justify-between items-center mb-10 md:mb-16 relative z-[2]">
        <div className="z-50 relative flex items-center gap-3">
          {/* LOGO */}
          <span className="text-white font-bold tracking-tight text-xl font-mono group-hover:text-purple-400 transition-colors">
            <span className="text-purple-500">&lt;</span> {BRAND_NAME}{" "}
            <span className="text-purple-500">/&gt;</span>
          </span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />{" "}
          <span className="hidden md:inline">Back to Home</span>
          <span className="md:hidden">Back</span>
        </a>
      </nav>

      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto mb-16 md:mb-24 text-center relative z-[2]"
      >
        <h1 className="text-4xl md:text-8xl font-medium tracking-tight mb-4 md:mb-8">
          LISTENING{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">
            FIRST.
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Not just building websites. Building relationships with business
          owners who want to grow.
        </p>
      </motion.header>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-32 relative z-[2]"
      >
        {[
          {
            Icon: MessageCircle,
            title: "Listen First",
            color: "text-purple-400",
            desc: "No jargon. No assumptions. Just an honest conversation about goals.",
          },
          {
            Icon: Users,
            title: "Human Centric",
            color: "text-indigo-400",
            desc: "Designing for the real people who buy the products, not for awards.",
          },
          {
            Icon: Globe,
            title: "Real Growth",
            color: "text-blue-400",
            desc: "Focusing on metrics that matter: sales, leads, and time.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 h-full hover:bg-white/10 transition-colors relative"
          >
            <item.Icon className={`${item.color} mb-4`} size={32} />
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// ==========================================
// SECTION 4: NAV & LANDING
// ==========================================

const Navbar = ({ onOpenContact }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lenis } = useLenis();

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(targetId);
    } else {
      const element = document.querySelector(targetId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[80] flex justify-between items-center px-4 py-3 md:px-12 md:py-6 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="z-50 relative flex items-center gap-2 md:gap-3 shrink-0">
          <a href="/" className="relative flex items-center gap-2 cursor-pointer select-none group">
            {/* LOGO */}
            <span className="text-white font-bold tracking-tight text-xl md:text-2xl font-mono group-hover:text-purple-400 transition-colors">
              <span className="text-purple-500">&lt;</span> {BRAND_NAME}{" "}
              <span className="text-purple-500">/&gt;</span>
            </span>
          </a>
        </div>

        <div className="hidden md:flex space-x-8 text-sm text-gray-300 font-medium items-center">
          <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="hover:text-white transition-colors">Home</a>
          <a href="#projects" onClick={(e) => handleScrollTo(e, "#projects")} className="hover:text-white transition-colors">Work</a>
          <a href="#about" onClick={(e) => handleScrollTo(e, "#about")} className="hover:text-white transition-colors">About</a>
          <a href="#faq" onClick={(e) => handleScrollTo(e, "#faq")} className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/20 pr-6">
            {/* INSTAGRAM REMOVED FROM HERE */}
            <a
              href="https://www.linkedin.com/in/udayan-nawani-0678692b8"// Your LinkedIn URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
          <button onClick={onOpenContact} className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">Let's Talk</button>
        </div>

        <button className="md:hidden text-white z-50 relative p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className={`fixed inset-0 bg-black z-[70] flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="text-3xl text-white font-light">Home</a>
        <a href="#projects" onClick={(e) => handleScrollTo(e, "#projects")} className="text-3xl text-white font-light">Work</a>
        <a href="#about" onClick={(e) => handleScrollTo(e, "#about")} className="text-3xl text-white font-light">About</a>
        <a href="#faq" onClick={(e) => handleScrollTo(e, "#faq")} className="text-3xl text-white font-light">FAQ</a>

        <div className="flex items-center gap-8 mt-4">
          {/* INSTAGRAM REMOVED FROM HERE */}
          <a
            href="#" // Your LinkedIn URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-500 transition-colors"
          >
            <Linkedin size={24} />
          </a>
        </div>

        <button onClick={() => { setIsMenuOpen(false); onOpenContact(); }} className="mt-4 bg-white text-black px-8 py-3 rounded-full text-sm font-bold">Let's Talk</button>
      </div>
    </>
  );
};

const Hero = () => (
  <section
    id="home"
    className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden"
  >
    <style>{`@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(2deg); } } .animate-float { animation: float 4s ease-in-out infinite; }`}</style>

    <ParallaxGlassShape
      className="w-48 h-48 md:w-64 md:h-64 top-20 right-[15%] rotate-12 opacity-60"
      type="cube"
      speed={5}
    />
    <ParallaxGlassShape
      className="w-24 h-24 md:w-32 md:h-32 bottom-32 left-[10%] z-0 -rotate-12 opacity-50"
      type="sphere"
      speed={1.5}
    />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="z-[2] text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center"
    >
      <motion.div
        variants={fadeInUp}
        className="mb-4 inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs tracking-widest uppercase font-mono"
      >
        Student • Developer • Explorer
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        className="text-4xl sm:text-6xl md:text-8xl font-medium text-white tracking-tight leading-[0.95] mb-6 relative w-full text-center"
      >
        <span className="relative inline-block">LEARNING</span>

        <span className="block font-light italic opacity-90 text-purple-500 mt-2">
          BY
        </span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
          BUILDING.
        </span>
      </motion.h1>

      <motion.div
        variants={fadeInUp}
        className="mt-4 md:mt-8 max-w-xl mx-auto text-gray-400 text-xs md:text-base leading-relaxed px-4"
      >
        Documenting my journey as a Computer Science student at Doon University. 
        Turning caffeine and curiosity into code, one project at a time.
      </motion.div>
    </motion.div>
  </section>
);

const PersonalInfo = () => {
  return (
    <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-white/20 transition-colors"
      >
        <div className="relative z-[2]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-1">
                Udayan Nawani
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Computer Science Student
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">University</h3>
                <p className="text-gray-400 text-sm">Doon University</p>
                <p className="text-purple-400 text-xs mt-1">First Year Student</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-pink-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Passion</h3>
                <p className="text-gray-400 text-sm">I love to travel</p>
                <p className="text-pink-400 text-xs mt-1">Exploring new places</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const TechStack = () => {
  const stack = [
    {
      name: "React",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      color: "text-[#61DAFB]",
    },
    {
      name: "Tailwind CSS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      color: "text-[#06B6D4]",
    },
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      color: "text-[#F7DF1E]",
    },
    {
      name: "Supabase",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
      color: "text-[#3ECF8E]",
    },
    {
      name: "CSS3",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
      color: "text-[#1572B6]",
    },
    {
      name: "Git",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      color: "text-[#F05032]",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-5xl text-white font-light mb-4">
          MY TOOLKIT
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          The modern technologies I use to build fast, scalable, and dynamic
          applications.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        {stack.map((tech, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-default group"
          >
            <div className="w-12 h-12 mb-4 relative">
              {/* Colored Glow behind the logo */}
              <div
                className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                style={{
                  backgroundColor: tech.color
                    .replace("text-[", "")
                    .replace("]", ""),
                }}
              ></div>

              <img
                src={tech.icon}
                alt={tech.name}
                className="w-full h-full object-contain relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <span className="text-gray-400 font-medium text-sm group-hover:text-white transition-colors">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount =
        container.clientWidth / (window.innerWidth < 768 ? 1 : 2);
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="projects"
      className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto relative"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 relative"
      >
        <div>
          <div className="flex items-center relative">
            <h2 className="text-3xl md:text-5xl text-white font-light">
              DESIGN CONCEPTS
            </h2>
          </div>
          <p className="text-gray-400 text-sm mt-4 max-w-xs">
            Explorations in interface design, user experience, and modern web
            standards.
          </p>
        </div>
        <div className="hidden md:flex gap-4 mt-6 md:mt-0 z-[10]">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          willChange: "scroll-position",
        }}
      >
        {MAIN_PROJECTS.map((project, index) => (
          <motion.div
            whileHover={window.innerWidth > 768 ? { scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="flex-none w-[85vw] md:w-[calc(50%-12px)] snap-center group relative h-80 md:h-96 rounded-3xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer z-[2]"
          >
            <div className="absolute inset-0">
              {project.video && hoveredIndex === index ? (
                <video
                  src={project.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <img
                  src={project.image}
                  loading="lazy"
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-100 group-hover:brightness-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-70"></div>
            </div>
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-purple-400 text-xs font-bold tracking-wider uppercase mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl md:text-3xl text-white font-medium mb-2 leading-tight">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto overflow-hidden">
                  {project.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section
      id="about"
      className="relative py-12 md:py-24 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <ParallaxGlassShape
        className="w-16 h-16 md:w-24 md:h-24 top-0 right-1/3 opacity-80 rotate-45"
        type="cube"
        speed={0.8}
      />
      <ParallaxGlassShape
        className="w-24 h-24 md:w-40 md:h-40 bottom-[-50px] right-0 opacity-60 -rotate-12"
        type="sphere"
        speed={1.2}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start relative z-[2]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl text-white font-light mb-6">
            MEET THE{" "}
            <span className="text-purple-500 italic">BUILDER.</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            I am Udayan Nawani, a first-year Computer Science student at Doon University, Dehradun.
          </p>
          
          {/* Existing Technical Vision Paragraph */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            It’s easy to feel misunderstood when explaining a technical vision.
            My approach is about sitting down, learning about your late nights,
            your customers, and your goals. It's not just code; it's a
            partnership.
          </p>

          {/* New Travel Paragraph */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            When I am not coding websites or experimenting with IoT circuits, I love to travel. Exploring new places fuels my creativity and helps me see the world through a different lens.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white text-lg font-medium italic mb-4">
              "Learning one line of code at a time, building for the future."
            </p>
            <div className="flex items-center gap-3">
              <span className="text-purple-400 font-mono font-bold text-sm">
                &lt; {BRAND_NAME} /&gt;
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">MY PROCESS</h3>
          {[
            {
              title: "1. Listen",
              desc: "No tech jargon. Just an honest conversation about your goals.",
            },
            {
              title: "2. Plan",
              desc: "Mapping out a strategy that targets your ideal customer.",
            },
            {
              title: "3. Build",
              desc: "Writing clean, scalable code (React, Supabase, IoT).",
            },
            {
              title: "4. Grow",
              desc: "Launch support and scaling strategies.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="mt-1 text-purple-500">
                <CheckCircle size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{step.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 5: FAQ
// ==========================================

const FAQ_DATA = [
  {
    q: "Who is behind this portfolio?",
    a: "I am Udayan, a Computer Science student based in Dehradun. This website is my digital playground where I showcase my coding journey, experiments, and the skills I'm learning in university.",
  },
  {
    q: "Are you taking freelance clients?",
    a: "Not currently. I am fully focused on my studies and building personal engineering projects. I'm not running a business right now—just building for the love of code and problem-solving.",
  },
  {
    q: "Why build custom sites if you aren't selling them?",
    a: "To master the craft. University teaches the theory; building real projects like 'Furni' or IoT systems teaches me the actual engineering. I build to learn, not just to earn.",
  },
  {
    q: "What are your main technical interests?",
    a: "I live at the intersection of Software and Hardware. While I build modern web interfaces with React & Tailwind, I am deeply passionate about IoT, Arduino, and using Python to connect code to the physical world.",
  },
  {
    q: "What is 'The Trajectory'?",
    a: "It's my roadmap. Since I am in my first year, I don't claim to know everything. The Trajectory section transparently shows what I've mastered, what I'm learning now, and the advanced tech (AI/Security) I aim to conquer next.",
  },
  {
    q: "What's your favorite project so far?",
    a: "Each project teaches me something different. 'Furni Home' pushed my React skills, while my IoT experiments with Arduino taught me how code interacts with the physical world. I'm most excited about what I'll build next.",
  },
  {
    q: "How do you balance university and coding projects?",
    a: "It's all about time management and passion. When you genuinely enjoy coding, it doesn't feel like extra work—it's how I unwind. I code late nights and weekends because I want to, not because I have to.",
  },
  {
    q: "Are you open to collaborating on projects?",
    a: "Absolutely! I love learning from others and contributing to interesting projects. If you're working on something cool or want to build together, feel free to reach out. Collaboration is how we grow faster.",
  },
  {
    q: "What technologies are you learning next?",
    a: "Right now, I'm diving deeper into Python for IoT applications and exploring backend development. Looking ahead, I'm excited about AI/ML and cybersecurity—that's what 'The Architect' phase in my trajectory is all about.",
  },
  {
    q: "Do you contribute to open source?",
    a: "I'm starting to! As I build more confidence in my code, I plan to contribute to projects I use and love. Open source is the best way to learn from experienced developers and give back to the community.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="faq"
      className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-light italic mb-4 text-purple-500 ">
          FAQ<span className=" text-white italic">s</span>
        </h2>
        <p className="text-gray-400 text-sm">
          Common questions about the process.
        </p>
      </motion.div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-white/10 last:border-0"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center py-5 text-left group"
            >
              <span
                className={`text-lg md:text-xl font-medium transition-colors ${openIndex === index ? "text-white" : "text-gray-300 group-hover:text-purple-400"}`}
              >
                {item.q}
              </span>
              <span
                className={`ml-4 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-purple-500" : "text-gray-500"}`}
              >
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-gray-400 text-sm md:text-base leading-relaxed pr-8">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Footer = ({ onOpenContact }) => (
  <section className="relative pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
    <ParallaxGlassShape className="w-64 h-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 -rotate-12 blur-sm" type="cube" speed={0.6} />

    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="z-[2] w-full max-w-5xl">
      
      <motion.p variants={fadeInUp} className="text-gray-00 text-xs md:text-sm max-w-md mx-auto mb-10">
       
      </motion.p>
      

      <motion.div variants={fadeInUp} className="mt-16 md:mt-24 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
        
      </motion.div>
    </motion.div>
  </section>
);
// Add these new icons to your import list at the top:
// Brain, Shield, Cpu, Code2, Terminal 

const LearningPath = () => {
  const steps = [
    {
      status: "unlocked",
      year: "Now",
      title: "The Builder",
      desc: "Mastering the core of the web. Building responsive, dynamic interfaces with React & Tailwind.",
      tags: ["React", "UI/UX", "Frontend"],
      icon: <Code2 className="text-white" size={24} />,
      color: "bg-purple-500"
    },
    {
      status: "loading",
      year: "Next",
      title: "The Engineer",
      desc: "Bridging the gap between software and the physical world using Python and microcontrollers.",
      tags: ["IoT", "Arduino", "Python"],
      icon: <Cpu className="text-white" size={24} />,
      color: "bg-blue-500"
    },
    {
      status: "locked",
      year: "Future",
      title: "The Architect",
      desc: "Infusing applications with intelligence and securing them against vulnerabilities.",
      tags: ["AI/ML", "Ethical Hacking", "Security"],
      icon: <Brain className="text-white" size={24} />,
      color: "bg-pink-500"
    }
  ];

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={fadeInUp} 
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl text-white font-light mb-4">THE TRAJECTORY</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          I am a student first. Here is how I plan to evolve my stack over the next few years.
        </p>
      </motion.div>

      <div className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-blue-500 to-gray-800 -translate-x-1/2"></div>

        <div className="space-y-12 md:space-y-24">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 w-4 h-4 rounded-full bg-black border-2 border-white z-10 -translate-x-1/2 -translate-y-1/2 md:translate-y-[-50%]">
                <div className={`w-full h-full rounded-full ${step.status === 'unlocked' ? 'bg-purple-500 animate-pulse' : 'bg-transparent'}`}></div>
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0">
                <div className={`p-6 rounded-2xl border ${step.status === 'locked' ? 'border-white/5 bg-white/5 backdrop-blur-md z-10 opacity-90' : 'border-white/10 bg-white/5 backdrop-blur-md'} relative overflow-hidden group hover:border-white/20 transition-colors`}>
                  
                  {/* Status Label */}
                  <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest">
                    {step.status === 'unlocked' && <span className="text-green-300 flex items-center gap-1.5"><CheckCircle size={14} /> Active</span>}
                    {step.status === 'loading' && <span className="text-blue-300 flex items-center gap-1.5"><Loader2 className="animate-spin" size={14} /> Loading</span>}
                    {step.status === 'locked' && <span className="text-gray-300 flex items-center gap-1.5"><Lock size={14} /> Locked</span>}
                  </div>

                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                    {step.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag, t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Empty Spacer for alternating layout */}
              <div className="w-full md:w-1/2 hidden md:block"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MainLandingPage = ({ onOpenContact }) => {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <PersonalInfo />
      <About />
      <Projects />
      <TechStack />
      <LearningPath />
      {/* BlogSection & Newsletter removed */}
      <FAQ />
      <Footer onOpenContact={onOpenContact} />
    </main>
  );
};

const App = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const isMobile = useIsMobile();

  useEffect(() => {
    ReactGA.initialize("G-SKZQQS24T0");
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
      title: "Home Page",
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (view === "all-projects") {
      setCurrentView("all-projects");
    } else if (view === "about") {
      setCurrentView("about");
    }
  }, []);

  // Content Selection Logic
  let content;
  if (currentView === "all-projects") {
    content = <AllProjectsPage />;
  } else if (currentView === "about") {
    content = <AboutPage />;
  } else {
    content = (
      <>
        <Navbar onOpenContact={() => setIsContactOpen(true)} />
        <MainLandingPage onOpenContact={() => setIsContactOpen(true)} />
      </>
    );
  }

  return (
    <SmoothScrollWrapper>
      <div className="bg-black min-h-screen font-sans selection:bg-purple-500 selection:text-white pb-12 overflow-x-hidden w-full">
        <style>{`html { scroll-behavior: auto; } body { overflow-x: hidden; width: 100%; }`}</style>

        <SnowOverlay />

        {!isMobile && (
          <BlobCursor
            blobType="circle"
            fillColor="#8b5cf6"
            trailCount={3}
            sizes={[60, 50, 75]}
            innerSizes={[20, 35, 25]}
            innerColor="rgba(255,255,255,0.8)"
            opacities={[0.6, 0.6, 0.6]}
            shadowColor="rgba(0,0,0,0.75)"
            shadowBlur={5}
            shadowOffsetX={10}
            shadowOffsetY={10}
            filterStdDeviation={30}
            useFilter={true}
            fastDuration={0.1}
            slowDuration={0.5}
            zIndex={0}
          />
        )}

        {isMobile ? (
          <div className="w-full h-full">{content}</div>
        ) : (
          <ClickSpark
            sparkColor="#ffffff"
            sparkSize={20}
            sparkRadius={20}
            sparkCount={8}
            duration={400}
          >
            {content}
          </ClickSpark>
        )}

        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </SmoothScrollWrapper>
  );
};

export default App;

import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bus, MapPin, Clock, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-purple-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <nav className="flex justify-between items-center mb-10 sm:mb-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-dark-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              CitiConnect
            </span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh] lg:min-h-[70vh]">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Track Your Bus
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                In Real-Time
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Never miss your bus again. Track live locations, get accurate ETAs, and plan your journey with confidence.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/login')}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-purple-600 dark:to-purple-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-purple-400 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-200 dark:border-purple-800 hover:scale-105"
              >
                Sign Up Free
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-6 sm:pt-8 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-green-600 dark:text-green-400" size={18} />
                </div>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Accurate ETA</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bus className="text-purple-600 dark:text-purple-400" size={18} />
                </div>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">All Routes</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="text-orange-600 dark:text-orange-400" size={18} />
                </div>
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Safe & Secure</span>
              </div>
            </div>
          </div>

          {/* Right Animation - Futuristic Bus with Particles */}
          <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] order-first lg:order-last">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-2xl scale-75 sm:scale-90 lg:scale-100">
              {/* Animated Particles */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-3 h-3 bg-primary-400 rounded-full animate-particle-1"></div>
                <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400 rounded-full animate-particle-2"></div>
                <div className="absolute bottom-32 left-32 w-4 h-4 bg-pink-400 rounded-full animate-particle-3"></div>
                <div className="absolute top-60 right-40 w-2 h-2 bg-cyan-400 rounded-full animate-particle-4"></div>
                <div className="absolute bottom-40 right-16 w-3 h-3 bg-orange-400 rounded-full animate-particle-1"></div>
                <div className="absolute top-32 left-40 w-2 h-2 bg-green-400 rounded-full animate-particle-3"></div>
              </div>

              {/* Circular Track */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 border-4 border-dashed border-primary-300/30 dark:border-purple-500/30 rounded-full animate-spin-very-slow"></div>
                <div className="absolute w-80 h-80 border-4 border-dashed border-purple-300/30 dark:border-pink-500/30 rounded-full animate-spin-reverse"></div>
              </div>

              {/* Main Bus Animation Container */}
              <div className="relative z-10 flex items-center justify-center h-[500px]">
                {/* Orbiting Bus */}
                <div className="absolute inset-0 flex items-center justify-center animate-orbit">
                  <div className="relative transform-gpu" style={{ transform: 'rotateX(15deg) rotateY(-15deg)' }}>
                    {/* Bus Shadow */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-80 h-20 bg-black/30 dark:bg-black/50 rounded-full blur-3xl animate-shadow-pulse"></div>
                    
                    {/* Bus Body Container */}
                    <div className="relative w-[380px] h-[260px]">
                      {/* Energy Field */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-pink-500 dark:to-orange-500 rounded-full blur-3xl opacity-40 animate-energy-pulse"></div>
                      
                      {/* Speed Lines */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 flex gap-2 animate-speed-lines">
                        <div className="w-20 h-1 bg-gradient-to-r from-transparent to-primary-400 rounded-full"></div>
                        <div className="w-16 h-1 bg-gradient-to-r from-transparent to-purple-400 rounded-full"></div>
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent to-pink-400 rounded-full"></div>
                      </div>
                      
                      {/* Bus Main Body - Futuristic 3D */}
                      <div className="relative">
                        {/* Holographic layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-purple-800 dark:from-purple-700 dark:to-pink-800 rounded-3xl transform translate-x-3 translate-y-3 opacity-40 blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-700 dark:from-purple-600 dark:to-pink-700 rounded-3xl transform translate-x-1.5 translate-y-1.5 opacity-60"></div>
                        
                        {/* Main face */}
                        <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 dark:from-purple-600 dark:via-pink-600 dark:to-orange-600 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20">
                          {/* Neon Top stripe */}
                          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-neon-flow"></div>
                          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 blur-md opacity-50"></div>
                          
                          {/* Holographic Windows */}
                          <div className="absolute top-14 left-10 right-10 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-2xl backdrop-blur-md border-2 border-cyan-300/40 shadow-lg shadow-cyan-500/50">
                            <div className="grid grid-cols-5 gap-2 p-2 h-full">
                              <div className="bg-gradient-to-br from-cyan-300/70 to-blue-400/70 rounded-lg animate-window-glow border border-cyan-200/50"></div>
                              <div className="bg-gradient-to-br from-cyan-300/70 to-blue-400/70 rounded-lg animate-window-glow animation-delay-200 border border-cyan-200/50"></div>
                              <div className="bg-gradient-to-br from-cyan-300/70 to-blue-400/70 rounded-lg animate-window-glow animation-delay-400 border border-cyan-200/50"></div>
                              <div className="bg-gradient-to-br from-cyan-300/70 to-blue-400/70 rounded-lg animate-window-glow animation-delay-600 border border-cyan-200/50"></div>
                              <div className="bg-gradient-to-br from-cyan-300/70 to-blue-400/70 rounded-lg animate-window-glow animation-delay-800 border border-cyan-200/50"></div>
                            </div>
                          </div>
                          
                          {/* Futuristic Door */}
                          <div className="absolute bottom-14 left-10 w-14 h-28 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-2 border-cyan-400/50 shadow-inner"></div>
                          
                          {/* Bus Icon Center with Glow */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <Bus className="text-white drop-shadow-2xl" size={170} strokeWidth={1.8} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Bus className="text-cyan-300/30 blur-xl" size={170} strokeWidth={1.8} />
                              </div>
                            </div>
                          </div>
                          
                          {/* Powerful Headlights */}
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 space-y-4">
                            <div className="relative">
                              <div className="w-10 h-10 bg-yellow-300 rounded-full shadow-2xl shadow-yellow-500 animate-headlight-strong"></div>
                              <div className="absolute inset-0 w-10 h-10 bg-yellow-300 rounded-full blur-lg animate-headlight-strong"></div>
                            </div>
                            <div className="relative">
                              <div className="w-10 h-10 bg-yellow-300 rounded-full shadow-2xl shadow-yellow-500 animate-headlight-strong animation-delay-500"></div>
                              <div className="absolute inset-0 w-10 h-10 bg-yellow-300 rounded-full blur-lg animate-headlight-strong animation-delay-500"></div>
                            </div>
                          </div>
                          
                          {/* Neon Side Lines */}
                          <div className="absolute bottom-20 left-16 right-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-neon-pulse"></div>
                          <div className="absolute bottom-24 left-16 right-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-neon-pulse animation-delay-500"></div>
                        </div>
                      </div>
                      
                      {/* Wheels - 3D Style */}
                      <div className="absolute -bottom-8 left-16">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-xl animate-wheel-spin"></div>
                          <div className="absolute inset-2 border-4 border-gray-600 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                          </div>
                          {/* Wheel spokes */}
                          <div className="absolute inset-0 flex items-center justify-center animate-wheel-spin">
                            <div className="w-1 h-16 bg-gray-600"></div>
                            <div className="w-16 h-1 bg-gray-600 absolute"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-8 right-16">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-xl animate-wheel-spin"></div>
                          <div className="absolute inset-2 border-4 border-gray-600 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                          </div>
                          {/* Wheel spokes */}
                          <div className="absolute inset-0 flex items-center justify-center animate-wheel-spin">
                            <div className="w-1 h-16 bg-gray-600"></div>
                            <div className="w-16 h-1 bg-gray-600 absolute"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Icons with Glow - Visible on all devices */}
              <div className="absolute top-5 left-5 sm:top-10 sm:left-10 animate-float-icon">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-50"></div>
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center border-2 border-green-300/50">
                    <MapPin className="text-white" size={20} />
                  </div>
                </div>
              </div>
              <div className="absolute top-5 right-5 sm:top-20 sm:right-10 animate-float-icon animation-delay-1000">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-50"></div>
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center border-2 border-blue-300/50">
                    <Clock className="text-white" size={20} />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-16 right-5 sm:bottom-20 sm:right-20 animate-float-icon animation-delay-2000">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-50"></div>
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center border-2 border-orange-300/50">
                    <Shield className="text-white" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(100px, -100px) scale(1.5); opacity: 0; }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-80px, 80px) scale(1.3); opacity: 0; }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(60px, 100px) scale(1.4); opacity: 0; }
        }
        @keyframes particle-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-100px, -60px) scale(1.2); opacity: 0; }
        }
        @keyframes energy-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.7; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes speed-lines {
          0% { opacity: 0; transform: translateX(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50px); }
        }
        @keyframes neon-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes window-glow {
          0%, 100% { opacity: 0.7; box-shadow: 0 0 10px rgba(103, 232, 249, 0.5); }
          50% { opacity: 1; box-shadow: 0 0 20px rgba(103, 232, 249, 0.8); }
        }
        @keyframes headlight-strong {
          0%, 100% { opacity: 0.9; box-shadow: 0 0 30px rgba(253, 224, 71, 0.8), 0 0 60px rgba(253, 224, 71, 0.4); }
          50% { opacity: 1; box-shadow: 0 0 50px rgba(253, 224, 71, 1), 0 0 100px rgba(253, 224, 71, 0.6); }
        }
        @keyframes neon-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; box-shadow: 0 0 10px currentColor; }
        }
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shadow-pulse {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes window-shine {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes headlight {
          0%, 100% { opacity: 0.8; box-shadow: 0 0 20px rgba(253, 224, 71, 0.5); }
          50% { opacity: 1; box-shadow: 0 0 40px rgba(253, 224, 71, 0.8); }
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes building-1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes building-2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes building-3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-orbit {
          animation: orbit 20s linear infinite;
        }
        .animate-spin-very-slow {
          animation: spin-very-slow 30s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }
        .animate-particle-1 {
          animation: particle-1 3s ease-in-out infinite;
        }
        .animate-particle-2 {
          animation: particle-2 4s ease-in-out infinite;
        }
        .animate-particle-3 {
          animation: particle-3 3.5s ease-in-out infinite;
        }
        .animate-particle-4 {
          animation: particle-4 4.5s ease-in-out infinite;
        }
        .animate-energy-pulse {
          animation: energy-pulse 4s ease-in-out infinite;
        }
        .animate-speed-lines {
          animation: speed-lines 1.5s ease-out infinite;
        }
        .animate-neon-flow {
          animation: neon-flow 3s ease infinite;
          background-size: 200% 200%;
        }
        .animate-window-glow {
          animation: window-glow 2s ease-in-out infinite;
        }
        .animate-headlight-strong {
          animation: headlight-strong 1.5s ease-in-out infinite;
        }
        .animate-neon-pulse {
          animation: neon-pulse 2s ease-in-out infinite;
        }
        .animate-wheel-spin {
          animation: wheel-spin 1s linear infinite;
        }
        .animate-shadow-pulse {
          animation: shadow-pulse 3s ease-in-out infinite;
        }
        .animate-float-icon {
          animation: float-icon 4s ease-in-out infinite;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Landing;

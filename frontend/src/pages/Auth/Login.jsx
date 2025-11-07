import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, Moon, Sun } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      navigate(`/${user.role}`);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-dark-950 dark:via-purple-950 dark:to-dark-900 px-4 relative overflow-hidden transition-colors duration-500">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 bg-white/10 dark:bg-dark-800/50 hover:bg-white/20 dark:hover:bg-dark-700/70 backdrop-blur-md rounded-xl transition-all duration-300 shadow-lg border border-white/20 dark:border-purple-500/30"
      >
        {isDark ? (
          <Sun size={24} className="text-yellow-400" />
        ) : (
          <Moon size={24} className="text-white" />
        )}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        
        {/* Person Waiting for Bus - Left Side - MUCH LARGER */}
        <div className="absolute top-1/4 left-[15%] opacity-45 hidden md:block">
          <svg className="w-32 h-32 md:w-44 md:h-44 lg:w-[220px] lg:h-[220px]" viewBox="0 0 100 150" fill="none">
            {/* Person */}
            <circle cx="50" cy="25" r="15" fill="#FFF" stroke="#E5E7EB" strokeWidth="2.5"/>
            {/* Face details */}
            <circle cx="45" cy="23" r="2" fill="#1F2937"/>
            <circle cx="55" cy="23" r="2" fill="#1F2937"/>
            <path d="M 45 30 Q 50 33 55 30" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
            {/* Body */}
            <rect x="38" y="40" width="24" height="45" rx="5" fill="#60A5FA" stroke="#3B82F6" strokeWidth="2"/>
            {/* Arm raised - waving with animation */}
            <g className="animate-wave" style={{transformOrigin: '58px 48px'}}>
              <path d="M 58 48 L 82 28" stroke="#60A5FA" strokeWidth="9" strokeLinecap="round"/>
              <circle cx="82" cy="28" r="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
              {/* Fingers */}
              <line x1="82" y1="28" x2="84" y2="22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              <line x1="82" y1="28" x2="87" y2="25" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
            </g>
            {/* Other arm */}
            <path d="M 38 48 L 22 62" stroke="#60A5FA" strokeWidth="9" strokeLinecap="round"/>
            <circle cx="22" cy="62" r="5" fill="#FCD34D"/>
            {/* Legs */}
            <path d="M 46 85 L 42 115" stroke="#1E3A8A" strokeWidth="10" strokeLinecap="round"/>
            <path d="M 54 85 L 58 115" stroke="#1E3A8A" strokeWidth="10" strokeLinecap="round"/>
            {/* Shoes */}
            <ellipse cx="42" cy="115" rx="6" ry="3" fill="#1F2937"/>
            <ellipse cx="58" cy="115" rx="6" ry="3" fill="#1F2937"/>
            {/* Bag */}
            <rect x="18" y="62" width="12" height="16" rx="3" fill="#F97316" stroke="#C2410C" strokeWidth="1.5"/>
            <path d="M 22 62 L 22 59 L 26 59 L 26 62" stroke="#C2410C" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        {/* Person Waiting - Right Side - MUCH LARGER */}
        <div className="absolute bottom-1/3 right-[20%] opacity-40 hidden md:block">
          <svg className="w-36 h-36 md:w-48 md:h-48 lg:w-[244px] lg:h-[244px]" viewBox="0 0 100 150" fill="none">
            {/* Person */}
            <circle cx="50" cy="25" r="15" fill="#FFF" stroke="#E5E7EB" strokeWidth="2.5"/>
            {/* Face */}
            <circle cx="45" cy="23" r="2" fill="#1F2937"/>
            <circle cx="55" cy="23" r="2" fill="#1F2937"/>
            <path d="M 44 30 Q 50 34 56 30" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
            {/* Body */}
            <rect x="38" y="40" width="24" height="45" rx="5" fill="#EC4899" stroke="#DB2777" strokeWidth="2"/>
            {/* Arm raised - signaling with animation */}
            <g className="animate-wave" style={{transformOrigin: '38px 48px'}}>
              <path d="M 38 48 L 18 20" stroke="#EC4899" strokeWidth="9" strokeLinecap="round"/>
              <circle cx="18" cy="20" r="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
              {/* Fingers waving */}
              <line x1="18" y1="20" x2="16" y2="14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="20" x2="13" y2="17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
            </g>
            {/* Other arm holding phone */}
            <path d="M 62 48 L 76 55" stroke="#EC4899" strokeWidth="9" strokeLinecap="round"/>
            <rect x="74" y="52" width="10" height="16" rx="2" fill="#1F2937" stroke="#60A5FA" strokeWidth="2"/>
            <rect x="75" y="54" width="8" height="11" rx="1" fill="#3B82F6" opacity="0.6"/>
            <circle cx="79" cy="63" r="1" fill="#60A5FA"/>
            {/* Legs */}
            <path d="M 46 85 L 42 115" stroke="#7C3AED" strokeWidth="10" strokeLinecap="round"/>
            <path d="M 54 85 L 58 115" stroke="#7C3AED" strokeWidth="10" strokeLinecap="round"/>
            {/* Shoes */}
            <ellipse cx="42" cy="115" rx="6" ry="3" fill="#1F2937"/>
            <ellipse cx="58" cy="115" rx="6" ry="3" fill="#1F2937"/>
          </svg>
        </div>
        
        {/* Realistic 3D Animated Bus - MUCH LARGER */}
        <div className="absolute top-1/4 left-0 w-full animate-bus">
          <svg className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-[320px] lg:h-[320px]" viewBox="0 0 200 120" fill="none">
            {/* Bus Shadow */}
            <ellipse cx="100" cy="110" rx="80" ry="10" fill="black" opacity="0.25"/>
            
            {/* Bus Body - Main */}
            <path d="M30 40 L30 85 Q30 90 35 90 L165 90 Q170 90 170 85 L170 40 Q170 35 165 35 L35 35 Q30 35 30 40Z" 
                  fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
            
            {/* Bus Top/Roof */}
            <path d="M40 35 L40 25 Q40 20 45 20 L155 20 Q160 20 160 25 L160 35" 
                  fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5"/>
            
            {/* Front Window (Windshield) */}
            <path d="M145 25 L145 40 L165 45 L165 30 Z" 
                  fill="#1E3A8A" opacity="0.6" stroke="#1E40AF" strokeWidth="1"/>
            
            {/* Side Windows */}
            <rect x="45" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.5" stroke="#1E40AF" strokeWidth="1"/>
            <rect x="75" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.5" stroke="#1E40AF" strokeWidth="1"/>
            <rect x="105" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.5" stroke="#1E40AF" strokeWidth="1"/>
            
            {/* Side Stripe */}
            <rect x="35" y="65" width="130" height="8" rx="1" fill="#1F2937" opacity="0.7"/>
            
            {/* Front Bumper */}
            <rect x="160" y="75" width="10" height="10" rx="1" fill="#374151"/>
            
            {/* Headlight */}
            <circle cx="165" cy="78" r="3" fill="#FCD34D" opacity="0.9"/>
            
            {/* Front Wheels */}
            <g>
              {/* Front Wheel */}
              <circle cx="145" cy="90" r="12" fill="#1F2937" stroke="#111827" strokeWidth="2"/>
              <circle cx="145" cy="90" r="6" fill="#4B5563" stroke="#374151" strokeWidth="1"/>
              
              {/* Back Wheel */}
              <circle cx="55" cy="90" r="12" fill="#1F2937" stroke="#111827" strokeWidth="2"/>
              <circle cx="55" cy="90" r="6" fill="#4B5563" stroke="#374151" strokeWidth="1"/>
            </g>
            
            {/* Door */}
            <rect x="150" y="60" width="15" height="25" rx="1" fill="#7F1D1D" stroke="#991B1B" strokeWidth="1"/>
            <line x1="157" y1="65" x2="157" y2="82" stroke="#991B1B" strokeWidth="1"/>
            
            {/* Side Mirror */}
            <rect x="165" y="48" width="8" height="3" rx="1" fill="#374151"/>
          </svg>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10 px-4 sm:px-0">
        {/* Logo & Title */}
        <div className="text-center mb-6 md:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-dark-800 rounded-3xl shadow-glow-lg dark:shadow-dark-glow mb-3 md:mb-4">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-primary-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">CitiConnect</h1>
          <p className="text-primary-100 dark:text-purple-300 text-base md:text-lg font-medium">Live Bus Tracking System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-dark-glow p-6 sm:p-8 border border-white/20 dark:border-purple-500/30 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="label dark:text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-12 dark:bg-dark-800 dark:border-dark-600 dark:text-white dark:placeholder-gray-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-12 dark:bg-dark-800 dark:border-dark-600 dark:text-white dark:placeholder-gray-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary dark:bg-gradient-to-r dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-500 dark:hover:to-purple-600 flex items-center justify-center gap-2 py-3.5 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-dark-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-dark-900 text-gray-500 dark:text-gray-400 font-medium">New to CitiConnect?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link 
            to="/register" 
            className="w-full btn btn-outline dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-500/10 flex items-center justify-center gap-2 py-3"
          >
            <UserPlus size={20} />
            <span>Create an Account</span>
          </Link>

          {/* Getting Started Info */}
          <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl border border-primary-100 dark:border-purple-800/50">
            <p className="text-xs font-bold text-primary-900 dark:text-purple-300 mb-2 flex items-center gap-2">
              <span className="text-lg">🚀</span> Getting Started
            </p>
            <div className="text-xs text-primary-700 dark:text-purple-400 space-y-1.5 ml-6">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-purple-500 rounded-full"></span>
                Register a new account
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                Select your role (User/Driver/Admin)
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                Login and start tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

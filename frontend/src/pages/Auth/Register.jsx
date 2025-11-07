import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus, Shield, LogIn, Moon, Sun } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
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

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const user = await register(registrationData);
      navigate(`/${user.role}`);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-600 via-primary-700 to-primary-600 dark:from-dark-950 dark:via-purple-950 dark:to-dark-900 px-4 py-12 relative overflow-hidden transition-colors duration-500">
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

      {/* Animated background elements - LARGER */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-secondary-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-primary-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-accent-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        {/* Multiple People Waiting for Bus - ALL MUCH LARGER */}
        {/* Person 1 - Waving */}
        <div className="absolute top-[30%] left-[12%] opacity-45 animate-bounce-slow hidden lg:block">
          <svg className="w-32 h-32 lg:w-48 lg:h-48" viewBox="0 0 100 150" fill="none">
            <circle cx="50" cy="25" r="16" fill="#FFF" stroke="#E5E7EB" strokeWidth="3"/>
            {/* Face details */}
            <circle cx="45" cy="22" r="2.5" fill="#1F2937"/>
            <circle cx="55" cy="22" r="2.5" fill="#1F2937"/>
            <path d="M 44 30 Q 50 34 56 30" stroke="#1F2937" strokeWidth="2" fill="none"/>
            {/* Hair */}
            <path d="M 36 20 Q 40 12 50 10 Q 60 12 64 20" stroke="#1F2937" strokeWidth="3" fill="none"/>
            {/* Body */}
            <rect x="37" y="41" width="26" height="48" rx="5" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2.5"/>
            {/* Arm raised high - waving with animation */}
            <g className="animate-wave" style={{transformOrigin: '63px 50px'}}>
              <path d="M 63 50 L 88 22" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round"/>
              <circle cx="88" cy="22" r="7" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
              {/* Animated fingers */}
              <line x1="88" y1="22" x2="91" y2="15" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="88" y1="22" x2="94" y2="19" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="88" y1="22" x2="93" y2="25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
            {/* Other arm */}
            <path d="M 37 50 L 20 65" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round"/>
            <circle cx="20" cy="65" r="6" fill="#FCD34D"/>
            {/* Legs */}
            <path d="M 45 89 L 40 120" stroke="#1E3A8A" strokeWidth="11" strokeLinecap="round"/>
            <path d="M 55 89 L 60 120" stroke="#1E3A8A" strokeWidth="11" strokeLinecap="round"/>
            {/* Shoes */}
            <ellipse cx="40" cy="120" rx="7" ry="4" fill="#1F2937"/>
            <ellipse cx="60" cy="120" rx="7" ry="4" fill="#1F2937"/>
            {/* Bag */}
            <rect x="16" y="65" width="14" height="18" rx="3" fill="#EF4444" stroke="#B91C1C" strokeWidth="2"/>
            <path d="M 20 65 L 20 61 L 26 61 L 26 65" stroke="#B91C1C" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Person 2 - Signaling with Phone */}
        <div className="absolute bottom-[35%] right-[18%] opacity-42 hidden lg:block">
          <svg className="w-36 h-36 lg:w-44 lg:h-44" viewBox="0 0 100 150" fill="none">
            <circle cx="50" cy="25" r="16" fill="#FFF" stroke="#E5E7EB" strokeWidth="3"/>
            {/* Face */}
            <circle cx="45" cy="22" r="2.5" fill="#1F2937"/>
            <circle cx="55" cy="22" r="2.5" fill="#1F2937"/>
            <path d="M 45 31 Q 50 35 55 31" stroke="#1F2937" strokeWidth="2" fill="none"/>
            {/* Hair - ponytail */}
            <circle cx="50" cy="17" r="9" fill="#1F2937" opacity="0.3"/>
            {/* Body */}
            <rect x="37" y="41" width="26" height="48" rx="5" fill="#EC4899" stroke="#DB2777" strokeWidth="2.5"/>
            {/* Arm raised - signaling with animation */}
            <g className="animate-wave" style={{transformOrigin: '37px 50px'}}>
              <path d="M 37 50 L 12 18" stroke="#EC4899" strokeWidth="10" strokeLinecap="round"/>
              <circle cx="12" cy="18" r="7" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
              {/* Fingers */}
              <line x1="12" y1="18" x2="9" y2="11" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="12" y1="18" x2="6" y2="15" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
            {/* Phone in hand */}
            <path d="M 63 50 L 80 58" stroke="#EC4899" strokeWidth="10" strokeLinecap="round"/>
            <rect x="77" y="54" width="12" height="18" rx="3" fill="#1F2937" stroke="#60A5FA" strokeWidth="2"/>
            <rect x="78" y="56" width="10" height="13" rx="2" fill="#3B82F6" opacity="0.6"/>
            <circle cx="83" cy="66" r="2" fill="#60A5FA"/>
            <rect x="79" y="58" width="8" height="1" fill="#4B5563"/>
            {/* Legs */}
            <path d="M 45 89 L 40 120" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round"/>
            <path d="M 55 89 L 60 120" stroke="#7C3AED" strokeWidth="11" strokeLinecap="round"/>
            {/* Shoes */}
            <ellipse cx="40" cy="120" rx="7" ry="4" fill="#1F2937"/>
            <ellipse cx="60" cy="120" rx="7" ry="4" fill="#1F2937"/>
          </svg>
        </div>

        {/* Person 3 - With Backpack */}
        <div className="absolute top-[45%] left-[8%] opacity-38 hidden md:block">
          <svg className="w-32 h-32 md:w-40 md:h-40" viewBox="0 0 100 150" fill="none">
            <circle cx="50" cy="25" r="15" fill="#FFF" stroke="#E5E7EB" strokeWidth="3"/>
            {/* Face */}
            <circle cx="44" cy="23" r="2" fill="#1F2937"/>
            <circle cx="56" cy="23" r="2" fill="#1F2937"/>
            <path d="M 45 30 Q 50 33 55 30" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
            {/* Cap */}
            <ellipse cx="50" cy="14" rx="14" ry="5" fill="#F97316"/>
            <rect x="36" y="11" width="28" height="6" rx="3" fill="#EA580C"/>
            {/* Body */}
            <rect x="38" y="40" width="24" height="45" rx="5" fill="#10B981" stroke="#059669" strokeWidth="2"/>
            {/* Raised arm with wave animation */}
            <g className="animate-wave" style={{transformOrigin: '62px 48px'}}>
              <path d="M 62 48 L 82 25" stroke="#10B981" strokeWidth="9" strokeLinecap="round"/>
              <circle cx="82" cy="25" r="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
              {/* Fingers */}
              <line x1="82" y1="25" x2="85" y2="19" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              <line x1="82" y1="25" x2="88" y2="23" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
            </g>
            <path d="M 38 48 L 26 58" stroke="#10B981" strokeWidth="9" strokeLinecap="round"/>
            {/* Backpack */}
            <ellipse cx="50" cy="52" rx="11" ry="16" fill="#F97316" stroke="#C2410C" strokeWidth="2"/>
            <rect x="45" y="45" width="10" height="6" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
            <circle cx="47" cy="52" r="2" fill="#FEF3C7"/>
            <circle cx="53" cy="52" r="2" fill="#FEF3C7"/>
            {/* Straps */}
            <path d="M 44 45 Q 42 50 42 55" stroke="#C2410C" strokeWidth="2" fill="none"/>
            <path d="M 56 45 Q 58 50 58 55" stroke="#C2410C" strokeWidth="2" fill="none"/>
            {/* Legs */}
            <path d="M 46 85 L 42 115" stroke="#065F46" strokeWidth="10" strokeLinecap="round"/>
            <path d="M 54 85 L 58 115" stroke="#065F46" strokeWidth="10" strokeLinecap="round"/>
            {/* Shoes */}
            <ellipse cx="42" cy="115" rx="6" ry="3" fill="#1F2937"/>
            <ellipse cx="58" cy="115" rx="6" ry="3" fill="#1F2937"/>
          </svg>
        </div>
        
        {/* Realistic 3D Animated Bus - EXTRA LARGE */}
        <div className="absolute bottom-1/3 left-0 w-full animate-bus">
          <svg className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72" viewBox="0 0 200 120" fill="none">
            {/* Bus Shadow */}
            <ellipse cx="100" cy="110" rx="85" ry="12" fill="black" opacity="0.3"/>
            
            {/* Bus Body - Main */}
            <path d="M30 40 L30 85 Q30 90 35 90 L165 90 Q170 90 170 85 L170 40 Q170 35 165 35 L35 35 Q30 35 30 40Z" 
                  fill="#EF4444" stroke="#B91C1C" strokeWidth="2"/>
            
            {/* Bus Top/Roof */}
            <path d="M40 35 L40 25 Q40 20 45 20 L155 20 Q160 20 160 25 L160 35" 
                  fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
            
            {/* Roof Highlight */}
            <path d="M45 22 L150 22" stroke="#FCA5A5" strokeWidth="1" opacity="0.4"/>
            
            {/* Front Window (Windshield) */}
            <path d="M145 25 L145 40 L165 45 L165 30 Z" 
                  fill="#1E3A8A" opacity="0.7" stroke="#1E40AF" strokeWidth="1.5"/>
            
            {/* Window Reflection */}
            <path d="M148 28 L148 38 L158 40 L158 32 Z" 
                  fill="#60A5FA" opacity="0.3"/>
            
            {/* Side Windows */}
            <rect x="45" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.6" stroke="#1E40AF" strokeWidth="1.5"/>
            <rect x="75" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.6" stroke="#1E40AF" strokeWidth="1.5"/>
            <rect x="105" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.6" stroke="#1E40AF" strokeWidth="1.5"/>
            
            {/* Window Reflections */}
            <rect x="48" y="44" width="10" height="8" rx="1" fill="#93C5FD" opacity="0.3"/>
            <rect x="78" y="44" width="10" height="8" rx="1" fill="#93C5FD" opacity="0.3"/>
            <rect x="108" y="44" width="10" height="8" rx="1" fill="#93C5FD" opacity="0.3"/>
            
            {/* Side Stripe */}
            <rect x="35" y="65" width="130" height="10" rx="2" fill="#1F2937" opacity="0.8"/>
            <rect x="35" y="67" width="130" height="3" rx="1" fill="#374151" opacity="0.6"/>
            
            {/* Front Bumper */}
            <rect x="160" y="75" width="12" height="12" rx="2" fill="#374151" stroke="#1F2937" strokeWidth="1"/>
            
            {/* Headlight */}
            <circle cx="166" cy="80" r="3.5" fill="#FCD34D" opacity="1" stroke="#F59E0B" strokeWidth="1"/>
            <circle cx="166" cy="80" r="2" fill="#FEF3C7" opacity="0.8"/>
            
            {/* Front Wheels with Detail */}
            <g>
              {/* Front Wheel */}
              <circle cx="145" cy="90" r="13" fill="#1F2937" stroke="#111827" strokeWidth="2.5"/>
              <circle cx="145" cy="90" r="8" fill="#374151"/>
              <circle cx="145" cy="90" r="4" fill="#6B7280"/>
              
              {/* Back Wheel */}
              <circle cx="55" cy="90" r="13" fill="#1F2937" stroke="#111827" strokeWidth="2.5"/>
              <circle cx="55" cy="90" r="8" fill="#374151"/>
              <circle cx="55" cy="90" r="4" fill="#6B7280"/>
            </g>
            
            {/* Door */}
            <rect x="148" y="60" width="17" height="27" rx="2" fill="#991B1B" stroke="#7F1D1D" strokeWidth="1.5"/>
            <line x1="156" y1="65" x2="156" y2="84" stroke="#7F1D1D" strokeWidth="1.5"/>
            <circle cx="152" cy="74" r="1.5" fill="#D1D5DB"/>
            
            {/* Side Mirror */}
            <rect x="165" y="48" width="9" height="4" rx="1" fill="#374151" stroke="#1F2937" strokeWidth="1"/>
            
            {/* Body Highlights */}
            <path d="M35 42 L160 42" stroke="#FCA5A5" strokeWidth="1.5" opacity="0.3"/>
            <path d="M35 88 Q100 87 165 88" stroke="#7F1D1D" strokeWidth="1" opacity="0.4"/>
          </svg>
        </div>
        
        {/* Second realistic bus with delay - LARGER */}
        <div className="absolute top-1/4 left-0 w-full animate-bus hidden sm:block" style={{animationDelay: '8s'}}>
          <svg className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56" viewBox="0 0 200 120" fill="none">
            {/* Bus Shadow */}
            <ellipse cx="100" cy="110" rx="75" ry="10" fill="black" opacity="0.25"/>
            
            {/* Bus Body - Orange/Yellow variant */}
            <path d="M30 40 L30 85 Q30 90 35 90 L165 90 Q170 90 170 85 L170 40 Q170 35 165 35 L35 35 Q30 35 30 40Z" 
                  fill="#F97316" stroke="#C2410C" strokeWidth="2"/>
            
            {/* Bus Top/Roof */}
            <path d="M40 35 L40 25 Q40 20 45 20 L155 20 Q160 20 160 25 L160 35" 
                  fill="#EA580C" stroke="#9A3412" strokeWidth="1.5"/>
            
            {/* Front Window */}
            <path d="M145 25 L145 40 L165 45 L165 30 Z" 
                  fill="#1E3A8A" opacity="0.6" stroke="#1E40AF" strokeWidth="1"/>
            
            {/* Side Windows */}
            <rect x="45" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.5" stroke="#1E40AF" strokeWidth="1"/>
            <rect x="75" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.5" stroke="#1E40AF" strokeWidth="1"/>
            <rect x="105" y="42" width="25" height="18" rx="2" fill="#1E3A8A" opacity="0.5" stroke="#1E40AF" strokeWidth="1"/>
            
            {/* Side Stripe */}
            <rect x="35" y="65" width="130" height="8" rx="1" fill="#1F2937" opacity="0.7"/>
            
            {/* Headlight */}
            <circle cx="165" cy="78" r="3" fill="#FCD34D" opacity="0.9"/>
            
            {/* Wheels */}
            <circle cx="145" cy="90" r="12" fill="#1F2937" stroke="#111827" strokeWidth="2"/>
            <circle cx="145" cy="90" r="6" fill="#4B5563"/>
            <circle cx="55" cy="90" r="12" fill="#1F2937" stroke="#111827" strokeWidth="2"/>
            <circle cx="55" cy="90" r="6" fill="#4B5563"/>
            
            {/* Door */}
            <rect x="150" y="60" width="15" height="25" rx="1" fill="#9A3412" stroke="#C2410C" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10 px-4 sm:px-0">
        {/* Logo & Title */}
        <div className="text-center mb-6 md:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl shadow-glow-lg mb-3 md:mb-4">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">CitiConnect</h1>
          <p className="text-primary-100 dark:text-purple-300 text-base md:text-lg font-medium">Join the journey today</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-dark-glow p-6 sm:p-8 border border-white/20 dark:border-purple-500/30 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 text-center">
            Create Account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Get started in seconds</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label dark:text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-12 dark:bg-dark-800 dark:border-dark-600 dark:text-white dark:placeholder-gray-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

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

            {/* Phone */}
            <div>
              <label className="label dark:text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input pl-12 dark:bg-dark-800 dark:border-dark-600 dark:text-white dark:placeholder-gray-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="label dark:text-gray-300">Register As</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input pl-12 appearance-none cursor-pointer dark:bg-dark-800 dark:border-dark-600 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                  required
                >
                  <option value="user">User (Passenger)</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.role === 'user' && '🚌 Track buses and view routes'}
                {formData.role === 'driver' && '🚗 Share location and manage trips'}
                {formData.role === 'admin' && '⚙️ Manage buses, routes, and drivers'}
              </p>
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
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pl-12 dark:bg-dark-800 dark:border-dark-600 dark:text-white dark:placeholder-gray-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary dark:bg-gradient-to-r dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-500 dark:hover:to-purple-600 flex items-center justify-center gap-2 py-3.5 text-lg font-semibold mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={22} />
                  <span>Create Account</span>
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
              <span className="px-4 bg-white dark:bg-dark-900 text-gray-500 dark:text-gray-400 font-medium">Already registered?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            to="/login" 
            className="w-full btn btn-outline dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-500/10 flex items-center justify-center gap-2 py-3"
          >
            <LogIn size={20} />
            <span>Sign In Instead</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

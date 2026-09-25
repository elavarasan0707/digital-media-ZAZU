import React, { useState, useEffect } from 'react';
import { ZazuLogo } from './ZazuLogo';
import { Menu, X, ArrowUpRight, Lock, LogIn, LogOut, LayoutDashboard, ShieldCheck, User } from 'lucide-react';
import { AgencyContactConfig } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  agencyConfig: AgencyContactConfig;
  onOpenBooking: () => void;
  onOpenQuote: () => void;
  onOpenDashboard: (tab?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agencyConfig,
  onOpenBooking,
  onOpenQuote,
  onOpenDashboard
}) => {
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Why ZAZU', href: '#why-us' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/95 backdrop-blur-md border-b border-[#222222] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
          : 'bg-transparent border-b border-white/5 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Wordmark & Emblem */}
          <div className="shrink-0">
            <ZazuLogo variant="official" size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-xs font-medium tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#A0A0A0] hover:text-[#F5C542] transition-colors duration-200 relative group py-1 font-sans"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F5C542] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions: Dashboard (Only when logged in/admin), Auth, Call CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            
            {/* Dashboard Button - Only visible for authenticated users / admin */}
            {user && (
              <button
                onClick={() => onOpenDashboard('home')}
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Dashboard</span>
              </button>
            )}

            {/* User Auth State */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenDashboard('home')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                    isAdmin
                      ? 'bg-[#F5C542]/10 border-[#F5C542]/40 text-[#FFD966]'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                  title={user.email || 'User'}
                >
                  {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-[#F5C542]" /> : <User className="w-3.5 h-3.5" />}
                  <span className="max-w-[110px] truncate">{isAdmin ? 'Admin' : user.displayName || 'User'}</span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-[#F5C542]/30 text-[#FFD966] hover:bg-[#F5C542]/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Book Consultation */}
            <button
              onClick={onOpenBooking}
              className="text-xs font-bold px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#F5C542] to-[#FFD966] text-[#080808] hover:shadow-[0_0_20px_rgba(245,197,66,0.4)] transition-all duration-200 flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Book Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <button
                onClick={() => onOpenDashboard('home')}
                className="p-2 rounded-lg bg-[#141414] border border-white/10 text-[#F5C542]"
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}
            
            {user ? (
              <button
                onClick={logout}
                className="p-2 rounded-lg text-[#A0A0A0] hover:text-white"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#F5C542]/30 text-[#FFD966]"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c0c] border-b border-[#222222] px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#D4D4D4] hover:text-[#F5C542] py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A0A0A0]" />
              </a>
            ))}

            {user && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDashboard('home'); }}
                className="text-sm font-bold text-[#F5C542] py-2 flex items-center justify-between text-left"
              >
                <span>Agency Dashboard</span>
                <LayoutDashboard className="w-4 h-4 text-[#F5C542]" />
              </button>
            )}
          </nav>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold border border-white/10 text-white bg-black/40"
            >
              Get Free Quote
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#F5C542] text-[#080808]"
            >
              Book Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

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

          {/* Actions: Dashboard (Strictly Admin Only), Auth, Call CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            
            {/* Dashboard Button - STRICTLY visible ONLY for Admin */}
            {isAdmin && (
              <button
                onClick={() => onOpenDashboard('home')}
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-[#F5C542]/40 text-[#FFD966] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F5C542]" />
                <span>Dashboard</span>
              </button>
            )}

            {/* User Auth State */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <button
                    onClick={() => onOpenDashboard('home')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-[#F5C542]/10 border-[#F5C542]/40 text-[#FFD966] cursor-pointer"
                    title={user.email || 'Admin'}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F5C542]" />
                    <span className="max-w-[110px] truncate">Admin</span>
                  </button>
                ) : (
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border bg-white/5 border-white/10 text-white"
                    title={user.email || 'User'}
                  >
                    <User className="w-3.5 h-3.5 text-[#F5C542]" />
                    <span className="max-w-[110px] truncate">{user.displayName || 'User'}</span>
                  </div>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-[#F5C542]/30 text-[#FFD966] hover:bg-[#F5C542]/10 transition-colors flex items-center gap-1.5 cursor-pointer"
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

          {/* Mobile & Tablet Menu Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            {isAdmin && (
              <button
                onClick={() => onOpenDashboard('home')}
                className="px-2.5 py-1.5 rounded-lg bg-[#141414] border border-[#F5C542]/40 text-[#F5C542] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            )}
            
            {user ? (
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#F5C542]/30 text-[#FFD966] cursor-pointer"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c0c]/98 backdrop-blur-xl border-b border-[#222222] px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1.5 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#D4D4D4] hover:text-[#F5C542] py-2.5 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A0A0A0]" />
              </a>
            ))}

            {isAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDashboard('home'); }}
                className="text-sm font-bold text-[#F5C542] py-2.5 border-b border-white/5 flex items-center justify-between text-left cursor-pointer"
              >
                <span>Admin Dashboard</span>
                <LayoutDashboard className="w-4 h-4 text-[#F5C542]" />
              </button>
            )}

            {user ? (
              <div className="pt-2 flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2 text-xs text-[#D4D4D4] truncate">
                  {isAdmin ? <ShieldCheck className="w-4 h-4 text-[#F5C542] shrink-0" /> : <User className="w-4 h-4 text-[#F5C542] shrink-0" />}
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                className="text-sm font-semibold text-[#FFD966] py-2.5 border-b border-white/5 flex items-center justify-between text-left cursor-pointer"
              >
                <span>Account Login</span>
                <LogIn className="w-4 h-4 text-[#F5C542]" />
              </button>
            )}
          </nav>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold border border-white/10 text-white bg-black/40 cursor-pointer"
            >
              Get Free Quote
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#F5C542] text-[#080808] cursor-pointer"
            >
              Book Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

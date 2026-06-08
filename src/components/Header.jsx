import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, FileText, Search, Phone, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: Shield },
    { name: 'تقديم طلب دمغ ومعايرة', path: '/new-request', icon: FileText },
    { name: 'الاستعلام عن الطلب', path: '/track', icon: Search },
    { name: 'اتصل بنا', path: '/contact', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gov-dark text-white border-b-4 border-gov-gold shadow-md relative z-50 select-none">
      {/* Top Bar - Official Text */}
      <div className="bg-black/20 text-xs py-1.5 px-4 text-center border-b border-white/5 font-light tracking-wide text-gray-300">
        الجمهورية العربية المصرية • وزارة التموين والتجارة الداخلية • مصلحة الدمغ والموازين
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Office Title */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            {/* Gov Crest Badge SVG */}
            <div className="bg-white/10 p-2 rounded-lg border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              <svg className="w-9 h-9 fill-gov-gold" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                <circle cx="50" cy="50" r="10" fill="currentColor"/>
                <path d="M30 50 A 20 20 0 0 1 70 50" fill="none" stroke="currentColor" strokeWidth="3"/>
                {/* Balance scale indicator */}
                <path d="M42 38 L58 38 M50 38 L50 48" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-lg leading-tight text-white group-hover:text-gov-gold transition-colors duration-200">
                مكتب تفتيش موازين العبور
              </span>
              <span className="text-xs text-gov-gold font-medium">
                بوابة الخدمات الإلكترونية الموحدة
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none ${
                    isActive(link.path)
                      ? 'bg-gov-primary text-gov-gold border-b-2 border-gov-gold shadow-inner'
                      : 'hover:bg-white/5 text-gray-200 hover:text-white'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Operations Actions */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all focus:outline-none ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-gov-gold text-gov-dark shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span>لوحة التحكم</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-700/80 hover:bg-red-700 text-white transition-all shadow-md focus:outline-none"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/5 border border-white/20 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-all focus:outline-none"
              >
                <span>الدخول للنظام المغلق</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle button */}
          <div className="md:hidden flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="p-2 bg-red-700/80 hover:bg-red-700 rounded-lg text-white transition-all"
                title="تسجيل خروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 focus:outline-none border border-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-gov-dark border-t border-white/10 px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-xl relative z-40">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-gov-primary text-gov-gold border-r-4 border-gov-gold'
                    : 'text-gray-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          {token ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium bg-gov-gold text-gov-dark transition-all mt-4"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>لوحة التحكم الإدارية</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-lg text-sm font-semibold text-gray-300 hover:text-white transition-all mt-4"
            >
              <span>تسجيل الدخول للموظفين</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

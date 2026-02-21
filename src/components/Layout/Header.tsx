import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe, LogIn, LogOut } from 'lucide-react';
import { STORAGE_KEYS } from '@/constants/apiConstants';
import { CartSheet } from '@/components/CartSheet';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.TOKEN);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate('/login');
    // window.location.reload(); // Optional: to ensure state is cleared if needed
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/explore', label: t('nav.explore') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Printy Glory
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-600'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
            </Button>

            <CartSheet />

            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="flex items-center space-x-1">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Login / Register</span>
                </Link>
              </Button>
            )}

            <Button asChild>
              <Link to="/product/phone-case">{t('common.startDesigning')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          {/* Mobile Menu Button and Cart */}
          <div className="md:hidden flex items-center space-x-2">
            <CartSheet />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.path
                    ? 'text-primary'
                    : 'text-gray-600'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language.toUpperCase()}</span>
                </Button>

                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                      <span>Login / Register</span>
                    </Link>
                  </Button>
                )}

                <Button asChild>
                  <Link to="/product/phone-case" onClick={() => setIsMenuOpen(false)}>
                    {t('common.startDesigning')}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
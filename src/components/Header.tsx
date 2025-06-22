
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flower, ShoppingCart, User, Menu, X, MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-pink-500 p-2 rounded-lg">
              <Flower className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PetalTalk</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-pink-500 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart Button */}
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="w-5 h-5" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Orders Button */}
                <Link to="/orders">
                  <Button variant="ghost" size="sm">
                    <Package className="w-5 h-5" />
                  </Button>
                </Link>

                {/* Chat Button */}
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-5 h-5" />
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5" />
                  </Button>
                </div>

                {/* Sign Out */}
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

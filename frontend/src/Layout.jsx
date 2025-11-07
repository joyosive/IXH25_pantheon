import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Home", url: createPageUrl("Home"), icon: Home },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <style>{`
        :root {
          --primary: 270 70% 60%;
          --secondary: 280 60% 50%;
          --accent: 200 80% 55%;
          --background: 240 10% 5%;
          --foreground: 0 0% 98%;
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
        }
        
        .glow-border {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1);
        }
        
        .nav-blur {
          backdrop-filter: blur(12px);
          background: rgba(15, 10, 30, 0.7);
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-blur border-b border-purple-500/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="relative">
                <Shield className="w-8 h-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                <div className="absolute inset-0 blur-md bg-purple-500 opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ZKProofPay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-300 glow-border'
                        : 'text-gray-300 hover:text-purple-300 hover:bg-purple-500/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden nav-blur border-t border-purple-500/20">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-gray-300 hover:bg-purple-500/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-20 nav-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold text-white">ZKProofPay</span>
              </div>
              <p className="text-gray-400 text-sm">
                Trustless conditional payments on XRPL using zero-knowledge proofs. 
                Verify without revealing.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link to={createPageUrl("Home")} className="block text-gray-400 hover:text-purple-300 text-sm">
                  Home
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Technology</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Built on XRPL EVM Sidechain</p>
                <p>Zero-Knowledge Proofs (circom)</p>
                <p>Smart Contract Escrow</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-500/20 text-center text-gray-500 text-sm">
            © 2025 ZKProofPay. Built for XRPL Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}
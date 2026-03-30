import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Programs", href: "/#programs" },
  { label: "Events", href: "/#events" },
  { label: "News", href: "/#news" },
  { label: "Contact", href: "/#contact" },
];

export default function PublicNavbar() {
  const handleLogin = () => base44.auth.redirectToLogin('/dashboard');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">K</span>
          </div>
          <span className="font-heading font-bold text-gray-900">KNPI Connect</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button onClick={handleLogin} size="sm" className="font-semibold flex-shrink-0">
          Member Portal
        </Button>
      </div>
    </header>
  );
}
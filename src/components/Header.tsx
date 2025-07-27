
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
            <div className="bg-white rounded-full p-3 flex items-center justify-center">
              <img
                src="/Logo.png"
                alt="Shine & Sparkle Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold">SHINE & SPARKLE</h1>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/formulations" className="hover:text-blue-200 transition-colors">Formulations</Link>
            <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-200 transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

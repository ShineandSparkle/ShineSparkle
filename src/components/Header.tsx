import { Link, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 hover:opacity-90 transition-opacity">
            <div className="bg-white rounded-full p-2 sm:p-3 flex items-center justify-center">
                <img
                  src="/Logo.png"
                  alt="Shine & Sparkle Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg sm:text-2xl font-bold">SHINE & SPARKLE</h1>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-2 lg:space-x-4">
            <Link
              to="/invoice"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Invoice System
            </Link>
            <Link
              to="/formulations"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Formulations
            </Link>
            <Link
              to="/prices"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Prices
            </Link>
            <Link
              to="/indent-sheet"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Indent Sheet
            </Link>
            <Link
              to="/stock-register"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Stock Register
            </Link>
          </nav>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;

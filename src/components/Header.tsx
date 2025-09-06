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
                  className="h-10 w-10 object-contain"
                />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold">SHINE & SPARKLE</h1>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link
              to="/invoice"
              className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              Invoice System
            </Link>
            <Link
              to="/formulations"
              className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              Formulations
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white rounded-full p-2 flex items-center justify-center">
                <img
                  src="/Logo.png"
                  alt="Shine & Sparkle Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">SHINE & SPARKLE</h3>
            </div>
            <p className="text-slate-300 mb-4 text-sm sm:text-base">
              Expert cleaning formulations. Clear. Precise. Complete.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm">
              FLAT NO - 202, RK RESIDENCY,<br />
              HARITHA ROYAL CITY COLONY,<br />
              RAVALKOLE, MEDCHAL - 501401
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-slate-300 text-sm sm:text-base">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/product-prices" className="hover:text-white transition-colors">Product Prices</Link></li>
              <li><Link to="/packing-materials" className="hover:text-white transition-colors">Packing Materials Cost</Link></li>
              <li><Link to="/chemical-prices" className="hover:text-white transition-colors">Chemical Prices</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Products</h4>
            <ul className="space-y-1 sm:space-y-2 text-slate-300 text-sm sm:text-base">
              <li><Link to="/formulation/phenyl" className="hover:text-white transition-colors">Phenyl</Link></li>
              <li><Link to="/formulation/dish-wash-liquid" className="hover:text-white transition-colors">Dish Wash Liquid</Link></li>
              <li><Link to="/formulation/brass-cleaning-liquid" className="hover:text-white transition-colors">Brass Cleaning Liquid</Link></li>
              <li><Link to="/formulation/toilet-cleaner" className="hover:text-white transition-colors">Toilet Cleaner</Link></li>
              <li><Link to="/formulation/acid" className="hover:text-white transition-colors">Acid</Link></li>
              <li><Link to="/formulation/hand-wash-liquid" className="hover:text-white transition-colors">Hand Wash Liquid</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Products</h4>
            <ul className="space-y-1 sm:space-y-2 text-slate-300 text-sm sm:text-base">
              <li><Link to="/formulation/detergent-powder" className="hover:text-white transition-colors">Detergent Powder</Link></li>
              <li><Link to="/formulation/liquid-detergent" className="hover:text-white transition-colors">Liquid Detergent</Link></li>
              <li><Link to="/formulation/floor-cleaning-liquid" className="hover:text-white transition-colors">Floor Cleaning Liquid</Link></li>
              <li><Link to="/formulation/rose-water" className="hover:text-white transition-colors">Rose Water</Link></li>
              <li><Link to="/formulation/pain-relief-balm" className="hover:text-white transition-colors">Pain Relief Balm</Link></li>
              <li><Link to="/formulation/white-petroleum-jelly" className="hover:text-white transition-colors">White Petroleum Jelly</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-slate-400 text-xs sm:text-sm">
            © 2025 Dexorzo Creation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

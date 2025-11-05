import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, FileText, Beaker, ClipboardList, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: "/invoice", label: "Invoice System", icon: FileText },
    { to: "/formulations", label: "Formulations", icon: Beaker },
    { to: "/indent-sheet", label: "Indent Sheet", icon: ClipboardList },
    { to: "/stock-register", label: "Stock Register", icon: Package },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center space-x-2 pb-4 border-b">
            <img
              src="/Logo.png"
              alt="Shine & Sparkle Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="font-bold text-lg text-slate-800">SHINE & SPARKLE</span>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <Icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                <span className="text-slate-700 font-medium group-hover:text-blue-700">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

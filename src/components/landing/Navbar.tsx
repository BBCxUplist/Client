import { navItems, contactItems } from "@/constants/navItems";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-4 ">
      <Link
        className="py-4 w-28 text-center text-white relative text-sm"
        to="/"
      >
        <p>UPLIST</p>
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500"></span>
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500"></span>
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500"></span>
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500"></span>
      </Link>
      <img src="/logo/logo.png" alt="menu" className=" h-12" />
      
      {/* Menu Button and Dropdown Container */}
      <div 
        className=""
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="py-4 w-28 text-center text-white relative text-sm">
          MENU
          <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500"></span>
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500"></span>
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500"></span>
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500"></span>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="absolute top-0 right-0 bg-orange-600 text-black rounded-sm w-[350px] z-50 p-1"
              initial={{ 
                opacity: 0, 
                width: 0, 
                height: 0,
              }}
              animate={{ 
                opacity: 1, 
                width: 350, 
                height: "auto",
              }}
              exit={{ 
                opacity: 0, 
                width: 0, 
                height: 0,
              }}
              transition={{ 
                duration: 0.4, 
                ease: "easeInOut",
                width: { duration: 0.4, ease: "easeInOut" },
                height: { duration: 0.4, ease: "easeInOut" }
              }}
            >
              <div className="relative p-4 overflow-hidden">
                <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-black"></span>
                <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-black"></span>
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-black"></span>
                <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-black"></span>
                <p className="text-xs text-thin text-center pb-4 border-b border-dashed border-black">
                  MENU
                </p>

                <div className="flex flex-col">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="py-1 border-b border-dashed border-black whitespace-nowrap relative overflow-hidden group"
                    >
                      <p className="text-3xl rounded-sm p-1 px-2 transition-colors duration-300 whitespace-nowrap relative z-10 group-hover:text-orange-600">
                        <span className="font-mondwest text-4xl mr-6">
                          0{index + 1}
                        </span>{" "}
                        {item.label}
                      </p>
                      <div className="absolute rounded-sm h-[calc(100%-8px)] top-1 inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out "></div>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-nowrap text-center font-thin text-sm divide-x divide-black divide-dashed mt-2">
                  {contactItems.map((item, index) => (
                    <div key={index} className="p-1 w-full ">
                      <p className="w-full p-2 rounded-sm hover:bg-black hover:text-orange-600">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;

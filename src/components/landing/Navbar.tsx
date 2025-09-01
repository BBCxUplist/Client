import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4">
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
      <button className="py-4 w-28 text-center text-white relative text-sm">
        MENU
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500"></span>
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500"></span>
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500"></span>
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500"></span>
      </button>
    </div>
  );
};

export default Navbar;

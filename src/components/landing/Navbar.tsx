import { navItems, contactItems } from '@/constants/navItems';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/stores/store';

interface NavItem {
  label: string;
  href: string;
  scroll?: boolean;
  id?: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, setAuthMode } = useStore();

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      // Navigate to home page using React Router
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  const handleAuthClick = (mode: 'signin' | 'register') => {
    setAuthMode(mode);
    setIsMenuOpen(false);
    navigate('/auth');
  };

  const handleNavClick = (item: NavItem) => {
    if (item.id) {
      setIsMenuOpen(false);

      if (window.location.pathname !== '/') {
        navigate('/');
        if (item.id) {
          sessionStorage.setItem('scrollToSection', item.id);
        }
        return;
      }

      setTimeout(() => {
        const element = item.id ? document.getElementById(item.id) : null;

        if (element) {
          // Get the element's position from the top of the page
          const elementTop = element.offsetTop;

          // Add fixed 100px offset
          const scrollPosition = elementTop - 100;

          // Smooth scroll to the element with offset
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          });
        } else {
          console.error('Element not found:', item.id);
        }
      }, 300);
    } else {
      // For non-scroll items, navigate normally
      navigate(item.href);
    }
  };

  return (
    <div className='flex justify-between items-center p-3 md:p-4 sticky top-0 z-50 bg-gradient-to-b from-black via-black/50 to-transparent'>
      <Link
        className='py-2 md:py-4 w-20 md:w-28 text-center text-white relative text-xs md:text-sm hover:text-orange-500 duration-300'
        to='/'
      >
        <p>UPLIST</p>
        <span className='absolute top-0 right-0 w-1.5 md:w-2 h-1.5 md:h-2 border-t border-r border-orange-500'></span>
        <span className='absolute top-0 left-0 w-1.5 md:w-2 h-1.5 md:h-2 border-t border-l border-orange-500'></span>
        <span className='absolute bottom-0 right-0 w-1.5 md:w-2 h-1.5 md:h-2 border-b border-r border-orange-500'></span>
        <span className='absolute bottom-0 left-0 w-1.5 md:w-2 h-1.5 md:h-2 border-b border-l border-orange-500'></span>
      </Link>
      <img
        src='/logo/logo.png'
        alt='logo'
        draggable={false}
        className='h-10 md:h-14'
      />

      {/* Menu Button and Dropdown Container */}
      <div
        className='relative'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className='py-2 md:py-4 w-20 md:w-28 text-center text-white relative text-xs md:text-sm'>
          MENU
          <span className='absolute top-0 right-0 w-1.5 md:w-2 h-1.5 md:h-2 border-t border-r border-orange-500'></span>
          <span className='absolute top-0 left-0 w-1.5 md:w-2 h-1.5 md:h-2 border-t border-l border-orange-500'></span>
          <span className='absolute bottom-0 right-0 w-1.5 md:w-2 h-1.5 md:h-2 border-b border-r border-orange-500'></span>
          <span className='absolute bottom-0 left-0 w-1.5 md:w-2 h-1.5 md:h-2 border-b border-l border-orange-500'></span>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className='fixed top-0 left-0 h-full w-full bg-black/40 inset-0'
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut',
              }}
              // onMouseEnter={handleMouseLeave}
              onClick={handleMouseLeave}
            >
              <motion.div
                className='bg-orange-500 text-black rounded-sm min-w-full  md:min-w-auto md:h-auto md:w-[350px] z-50 p-1 ml-auto'
                initial={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  width: window.innerWidth < 768 ? 280 : 350,
                  height: 'auto',
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                  width: { duration: 0.4, ease: 'easeInOut' },
                  height: { duration: 0.4, ease: 'easeInOut' },
                }}
                onMouseLeave={handleMouseLeave}
              >
                <div className='relative p-4 overflow-hidden'>
                  <span className='absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-black'></span>
                  <span className='absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-black'></span>
                  <span className='absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-black'></span>
                  <span className='absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-black'></span>
                  <p className='text-xs text-thin text-center pb-4 border-b border-dashed border-black'>
                    MENU
                  </p>

                  <div className='flex flex-col'>
                    {navItems.map((item, index) => (
                      <div
                        key={item.href}
                        className='py-1 border-b border-dashed border-black whitespace-nowrap relative overflow-hidden group cursor-pointer'
                        onClick={() => handleNavClick(item)}
                      >
                        <p className='text-xl md:text-3xl rounded-sm p-1 px-2 transition-colors duration-300 whitespace-nowrap relative z-10 group-hover:text-orange-500'>
                          <span className='font-mondwest text-2xl md:text-4xl mr-3 md:mr-6'>
                            0{index + 1}
                          </span>{' '}
                          {item.label}
                        </p>
                        <div className='absolute rounded-sm h-[calc(100%-8px)] top-1 inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out '></div>
                      </div>
                    ))}
                  </div>

                  <div className='flex flex-nowrap text-center font-thin text-sm divide-x divide-black divide-dashed mt-2'>
                    {isAuthenticated ? (
                      <>
                        <div className='p-1 flex-grow'>
                          <span className='p-1 block w-full text-black/70'>
                            Welcome, {user?.name || user?.email}
                          </span>
                        </div>
                        <div className='p-1 flex-grow'>
                          <button
                            onClick={handleLogout}
                            className='p-1 block w-full rounded-sm hover:bg-black hover:text-orange-500'
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      contactItems.map((item, index) => (
                        <div key={index} className='p-1 flex-grow '>
                          <button
                            onClick={() =>
                              handleAuthClick(
                                item.label.toLowerCase().replace(' ', '') as
                                  | 'signin'
                                  | 'register'
                              )
                            }
                            className=' p-1 block w-full rounded-sm hover:bg-black hover:text-orange-500'
                          >
                            {item.label}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;

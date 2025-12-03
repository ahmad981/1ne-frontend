// Library imports
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// Local imports
import { useStoreData } from '../../../hooks/useStoreData';
import { sideMenuRoutes } from '../../../routes/sideMenuConfig';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';

const SideMenu = ({ sideMenuOpen, setSideMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { role } = useStoreData();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [childRoute, setChildRoute] = useState(null);

  const menuItems = sideMenuRoutes(role);

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubMenu = (path) => {
    setChildRoute((prev) => (prev === path ? null : path));
  };

  // Auto-expand menu if on a sub-page
  useEffect(() => {
    const expanded = {};
    menuItems.forEach((item) => {
      if (item.child) {
        const isOnSubPage = item.child.some((child) => location.pathname.startsWith(child.path));
        if (isOnSubPage) {
          expanded[item.path] = true;
          setChildRoute(item.path);
        }
      }
    });
    setExpandedMenus((prev) => ({ ...prev, ...expanded }));
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setSideMenuOpen(window.innerWidth >= 992);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`h-full absolute left-0 z-50 border-r border-gray-200 lg:relative select-none bg-white justify-between transition-all duration-300 ${sideMenuOpen ? 'w-[250px]' : 'w-[65px]'} shadow-lg lg:shadow-none`}
    >
      {/* Header */}
      <div className='flex items-center justify-between px-[11px] h-[70px] bg-white/80 border-b border-gray-200'>
        <div className='flex items-center gap-3 overflow-hidden'>
          {sideMenuOpen && (
            <div className='flex items-center gap-2 h-10'>
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className='text-[16px] font-semibold text-gray-900 whitespace-nowrap tracking-wide'>
                Teacher Assistant
              </span>
            </div>
          )}
        </div>
        <div
          className='text-gray-900 text-sm font-bold cursor-pointer hover:text-primary-600 transition-colors'
          onClick={() => setSideMenuOpen(!sideMenuOpen)}
        >
          <div className='pr-2'>
            {sideMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className='overflow-y-auto flex pt-2 flex-col transition-all duration-300 gap-2 max-h-[calc(100dvh-7rem)] h-full'>
        {menuItems?.map((route, index) => {
          const isMainActive = currentPath.startsWith(route.path);
          const isChild = Array.isArray(route.child) && route.child.length > 0;
          const isExpanded = childRoute === route.path;

          return (
            <div key={index}>
              {/* Main route */}
              <div
                onClick={() => {
                  if (isChild) {
                    setChildRoute((prev) =>
                      prev === route.path ? null : route.path
                    );
                  } else {
                    navigate(route.path);
                  }
                }}
                className={`flex items-center justify-between mx-2 rounded px-3 py-2 cursor-pointer text-sm font-medium transition-all duration-300 ${isMainActive
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <div className='flex items-center gap-2'>
                  <div className='min-w-[20px]'>{route.icon}</div>
                  {sideMenuOpen && (
                    <span className='truncate font-medium'>{route.text}</span>
                  )}
                </div>

                {isChild && sideMenuOpen && (
                  <span
                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'
                      } text-gray-700`}
                  >
                    <ChevronDown width={12} height={12} />
                  </span>
                )}
              </div>

              {/* Child routes */}
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${isExpanded ? 'max-h-[999px]' : 'max-h-0'
                  }`}
              >
                {isChild && (
                  <div
                    className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isExpanded ? 'max-h-[500px]' : 'max-h-0'
                      }`}
                  >
                    <div
                      className={`flex flex-col gap-1 ${sideMenuOpen ? 'pl-5' : 'pl-1.5'
                        } pt-2`}
                    >
                      {route.child.map((child, childIndex) => {
                        const isChildActive = currentPath === child.path;
                        return (
                          <div
                            key={childIndex}
                            onClick={() => navigate(child.path)}
                            className={`flex items-center mx-2 gap-2 px-2 py-1 rounded text-sm font-medium cursor-pointer transition ${isChildActive
                              ? 'bg-primary/20 text-primary'
                              : 'hover:bg-gray-100 text-gray-700'
                              }`}
                          >
                            <span
                              className={`${!sideMenuOpen && 'w-full'
                                } text-[10px] text-center`}
                            >
                              {child?.childIcon}
                            </span>
                            {sideMenuOpen && (
                              <span className='truncate font-medium'>
                                {child.moduleName}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;


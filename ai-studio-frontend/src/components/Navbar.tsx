import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  Menu,
  X,
  UserCheck,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

import { useApp } from '../context/AppContext';


export const Navbar: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user,
    logout,
  } = useApp();


  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  const profileRef =
    useRef<HTMLDivElement>(null);


  const isActive = (
    path: string
  ) => location.pathname === path;


  /*
  ============================================
  CLOSE PROFILE DROPDOWN OUTSIDE CLICK
  ============================================
  */

  useEffect(() => {

    const handleClickOutside =
      (event: MouseEvent) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target as Node
          )
        ) {

          setProfileOpen(false);

        }

      };


    document.addEventListener(
      'mousedown',
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

    };

  }, []);


  /*
  ============================================
  LOGOUT
  ============================================
  */

  const handleLogout = () => {

    logout();

    setProfileOpen(false);

    setMobileMenuOpen(false);

    navigate('/auth');

  };


  /*
  ============================================
  USER INITIALS
  ============================================
  */

  const getInitials = () => {

    if (!user?.name) {

      return 'SO';

    }


    return user.name
      .split(' ')
      .map(
        (name) => name[0]
      )
      .join('')
      .toUpperCase();

  };


  /*
  ============================================
  HANDLE PROFILE CLICK
  ============================================
  */

  const handleProfileClick = () => {

    setProfileOpen(false);

    /*
    Profile page route can be added later.
    For now redirect to dashboard.
    */

    navigate('/dashboard');

  };


  /*
  ============================================
  HANDLE SETTINGS CLICK
  ============================================
  */

  const handleSettingsClick = () => {

    setProfileOpen(false);

    /*
    Settings/Profile page will be added later.
    */

    navigate('/dashboard');

  };


  return (

    <header className="sticky top-0 z-50 w-full h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-slate-950/50 backdrop-blur-md transition-all duration-300">

      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">


        {/* LOGO */}

        <Link
          to="/"
          id="nav-logo"
          className="flex items-center gap-3 group focus:outline-none"
        >

          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform">

            <div className="w-4 h-4 border-2 border-white/80 rounded-full animate-pulse" />

          </div>


          <span className="text-xl font-bold tracking-tight text-white font-display">

            CYBERSPHERE

            <span className="text-cyan-400">
              {' '}AI
            </span>

          </span>

        </Link>


        {/* DESKTOP NAVIGATION */}

        {isAuthenticated && (

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-400 font-display uppercase tracking-wider">


            <Link
              to="/dashboard"
              className={`transition-colors hover:text-cyan-400 ${
                isActive('/dashboard')
                  ? 'text-cyan-400 border-b border-cyan-400 pb-0.5'
                  : 'text-slate-400'
              }`}
            >
              DASHBOARD
            </Link>


            <Link
              to="/assistant"
              className={`transition-colors hover:text-cyan-400 ${
                isActive('/assistant')
                  ? 'text-cyan-400 border-b border-cyan-400 pb-0.5'
                  : 'text-slate-400'
              }`}
            >
              ASSISTANT
            </Link>


            <Link
              to="/agents"
              className={`transition-colors hover:text-cyan-400 ${
                isActive('/agents')
                  ? 'text-cyan-400 border-b border-cyan-400 pb-0.5'
                  : 'text-slate-400'
              }`}
            >
              AGENTS
            </Link>


            <Link
              to="/history"
              className={`transition-colors hover:text-cyan-400 ${
                isActive('/history')
                  ? 'text-cyan-400 border-b border-cyan-400 pb-0.5'
                  : 'text-slate-400'
              }`}
            >
              HISTORY
            </Link>


            <Link
              to="/uploads"
              className={`transition-colors hover:text-cyan-400 ${
                isActive('/uploads')
                  ? 'text-cyan-400 border-b border-cyan-400 pb-0.5'
                  : 'text-slate-400'
              }`}
            >
              VAULT
            </Link>


          </nav>

        )}


        {/* RIGHT SIDE */}

        <div className="hidden sm:flex items-center gap-3.5">


          {isAuthenticated && (

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full">

              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />

              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">

                System Ready

              </span>

            </div>

          )}


          {isAuthenticated ? (

            <div
              className="relative"
              ref={profileRef}
            >


              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex items-center gap-2 group"
              >

                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white group-hover:border-cyan-400 transition-colors">

                  {getInitials()}

                </div>


                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    profileOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />

              </button>


              {profileOpen && (

                <div className="absolute right-0 top-12 w-64 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl overflow-hidden z-50">


                  {/* USER INFO */}

                  <div className="p-4 border-b border-slate-800">

                    <div className="flex items-center gap-3">


                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">

                        <User className="w-5 h-5 text-cyan-400" />

                      </div>


                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-white truncate">

                          {user?.name ||
                            'Security Operator'}

                        </p>


                        <p className="text-xs text-slate-400 truncate">

                          {user?.email ||
                            'operator@cybersphere.ai'}

                        </p>

                      </div>


                    </div>

                  </div>


                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={
                      handleProfileClick
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
                  >

                    <User className="w-4 h-4" />

                    My Profile

                  </button>


                  {/* SETTINGS */}

                  <button
                    type="button"
                    onClick={
                      handleSettingsClick
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
                  >

                    <Settings className="w-4 h-4" />

                    Settings

                  </button>


                  <div className="border-t border-slate-800" />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >

                    <LogOut className="w-4 h-4" />

                    Logout

                  </button>


                </div>

              )}


            </div>

          ) : (

            <button
              type="button"
              onClick={() =>
                navigate('/auth')
              }
              className="px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5"
            >

              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />

              <span>
                Sign In
              </span>

            </button>

          )}


        </div>


        {/* MOBILE MENU BUTTON */}

        <div className="flex md:hidden items-center gap-2">

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
          >

            {mobileMenuOpen
              ? <X className="w-5 h-5" />
              : <Menu className="w-5 h-5" />
            }

          </button>

        </div>


      </div>


      {/* MOBILE MENU */}

      {mobileMenuOpen && (

        <div className="absolute top-16 left-0 right-0 md:hidden border-b border-slate-800 bg-[#010409]/98 backdrop-blur-2xl px-6 py-5 space-y-3 z-50">


          {isAuthenticated ? (

            <>


              <Link
                to="/dashboard"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              >
                DASHBOARD
              </Link>


              <Link
                to="/assistant"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              >
                ASSISTANT
              </Link>


              <Link
                to="/agents"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              >
                AGENTS
              </Link>


              <Link
                to="/history"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              >
                HISTORY
              </Link>


              <Link
                to="/uploads"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              >
                SECURITY VAULT
              </Link>


              <div className="border-t border-slate-800 my-2" />


              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
              >

                <LogOut className="w-4 h-4" />

                LOGOUT

              </button>


            </>

          ) : (

            <button
              type="button"
              onClick={() => {

                setMobileMenuOpen(false);

                navigate('/auth');

              }}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest"
            >

              SIGN IN

            </button>

          )}


        </div>

      )}


    </header>

  );

};
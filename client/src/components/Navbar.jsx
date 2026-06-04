import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Menu, Camera, X, AlertCircle } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const val = searchValue.trim().toUpperCase();
    if (!val) return;
    if (onSearch) {
      onSearch(val);
      setSearchValue('');
    }
  };

  // Also handle when user presses Enter in the search box directly
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); // prevent useBarcodeScanner from also catching this
      const val = searchValue.trim().toUpperCase();
      if (!val) return;
      if (onSearch) {
        onSearch(val);
        setSearchValue('');
      }
    }
  };

  // Camera search effect
  useEffect(() => {
    let html5QrCode = null;

    if (cameraOpen) {
      setCameraError('');
      // Delay slightly to ensure element is in DOM
      const timer = setTimeout(() => {
        try {
          html5QrCode = new Html5Qrcode("reader");
          
          const config = {
            fps: 10,
            qrbox: (width, height) => {
              return { width: Math.min(width * 0.8, 260), height: Math.min(height * 0.6, 160) };
            },
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.EAN_13
            ]
          };

          html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              if (onSearch) {
                onSearch(decodedText.trim().toUpperCase());
              }
              html5QrCode.stop().then(() => {
                setCameraOpen(false);
              }).catch(err => {
                console.error("Stop error:", err);
                setCameraOpen(false);
              });
            },
            () => {
              // verbose logs
            }
          ).catch(err => {
            console.error("Camera start error:", err);
            setCameraError("Camera access denied or no camera device found. Please grant permissions.");
          });
        } catch (err) {
          console.error("Html5Qrcode setup error:", err);
          setCameraError("Failed to initialize camera scanner.");
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(err => console.error("Unmount stop error:", err));
        }
      };
    }
  }, [cameraOpen, onSearch]);

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/80">
      {/* Greetings */}
      <div>
        <h2 className="text-base font-semibold text-navy-900 dark:text-white sm:text-lg">
          Welcome back, <span className="text-coral-500 font-bold">{user?.name || 'User'}</span>
        </h2>
        <p className="text-xs text-navy-400 dark:text-navy-500 sm:text-sm">
          Jyothi Lab Portal • Role: <span className="capitalize font-medium">{user?.role}</span>
        </p>
      </div>

      {/* Barcode Search Box */}
      <form onSubmit={handleSearchSubmit} className="hidden max-w-sm flex-1 items-center gap-2 px-4 md:flex">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Type barcode & press Enter..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-10 text-sm text-navy-855 focus:border-coral-500 focus:bg-white focus:outline-none dark:border-navy-800 dark:bg-navy-900/50 dark:text-white dark:focus:bg-navy-900"
          />
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-navy-400 hover:text-coral-500 transition-colors"
            title="Scan barcode/QR code using webcam camera"
          >
            <Camera size={15} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          <span>Scanner Ready</span>
        </div>
      </form>

      {/* Action Tray */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-navy-600 hover:bg-slate-50 dark:border-navy-850 dark:text-navy-300 dark:hover:bg-navy-900"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 hover:bg-slate-50 dark:border-navy-800 dark:hover:bg-navy-900"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">
              <User size={16} />
            </div>
            <span className="hidden text-xs font-semibold text-navy-700 dark:text-navy-300 sm:block">
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-navy-850 dark:bg-navy-900 z-20">
                <div className="border-b border-slate-100 px-3 py-2 text-xs text-navy-400 dark:border-navy-800 dark:text-navy-500">
                  <p className="font-semibold text-navy-700 dark:text-navy-300 truncate">{user?.name}</p>
                  <p className="truncate">{user?.phone}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Camera Barcode Scanner Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-navy-900 border border-slate-200 dark:border-navy-850 animate-zoom-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-coral-500/10 text-coral-500">
                  <Camera size={18} />
                </div>
                <h3 className="text-sm font-bold text-navy-900 dark:text-white">Webcam Barcode / QR Scanner</h3>
              </div>
              <button
                onClick={() => setCameraOpen(false)}
                className="rounded-lg p-1 text-navy-450 hover:bg-slate-100 dark:hover:bg-navy-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Camera Viewfinder View */}
            <div className="relative mt-4 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-black border border-slate-200 dark:border-navy-800 min-h-[220px]">
              {cameraError ? (
                <div className="p-6 text-center text-rose-500 flex flex-col items-center gap-2">
                  <AlertCircle size={32} />
                  <p className="text-xs font-semibold">{cameraError}</p>
                </div>
              ) : (
                <>
                  <div id="reader" className="w-full"></div>
                  
                  {/* Scanning Laser Line */}
                  <div className="absolute left-0 w-full h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-scanLaser pointer-events-none z-10"></div>
                  
                  {/* Overlay text */}
                  <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/85 font-bold bg-black/40 py-1 backdrop-blur-sm pointer-events-none">
                    Position barcode / QR code inside target window
                  </div>
                </>
              )}
            </div>

            {/* Footer / Info */}
            <div className="mt-4 text-[10px] text-navy-450 font-semibold leading-normal">
              Note: Camera scanning requires active webcam access. Best results are obtained under bright, non-glaring lighting conditions.
            </div>

            <div className="flex justify-end mt-5 pt-3 border-t border-slate-100 dark:border-navy-800">
              <button
                onClick={() => setCameraOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-navy-700 hover:bg-slate-50 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-300 dark:hover:bg-navy-850"
              >
                Cancel Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, 
  Activity, 
  Users, 
  BookOpen, 
  Settings, 
  Menu, 
  X,
  ClipboardList,
  Dumbbell,
  MapPin,
  Sun,
  Moon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Activity,
    description: "Your Health Overview",
    ariaLabel: "Navigate to your personal health dashboard"
  },
  {
    title: "Health Assessment",
    url: createPageUrl("Screening"),
    icon: ClipboardList,
    description: "Complete Your Screening",
    ariaLabel: "Start or continue your health screening assessment"
  },
  {
    title: "Exercise Program",
    url: createPageUrl("Program"),
    icon: Dumbbell,
    description: "Your Personalized Plan",
    ariaLabel: "Access your personalized exercise program and sessions"
  },
  {
    title: "Learn & Resources",
    url: createPageUrl("Education"),
    icon: BookOpen,
    description: "Educational Content",
    ariaLabel: "Browse educational resources and learning materials"
  },
  {
    title: "Find Providers",
    url: createPageUrl("Providers"),
    icon: MapPin,
    description: "Healthcare Network",
    ariaLabel: "Find and connect with healthcare providers in your area"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Enhanced CSS Variables for Brand Identity */}
      <style>{`
        :root {
          /* Primary Brand Colors - Sage Green Palette */
          --sage-50: #f7f9f7;
          --sage-100: #e8f0e8;
          --sage-200: #d1e1d1;
          --sage-300: #a8c8a8;
          --sage-400: #7db07d;
          --sage-500: #5a9b5a;
          --sage-600: #4a8a4a;
          --sage-700: #3d7a3d;
          --sage-800: #2f5f2f;
          --sage-900: #1f4f1f;
          
          /* Secondary - Soft Blue Palette */
          --ocean-50: #f0f9ff;
          --ocean-100: #e0f2fe;
          --ocean-200: #bae6fd;
          --ocean-300: #7dd3fc;
          --ocean-400: #38bdf8;
          --ocean-500: #0ea5e9;
          --ocean-600: #0284c7;
          --ocean-700: #0369a1;
          --ocean-800: #075985;
          --ocean-900: #0c4a6e;
          
          /* Neutral Palette */
          --warm-gray-50: #fafaf9;
          --warm-gray-100: #f5f5f4;
          --warm-gray-200: #e7e5e4;
          --warm-gray-300: #d6d3d1;
          --warm-gray-400: #a8a29e;
          --warm-gray-500: #78716c;
          --warm-gray-600: #57534e;
          --warm-gray-700: #44403c;
          --warm-gray-800: #292524;
          --warm-gray-900: #1c1917;
          
          /* Accent Colors */
          --mint-50: #f0fdf9;
          --mint-100: #ccfdf7;
          --mint-200: #99fde8;
          --mint-300: #5eead4;
          --mint-400: #2dd4bf;
          --mint-500: #14b8a6;
          --mint-600: #0d9488;
          
          /* Status Colors */
          --success-500: #10b981;
          --warning-500: #f59e0b;
          --error-500: #ef4444;
          --info-500: #3b82f6;
          
          /* Typography Scale */
          --font-size-xs: 0.75rem;
          --font-size-sm: 0.875rem;
          --font-size-base: 1rem;
          --font-size-lg: 1.125rem;
          --font-size-xl: 1.25rem;
          --font-size-2xl: 1.5rem;
          --font-size-3xl: 1.875rem;
          --font-size-4xl: 2.25rem;
          
          /* Spacing Scale */
          --spacing-xs: 0.25rem;
          --spacing-sm: 0.5rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;
          --spacing-2xl: 3rem;
          
          /* Border Radius */
          --radius-sm: 0.25rem;
          --radius-md: 0.375rem;
          --radius-lg: 0.5rem;
          --radius-xl: 0.75rem;
          --radius-2xl: 1rem;
          
          /* Shadows */
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        /* Dark Mode Variables */
        .dark {
          --sage-50: #1f2f1f;
          --sage-100: #2f3f2f;
          --warm-gray-50: #1c1917;
          --warm-gray-100: #292524;
          --warm-gray-200: #44403c;
          --warm-gray-900: #fafaf9;
          --warm-gray-800: #f5f5f4;
          --warm-gray-700: #e7e5e4;
        }

        /* Utility Classes */
        .bg-sage-50 { background-color: var(--sage-50); }
        .bg-sage-100 { background-color: var(--sage-100); }
        .bg-sage-200 { background-color: var(--sage-200); }
        .bg-sage-500 { background-color: var(--sage-500); }
        .bg-sage-600 { background-color: var(--sage-600); }
        .bg-ocean-50 { background-color: var(--ocean-50); }
        .bg-ocean-100 { background-color: var(--ocean-100); }
        .bg-ocean-500 { background-color: var(--ocean-500); }
        .bg-mint-50 { background-color: var(--mint-50); }
        .bg-mint-100 { background-color: var(--mint-100); }
        .bg-warm-gray-50 { background-color: var(--warm-gray-50); }
        .bg-warm-gray-100 { background-color: var(--warm-gray-100); }
        
        .text-sage-600 { color: var(--sage-600); }
        .text-sage-700 { color: var(--sage-700); }
        .text-sage-800 { color: var(--sage-800); }
        .text-ocean-600 { color: var(--ocean-600); }
        .text-warm-gray-600 { color: var(--warm-gray-600); }
        .text-warm-gray-700 { color: var(--warm-gray-700); }
        .text-warm-gray-800 { color: var(--warm-gray-800); }
        .text-warm-gray-900 { color: var(--warm-gray-900); }
        
        .border-sage-200 { border-color: var(--sage-200); }
        .border-ocean-200 { border-color: var(--ocean-200); }
        
        .hover\\:bg-sage-50:hover { background-color: var(--sage-50); }
        .hover\\:bg-sage-700:hover { background-color: var(--sage-700); }
        .hover\\:text-sage-700:hover { color: var(--sage-700); }
        
        /* Enhanced Accessibility */
        .focus-visible\\:ring-sage-500:focus-visible {
          box-shadow: 0 0 0 2px var(--sage-500);
        }
        
        .focus-visible\\:ring-2:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--sage-500);
        }
        
        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          :root {
            --sage-600: #2a5a2a;
            --warm-gray-600: #404040;
          }
        }
        
        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Font Size Adjustments */
        .text-adjustable-xs { font-size: var(--font-size-xs); }
        .text-adjustable-sm { font-size: var(--font-size-sm); }
        .text-adjustable-base { font-size: var(--font-size-base); }
        .text-adjustable-lg { font-size: var(--font-size-lg); }
        .text-adjustable-xl { font-size: var(--font-size-xl); }
        
        /* Large tap targets for mobile accessibility */
        .tap-target {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      <div className="bg-gradient-to-br from-sage-50 via-warm-gray-50 to-ocean-50 dark:from-warm-gray-900 dark:via-warm-gray-800 dark:to-warm-gray-900">
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <Sidebar className="border-r border-sage-200 dark:border-warm-gray-700 bg-white/95 dark:bg-warm-gray-800/95 backdrop-blur-sm">
              <SidebarHeader className="border-b border-sage-200 dark:border-warm-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart 
                      className="w-7 h-7 text-white" 
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-warm-gray-900 dark:text-warm-gray-100 tracking-tight">
                      PhysioPath
                    </h1>
                    <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 font-medium">
                      Your Journey to Recovery
                    </p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-4">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-semibold text-warm-gray-600 dark:text-warm-gray-400 uppercase tracking-wider px-2 py-3">
                    Navigation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`mb-2 rounded-xl transition-all duration-200 tap-target focus-visible:ring-2 focus-visible:ring-sage-500 ${
                              location.pathname === item.url 
                                ? 'bg-sage-100 dark:bg-sage-800 text-sage-800 dark:text-sage-200 shadow-sm border border-sage-200 dark:border-sage-600' 
                                : 'text-warm-gray-700 dark:text-warm-gray-300 hover:bg-sage-50 dark:hover:bg-warm-gray-700 hover:text-sage-700 dark:hover:text-sage-300'
                            }`}
                          >
                            <Link 
                              to={item.url} 
                              className="flex items-center gap-3 px-4 py-3 w-full"
                              aria-label={item.ariaLabel}
                            >
                              <item.icon 
                                className="w-5 h-5 flex-shrink-0" 
                                aria-hidden="true"
                              />
                              <div className="flex-1 text-left">
                                <div className="font-medium text-adjustable-base">{item.title}</div>
                                <div className="text-adjustable-xs text-warm-gray-600 dark:text-warm-gray-400">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                {/* Progress Widget */}
                <SidebarGroup className="mt-8">
                  <SidebarGroupContent>
                    <div className="bg-gradient-to-r from-sage-50 to-mint-50 dark:from-sage-900 dark:to-warm-gray-800 rounded-2xl p-4 border border-sage-200 dark:border-warm-gray-600">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity 
                          className="w-4 h-4 text-sage-600 dark:text-sage-400" 
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold text-warm-gray-800 dark:text-warm-gray-200">
                          Your Progress
                        </span>
                      </div>
                      <div className="text-xs text-warm-gray-600 dark:text-warm-gray-400 mb-3">
                        Keep up the excellent work!
                      </div>
                      <div className="w-full bg-white dark:bg-warm-gray-700 rounded-full h-3 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-sage-500 to-sage-600 h-3 rounded-full shadow-sm transition-all duration-500"
                          style={{ width: '75%' }}
                          role="progressbar"
                          aria-valuenow={75}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label="Overall progress: 75% complete"
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-warm-gray-600 dark:text-warm-gray-400">
                          75% Complete
                        </span>
                        <Badge className="bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 text-xs">
                          Week 3
                        </Badge>
                      </div>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-sage-200 dark:border-warm-gray-700 p-4">
                {/* Dark Mode Toggle */}
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="w-full justify-start gap-2 text-warm-gray-600 dark:text-warm-gray-400 hover:text-warm-gray-800 dark:hover:text-warm-gray-200"
                    aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                  >
                    {darkMode ? (
                      <Sun className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Moon className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span className="text-adjustable-sm">
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </Button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-sage-50 dark:bg-warm-gray-700 border border-sage-100 dark:border-warm-gray-600">
                  <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm" aria-hidden="true">
                      P
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-warm-gray-900 dark:text-warm-gray-100 text-adjustable-sm truncate">
                      Patient Portal
                    </p>
                    <p className="text-adjustable-xs text-warm-gray-600 dark:text-warm-gray-400 truncate">
                      Empowering your recovery
                    </p>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0">
              {/* Mobile Header */}
              <header className="bg-white/90 dark:bg-warm-gray-800/90 backdrop-blur-sm border-b border-sage-200 dark:border-warm-gray-700 px-4 py-4 lg:hidden">
                <div className="flex items-center justify-between">
                  <SidebarTrigger 
                    className="hover:bg-sage-50 dark:hover:bg-warm-gray-700 p-2 rounded-lg transition-colors duration-200 tap-target focus-visible:ring-2 focus-visible:ring-sage-500" 
                    aria-label="Open navigation menu"
                  />
                  <div className="flex items-center gap-3">
                    <Heart 
                      className="w-6 h-6 text-sage-600 dark:text-sage-400" 
                      aria-hidden="true"
                    />
                    <h1 className="text-xl font-bold text-warm-gray-900 dark:text-warm-gray-100">
                      PhysioPath
                    </h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="tap-target focus-visible:ring-2 focus-visible:ring-sage-500"
                    aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Moon className="w-5 h-5" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </header>

              {/* Main Content Area */}
              <div className="flex-1 overflow-auto">
                <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl">
                  <main role="main" id="main-content">
                    {children}
                  </main>
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
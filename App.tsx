
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomeView } from './components/home/HomeView';
import { PlannerView } from './components/planner/PlannerView';
import { TrackerView } from './components/tracker/TrackerView';
import { MonetizationView } from './components/monetization/MonetizationView';
import { HomeIcon, CalendarIcon, ChartBarIcon, CurrencyDollarIcon, SunIcon, MoonIcon, InformationCircleIcon } from './components/common/Icons';
import { ScheduledPost, TrackedAccount, MonetizationEntry, ExpenseItem } from './types';
import { DEFAULT_PLATFORMS } from './constants';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });

  // Persisted state (example for core data, could be moved to a context/store later)
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const saveState = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  };

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => loadState<ScheduledPost[]>('scheduledPosts', []));
  const [trackedAccounts, setTrackedAccounts] = useState<TrackedAccount[]>(() => loadState<TrackedAccount[]>('trackedAccounts', []));
  const [monetizationEntries, setMonetizationEntries] = useState<MonetizationEntry[]>(() => loadState<MonetizationEntry[]>('monetizationEntries', []));
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => loadState<ExpenseItem[]>('expenses', []));

  useEffect(() => { saveState('scheduledPosts', scheduledPosts); }, [scheduledPosts]);
  useEffect(() => { saveState('trackedAccounts', trackedAccounts); }, [trackedAccounts]);
  useEffect(() => { saveState('monetizationEntries', monetizationEntries); }, [monetizationEntries]);
  useEffect(() => { saveState('expenses', expenses); }, [expenses]);


  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5 mr-2" />, exact: true },
    { path: '/planner', label: 'Planner', icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
    { path: '/tracker', label: 'Tracker', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
    { path: '/monetization', label: 'Monetization', icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-100 text-gray-800'}`}>
        <header className={`shadow-md ${darkMode ? 'bg-slate-800' : 'bg-primary-600'} text-white p-4 print:hidden`}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-3 text-accent-400">
                <path d="M16.5,8.5c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S17.33,8.5,16.5,8.5z M9,11.5 C7.34,11.5 6,10.16 6,8.5 S7.34,5.5 9,5.5 S12,6.84 12,8.5 S10.66,11.5 9,11.5z M16.5,12.5c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5 s2.5-1.12,2.5-2.5S17.88,12.5,16.5,12.5z M9,13c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4S11.21,13,9,13z M22,2H2v20h20V2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
               </svg>
              <h1 className="text-2xl font-bold">Social Media Suite</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full focus:outline-none focus:ring-2 ${darkMode ? 'hover:bg-slate-700 focus:ring-slate-500' : 'hover:bg-primary-700 focus:ring-primary-400'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-300" />}
            </button>
          </div>
        </header>

        <nav className={`${darkMode ? 'bg-slate-800 border-b border-slate-700' : 'bg-white shadow-sm'} p-2 sm:p-4 print:hidden`}>
          <ul className="container mx-auto flex flex-wrap space-x-1 sm:space-x-2 justify-center sm:justify-start">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact} // Important for home path matching
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors duration-150 ease-in-out
                    ${isActive 
                      ? (darkMode ? 'bg-accent-600 text-white' : 'bg-primary-500 text-white') 
                      : (darkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800')}
                    `}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow container mx-auto p-3 sm:p-4 md:p-6">
          <Routes>
             <Route path="/" element={
              <HomeView
                scheduledPosts={scheduledPosts}
                trackedAccounts={trackedAccounts}
                monetizationEntries={monetizationEntries}
                expenses={expenses}
                darkMode={darkMode}
              />
            } />
            <Route path="/planner" element={
              <PlannerView 
                scheduledPosts={scheduledPosts} 
                setScheduledPosts={setScheduledPosts}
                platforms={DEFAULT_PLATFORMS}
                darkMode={darkMode}
              />
            } />
            <Route path="/tracker" element={
              <TrackerView 
                trackedAccounts={trackedAccounts}
                setTrackedAccounts={setTrackedAccounts}
                platforms={DEFAULT_PLATFORMS}
                darkMode={darkMode}
              />
            } />
            <Route path="/monetization" element={
              <MonetizationView 
                monetizationEntries={monetizationEntries}
                setMonetizationEntries={setMonetizationEntries}
                expenses={expenses}
                setExpenses={setExpenses}
                trackedPosts={trackedAccounts.flatMap(acc => acc.posts)}
                darkMode={darkMode}
              />
            } />
          </Routes>
        </main>

        <footer className={`text-center p-4 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-200 text-gray-600'} text-sm print:hidden`}>
          © {new Date().getFullYear()} Social Media Suite. AI-Enhanced.
          <div className="mt-1">
            <a href="https://github.com/google/labs-prototyping-runtime/blob/main/NOTICE" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline">Acknowledgements & Open Source Notices</a>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

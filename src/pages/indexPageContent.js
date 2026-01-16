//@refresh reset
import React, { useState} from "react";
import { Helmet } from "react-helmet";
import { useTheme } from "../lib/themeProvider.js";
import WarframesTab from "../components/warframesTab.js";
import WeaponsTab from "../components/weaponsTab.js";
import CompanionsTab from "../components/companionsTab.js";
import ArchwingsTab from "../components/archwingTab.js";
import ActivitiesTab from "../components/activitiesTab.js";
import LichWeaponsTab from "../components/lichWeaponsTab.js";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage.js";
import { supabase } from "../lib/supabaseClient.js";
import clsx from "clsx";

import "../styles/global.css";


const IndexPageContents = () => {
  const { theme } = useTheme();
  const moveSelectedToEndKey = "moveSelectedToEnd";
  const hideSelectedKey = "hideSelected";
  const localStorageKey = "activetab";

  const [selectedTab, setSelectedTab] = usePersistentLocalStorage(localStorageKey, "warframes");
  const [moveSelectedToEnd, setMoveSelectedToEnd] = usePersistentLocalStorage(moveSelectedToEndKey, false);
  const [hideSelected, setHideSelected] = usePersistentLocalStorage(hideSelectedKey, false);
  const [searchQuery, setSearchQuery] = useState("");

  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  React.useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setShowAuthModal(false);
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    setAuthError("");

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(error);
      setAuthError(error.message);
      return;
    }

    if (data?.user && !data.session) {
      setAuthError("Please check your email to confirm your account.");
      setEmail("");
      setPassword("");
      return;
    }

    setShowAuthModal(false);
    setEmail("");
    setPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const openLogin = (signup = false) => {
    setIsSignup(signup);
    setShowAuthModal(true);
    setAuthError("");
  };


  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  }; 

  const getSearchClasses = () => clsx(
    'p-2 rounded border flex-grow min-w-[180px] max-w-[400px] focus:outline-none focus:ring-2', {
    'border-void-border bg-void-card focus:border-void-primary focus:ring-void-hover': theme === 'void' ,
    'border-corpus-border bg-corpus-card focus:border-corpus-primary focus:ring-corpus-hover': theme === 'corpus' ,
    'border-grineer-border bg-grineer-card focus:border-grineer-primary focus:ring-grineer-hover': theme === 'grineer' ,
    'border-orokin-border bg-orokin-card focus:border-orokin-primary focus:ring-orokin-hover': theme === 'orokin' ,
    'border-dark-border bg-dark-card focus:border-dark-primary focus:ring-dark-hover': theme === 'dark' ,
    'border-classic-border bg-classic-card focus:border-classic-primary focus:ring-classic-hover': theme === 'classic'
    }
  );

  const getTabClasses = (isSelected) => clsx(
    `px-4 py-2 rounded transition-colors duration-300 border border-2`, {
      'bg-void-primary text-void-bg': isSelected && theme === 'void',
      'bg-void-card text-void-text': !isSelected && theme === 'void',
      'hover:bg-void-hover hover:text-void-bg  border-void-border': theme === 'void',
      'bg-corpus-primary text-corpus-bg': isSelected && theme === 'corpus',
      'bg-corpus-card text-corpus-text': !isSelected && theme === 'corpus',
      'hover:bg-corpus-hover hover:text-corpus-bg border-corpus-border': theme === 'corpus',
      'bg-grineer-primary text-grineer-bg': isSelected && theme === 'grineer',
      'bg-grineer-card text-grineer-text': !isSelected && theme === 'grineer',
      'hover:bg-grineer-hover hover:text-grineer-bg border-grineer-border': theme === 'grineer',
      'bg-orokin-primary text-orokin-bg': isSelected && theme === 'orokin',
      'bg-orokin-card text-orokin-text': !isSelected && theme === 'orokin',
      'hover:bg-orokin-hover hover:text-orokin-bg border-orokin-border': theme === 'orokin',
      'bg-dark-primary text-dark-bg': isSelected && theme === 'dark',
      'bg-dark-card text-dark-text': !isSelected && theme === 'dark',
      'hover:bg-dark-hover hover:text-dark-bg border-dark-border': theme === 'dark',
      'bg-classic-primary text-classic-bg': isSelected && theme === 'classic',
      'bg-classic-card text-classic-text': !isSelected && theme === 'classic',
      'hover:bg-classic-hover hover:text-classic-bg border-classic-border': theme === 'classic',
    }
  );

  const getAuthModalClasses =() => clsx(
    'p-8 rounded-xl w-full max-w-md shadow-lg', {
      'bg-void-bg text-void-text': theme === 'void',
      'bg-corpus-bg text-corpus-text': theme === 'corpus',
      'bg-grineer-bg text-grineer-text': theme === 'grineer',
      'bg-orokin-bg text-orokin-text': theme === 'orokin',
      'bg-dark-bg text-dark-text': theme === 'dark',
      'bg-classic-bg text-classic-text': theme === 'classic',
    }
  ); 

  const getAuthModalSearchClasses =() => clsx(
    'w-full px-2.5 py-3 mb-3 rounded-md border focus:outline-none focus:ring-2', {
    'border-void-border focus:border-void-primary focus:ring-void-hover': theme === 'void' ,
    'border-corpus-border focus:border-corpus-primary focus:ring-corpus-hover': theme === 'corpus' ,
    'border-grineer-border focus:border-grineer-primary focus:ring-grineer-hover': theme === 'grineer' ,
    'border-orokin-border focus:border-orokin-primary focus:ring-orokin-hover': theme === 'orokin' ,
    'border-dark-border focus:border-dark-primary focus:ring-dark-hover': theme === 'dark' ,
    'border-classic-border focus:border-classic-primary focus:ring-classic-hover': theme === 'classic'
    }
  )
  
  const getCheckBoxStyles = () => clsx(
    'scale-150 mr-2',{
      'accent-void-accent': theme === 'void',
      'accent-corpus-accent': theme === 'corpus',
      'accent-grineer-accent': theme === 'grineer',
      'accent-orokin-accent': theme === 'orokin',
      'accent-dark-accent': theme === 'dark',
      'accent-classic-accent': theme === 'classic',
    }
  )

  const getBackgroundStyles = () => clsx(
    'min-h-screen', {
      'bg-void-bg text-void-text': theme === 'void',
      'bg-corpus-bg text-corpus-text': theme === 'corpus',
      'bg-grineer-bg text-grineer-text': theme === 'grineer',
      'bg-orokin-bg text-orokin-text': theme === 'orokin',
      'bg-dark-bg text-dark-text': theme === 'dark',
      'bg-classic-bg text-classic-text': theme === 'classic',
    }
    
  )

  return (
    <div className={getBackgroundStyles()}>
    <div
      className={`p-8 mx-auto 
      transition-filter duration-10000 ease-linear
      ${showAuthModal ? 'filter-blur pointer-events-none' : ''}`}
    >
      <Helmet>
        <title>Warframe Checklist</title>
      </Helmet>
      <div 
      className = "mb-4 flex flex-wrap items-center gap-4"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={getSearchClasses()}
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTabChange("warframes")}
            className={getTabClasses(selectedTab === "warframes")}
          >
            Warframes
          </button>
          <button
            onClick={() => handleTabChange("weapons")}
            className={getTabClasses(selectedTab === "weapons")}
          >
            Weapons
          </button>
          <button
            onClick={() => handleTabChange("companions")}
            className={getTabClasses(selectedTab === "companions")}
          >
            Companions
          </button>
          <button
            onClick={() => handleTabChange("archwings")}
            className={getTabClasses(selectedTab === "archwings")}
          >
            Archwing/Misc
          </button>
          <button
            onClick={() => handleTabChange("activities")}
            className={getTabClasses(selectedTab === "activities")}
          >
            Dailies/Weeklies
          </button>
          <button
            onClick={() => handleTabChange("lichweps")}
            className={getTabClasses(selectedTab === "lichweps")}
          >
            Lich Weapons
          </button>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {!user ? (
            <>
              <button onClick={() => openLogin(false)} className={getTabClasses(true)}>Sign In</button>
              <button onClick={() => openLogin(true)} className={getTabClasses(true)}>Sign Up</button>
            </>
          ) : (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={handleLogout} className={getTabClasses(true)}>Log Out</button>
            </>
          )}
        </div>
      </div>
      <div
        className="mb-4 flex flex-wrap items-center gap-4"
      >
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={moveSelectedToEnd}
            onChange={(e) => setMoveSelectedToEnd(e.target.checked)}
            className={getCheckBoxStyles()}
          />
          Move selected to end
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hideSelected}
            onChange={(e) => setHideSelected(e.target.checked)}
            className={getCheckBoxStyles()}
          />
          Hide selected
        </label>
      </div>

      <div className="bg-inherit">
        <div className={selectedTab === "warframes" ? "block" : "hidden"}>
          <WarframesTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}
          user_id={!user ? null : user.id} />
        </div>
        <div className={selectedTab === "weapons" ? "block" : "hidden"}>
          <WeaponsTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}
          user_id={!user ? null : user.id}/>
        </div>
        <div className={selectedTab === "companions" ? "block" : "hidden"}>
          <CompanionsTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}
          user_id={!user ? null : user.id}/>
        </div>
        <div className={selectedTab === "archwings" ? "block" : "hidden"}>
          <ArchwingsTab
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}
          user_id={!user ? null : user.id}/>
        </div>
        <div className={selectedTab === "activities" ? "block" : "hidden"}>
          <ActivitiesTab
          user_id={!user ? null : user.id}/>
        </div>
        <div className={selectedTab === "lichweps" ? "block" : "hidden"}>
          <LichWeaponsTab
          user_id={!user ? null : user.id}/>
        </div>
      </div>
    </div>
    {showAuthModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowAuthModal(false)}
      >
        <div
          className={getAuthModalClasses()}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-4">
            {isSignup ? "Sign Up" : "Sign In"}
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={getAuthModalSearchClasses()}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={getAuthModalSearchClasses()}
          />

          {authError && (
            <div className="text-red-500 mb-2">
              {authError}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setShowAuthModal(false)}
              className={getTabClasses(false)}
            >
              Cancel
            </button>

            <button
              onClick={isSignup ? handleSignup : handleLogin}
              className={getTabClasses(true)}
            >
              {isSignup ? "Create Account" : "Login"}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default IndexPageContents;

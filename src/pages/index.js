//@refresh reset
import React, { useState} from "react";
import { Helmet } from "react-helmet";
import WarframesTab from "../components/warframesTab.js";
import WeaponsTab from "../components/weaponsTab.js";
import CompanionsTab from "../components/companionsTab.js";
import ArchwingsTab from "../components/archwingTab.js";
import ActivitiesTab from "../components/activitiesTab.js";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage.js";
import { supabase } from "../lib/supabaseClient";

import "../styles/global.css";


const IndexPage = () => {
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

    const { error } = await supabase.auth.signUp({
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

  return (
    <>
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
          className="p-2 rounded border border-gray-300 flex-grow min-w-[180px] max-w-[400px]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTabChange("warframes")}
            className={`px-4 py-2 rounded 
            transition-colors duration-300
            ${selectedTab === "warframes" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            Warframes
          </button>
          <button
            onClick={() => handleTabChange("weapons")}
            className={`px-4 py-2 rounded 
            transition-colors duration-300
            ${selectedTab === "weapons" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            Weapons
          </button>
          <button
            onClick={() => handleTabChange("companions")}
            className={`px-4 py-2 rounded 
            transition-colors duration-300
            ${selectedTab === "companions" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            Companions
          </button>
          <button
            onClick={() => handleTabChange("archwings")}
            className={`px-4 py-2 rounded 
            transition-colors duration-300
            ${selectedTab === "archwings" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            Archwing
          </button>
          <button
            onClick={() => handleTabChange("activities")}
            className={`px-4 py-2 rounded 
            transition-colors duration-300
            ${selectedTab === "activities" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            Dailies/Weeklies
          </button>
        </div>
        <div>
          {!user ? (
            <>
              <button onClick={() => openLogin(false)} className="px-1.5 py-3 rounded-md bg-blue-500 text-white cursor-pointer">Sign In</button>
              <button onClick={() => openLogin(true)} className="px-1.5 py-3 rounded-md bg-blue-500 text-white cursor-pointer">Sign Up</button>
            </>
          ) : (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={handleLogout} className="px-1.5 py-3 rounded-md bg-blue-500 text-white cursor-pointer">Log Out</button>
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
            className="mr-2"
          />
          Move selected to end
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hideSelected}
            onChange={(e) => setHideSelected(e.target.checked)}
            className="mr-2"
          />
          Hide selected
        </label>
      </div>

      <div>
        {selectedTab === "warframes" && <WarframesTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}
          user_id={!user ? null : user.id} />}
        {/*{selectedTab === "weapons" && <WeaponsTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}/>}
        {selectedTab === "companions" && <CompanionsTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}/>}
        {selectedTab === "archwings" && <ArchwingsTab 
          searchQuery={searchQuery}
          moveSelectedToEnd={moveSelectedToEnd}
          hideSelected={hideSelected}/>}*/}
        {selectedTab === "activities" && <ActivitiesTab 
          />}
      </div>
    </div>
    {showAuthModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowAuthModal(false)}
      >
        <div
          className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg"
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
            className="w-full px-2.5 py-3 mb-3 rounded-md border border-gray-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2.5 py-3 mb-3 rounded-md border border-gray-300"
          />

          {authError && (
            <div className="text-red-500 mb-2">
              {authError}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setShowAuthModal(false)}
              className="px-1.5 py-3 rounded-md bg-blue-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={isSignup ? handleSignup : handleLogin}
              className="px-1.5 py-3 rounded-md bg-blue-500 text-white cursor-pointer"
            >
              {isSignup ? "Create Account" : "Login"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default IndexPage;

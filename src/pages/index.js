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

  const authButtonStyle = {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  };

  const modalInputStyle = {
    width: "100%",
    padding: "0.6rem 0.8rem",
    marginBottom: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const secondaryButtonStyle = {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#e0e0e0",
    cursor: "pointer",
  };


  return (
    <>
    <div
      style={{
        padding: "2rem",
        paddingLeft: "4%",
        paddingRight: "4%",
        margin: "0 auto",
        filter: showAuthModal ? "blur(5px)" : "none",
        pointerEvents: showAuthModal ? "none" : "auto",
        transition: "filter 0.2s ease",
      }}
    >
      <Helmet>
        <title>Warframe Checklist</title>
      </Helmet>
      <div style={{
        marginBottom: "1rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem",
      }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flexGrow: 1,
            minWidth: "180px",
            maxWidth: "400px",
          }}
        />
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => handleTabChange("warframes")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedTab === "warframes" ? "#007bff" : "#e0e0e0",
              color: selectedTab === "warframes" ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Warframes
          </button>
          <button
            onClick={() => handleTabChange("weapons")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedTab === "weapons" ? "#007bff" : "#e0e0e0",
              color: selectedTab === "weapons" ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Weapons
          </button>
          <button
            onClick={() => handleTabChange("companions")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedTab === "companions" ? "#007bff" : "#e0e0e0",
              color: selectedTab === "companions" ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Companions
          </button>
          <button
            onClick={() => handleTabChange("archwings")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedTab === "archwings" ? "#007bff" : "#e0e0e0",
              color: selectedTab === "archwings" ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Archwing
          </button>
          <button
            onClick={() => handleTabChange("activities")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedTab === "activities" ? "#007bff" : "#e0e0e0",
              color: selectedTab === "activities" ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Dailies/Weeklies
          </button>
        </div>
        <div>
          {!user ? (
            <>
              <button onClick={() => openLogin(false)} style={authButtonStyle}>Sign In</button>
              <button onClick={() => openLogin(true)} style={authButtonStyle}>Sign Up</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: "0.9rem" }}>{user.email}</span>
              <button onClick={handleLogout} style={authButtonStyle}>Log Out</button>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={moveSelectedToEnd}
            onChange={(e) => setMoveSelectedToEnd(e.target.checked)}
            style={{ marginRight: "0.5rem" }}
          />
          Move selected to end
        </label>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={hideSelected}
            onChange={(e) => setHideSelected(e.target.checked)}
            style={{ marginRight: "0.5rem" }}
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
        {selectedTab === "weapons" && <WeaponsTab 
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
          hideSelected={hideSelected}/>}
        {selectedTab === "activities" && <ActivitiesTab 
          />}
      </div>
    </div>
    {showAuthModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>
            {isSignup ? "Sign Up" : "Sign In"}
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={modalInputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={modalInputStyle}
          />

          {authError && (
            <div style={{ color: "red", marginBottom: "0.5rem" }}>
              {authError}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setShowAuthModal(false)}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>

            <button
              onClick={isSignup ? handleSignup : handleLogin}
              style={authButtonStyle}
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

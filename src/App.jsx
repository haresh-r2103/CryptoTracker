import React, { useState } from "react";
import "./App.css";
import SearchBar from "./SearchBar";

const App = () => {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark-mode" : ""}>
      <nav className="navBar">
        <span><h1>CryptoBuddy</h1></span>
        <button className="toggle" onClick={() => setDark(!dark)}>
          {dark ? "Light" : "Dark"}
        </button>
      </nav>
      <main>
        <SearchBar />
      </main>
    </div>
  );
};

export default App;

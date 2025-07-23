import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import './App.css';

import Homepage from './pages/Homepage';
import Profiles from "./pages/Profiles";
import Deb from "./pages/Deb";
import Noah from "./pages/Noah";
import Phone from "./pages/Phone";
import Stroll from "./pages/Stroll";
import Mistake from "./pages/Mistake";
import UnsupportedDevice from "./pages/UnsupportedDevice";

function App() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSupported(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isSupported) return <UnsupportedDevice />;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/deb" element={<Deb />} />
        <Route path="/noah" element={<Noah />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/stroll" element={<Stroll />} />
        <Route path="/mistake" element={<Mistake />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

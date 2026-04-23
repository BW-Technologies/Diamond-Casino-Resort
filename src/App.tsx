/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Membership from './pages/Membership';
import Penthouses from './pages/Penthouses';
import Casino from './pages/Casino';
import Store from './pages/Store';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen text-white font-sans selection:bg-fuchsia-900 selection:text-white">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/penthouses" element={<Penthouses />} />
            <Route path="/casino" element={<Casino />} />
            <Route path="/store" element={<Store />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

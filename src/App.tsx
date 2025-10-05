import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgentLogin } from './pages/AgentLogin';
import { AgentDashboard } from './pages/AgentDashboard';
import { SuiviColisComponent } from './components/SuiviColisComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/suivi" replace />} />
        <Route path="/suivi" element={<SuiviColisComponent />} />
        <Route path="/agent-space" element={<AgentLogin />} />
        <Route path="/agent-space/dashboard" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Templates } from './pages/Templates';
import { Editor } from './pages/Editor';
import { Preview } from './pages/Preview';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Privadas */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/templates" element={<Templates />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/preview/:id" element={<Preview />} />

        {/* Redirecionamento Inicial */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

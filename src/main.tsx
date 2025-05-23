import './styles/index.css';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './components/auth/AuthContext'; 

createRoot(document.getElementById("root")!).render(
  <AuthProvider> 
    <App />
  </AuthProvider>
);

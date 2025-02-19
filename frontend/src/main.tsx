import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'animate.css';
import './styles.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { UserProvider } from './context/UserContext.tsx';

// Register elements and scales
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);



createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
  // </StrictMode>,
)

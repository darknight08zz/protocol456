// src/routes.js
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Day1Page from './pages/Day1Page';
import CirclePage from './pages/CirclePage';
import TrianglePage from './pages/TrianglePage';
import SquarePage from './pages/SquarePage';
import StarPage from './pages/StarPage';
import Round2Page from './pages/Round2Page'; //

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <div>Home Content</div> }, // or your actual home
      { path: 'day1', element: <Day1Page /> },
      { path: 'circle', element: <CirclePage /> },
      { path: 'triangle', element: <TrianglePage /> },
      { path: 'square', element: <SquarePage /> },
      { path: 'star', element: <StarPage /> },
      { path: 'round2', element: <Round2Page /> },
    ],
  },
]);

export default router;
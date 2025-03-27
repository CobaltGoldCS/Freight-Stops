import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Home } from './pages/Home.tsx'
import { VisualMap } from './pages/VisualMap.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/map',
        element: <VisualMap />,
      },
    ]
  }
])

function Main() {
  return (
    <RouterProvider router={router} />
  )
}


createRoot(document.getElementById('root')!).render(
  <Main />,
)

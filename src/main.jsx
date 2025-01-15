import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import theme from '../theme.js'
import Home from './pages/Home.jsx'
import Movies from './pages/movies/Movies.jsx'
import Shows from './pages/shows/Shows.jsx'
import Search from './pages/search/Search.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import { AuthProvider } from './context/authProvider.jsx'
import Login from './pages/registration/login.jsx'
import Register from './pages/registration/Register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/movies",
        element: <Movies />
      },
      {
        path: "/shows",
        element: <Shows />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/:type/:id",
        element: <DetailsPage />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <AuthProvider>
      <RouterProvider router={router}/>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
)

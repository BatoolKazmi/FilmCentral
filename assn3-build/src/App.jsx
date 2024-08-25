import NavBar from './components/NavBar.jsx'
import './styles/App.css'


import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./components/routes/routes";
import Login from './components/LoginSignup/Login.jsx';
import { UserProvider } from './components/UserContext.jsx';

//const router = createBrowserRouter(routes);
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

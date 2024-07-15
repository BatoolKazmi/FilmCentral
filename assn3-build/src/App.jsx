import NavBar from './components/NavBar.jsx'
import './styles/App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./components/routes/routes";

const router = createBrowserRouter(routes);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

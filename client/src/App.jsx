import { Routes, Route } from "react-router";
import Homepage from "./components/Homepage";
import Auth from "./components/Auth";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={
              <Auth>
                <Homepage />
              </Auth>
            } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </>
  )
}

export default App

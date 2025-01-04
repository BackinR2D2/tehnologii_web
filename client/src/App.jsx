import { Routes, Route, useNavigate } from "react-router";
import Homepage from "./components/Homepage";
import Auth from "./components/Auth";
import Login from "./components/Login";
import Register from "./components/Register";
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";
import Notes from "./components/Notes";
import Note from "./components/Note";

function App() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const items = [
      {
          label: 'Home',
          command: () => navigate('/'),
      },
      {
          label: 'Notes',
          command: () => navigate('/notes'),
      },
  ];

  const end = (
    // sign out button
    <div>
        <button className="p-button p-component p-button-danger" onClick={() => {
          sessionStorage.removeItem('token');
          setToken('');
          navigate('/login');
        }}>
            <span>Sign Out</span>
        </button>
    </div>
  );

  useEffect(() => {
    setToken(sessionStorage.getItem('token'));
    const storageHandler = () => {
      setToken(sessionStorage.getItem('token'));
    }

    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('storage', storageHandler);
    }
  }, []);

  return (
    <>
        {
          token ?
            <Menubar model={items} end={end} />
            :
            <></>
        }
        <Routes>
          <Route path="/" element={
              <Auth>
                <Homepage />
              </Auth>
            } />
          <Route path="/notes" element={
              <Auth>
                <Notes />
              </Auth>
            } />
          <Route path="/notes/:id" element={
              <Auth>
                <Note />
              </Auth>
            } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </>
  )
}

export default App

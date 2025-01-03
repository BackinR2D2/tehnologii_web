import { Routes, Route, useNavigate } from "react-router";
import Homepage from "./components/Homepage";
import Auth from "./components/Auth";
import Login from "./components/Login";
import Register from "./components/Register";
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const items = [
      {
          label: 'Home',
          icon: 'pi pi-home'
      },
      {
          label: 'Features',
          icon: 'pi pi-star'
      },
      {
          label: 'Projects',
          icon: 'pi pi-search',
          items: [
              {
                  label: 'Components',
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'Blocks',
                  icon: 'pi pi-server'
              },
              {
                  label: 'UI Kit',
                  icon: 'pi pi-pencil'
              },
              {
                  label: 'Templates',
                  icon: 'pi pi-palette',
                  items: [
                      {
                          label: 'Apollo',
                          icon: 'pi pi-palette'
                      },
                      {
                          label: 'Ultima',
                          icon: 'pi pi-palette'
                      }
                  ]
              }
          ]
      },
      {
          label: 'Contact',
          icon: 'pi pi-envelope'
      }
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </>
  )
}

export default App

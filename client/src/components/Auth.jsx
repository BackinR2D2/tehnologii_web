import { Navigate } from "react-router"

function Auth({children}) {
    return (
        <>
            {
                sessionStorage.getItem('token') ? children : <Navigate to="/login" />
            }
        </>
    );
}

export default Auth
import React, { useRef } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'
import { Navigate, useNavigate } from 'react-router'
import { Toast } from 'primereact/toast'
import { login } from '../api/login.js';

function Login() {
    const [student, setStudent] = React.useState({email: '', password: ''});
    const navigate = useNavigate();
    const toastRef = useRef();

    const handleLogin = async () => {
        const { token, error } = await login(student.email, student.password);
        if (error) {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: error});
            return;
        }
        sessionStorage.setItem('token', token);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    return (
        <>
            {
                sessionStorage.getItem('token') ?
                    <Navigate to='/' />
                    :
                    <div className='loginContainer' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '94dvh' }}>
                        <div className='loginForm' style={{ width: '300px' }}>
                            <h1>Login</h1>
                            <div className='p-fluid' style={{ gap: '1rem' }}>
                            <div>
                                <label htmlFor='email'>Email</label>
                                <InputText value={student.email} id='email' type='email' style={{marginTop: '6px'}} onChange={(e) => setStudent((prev) => {
                                    return {...prev, email: e.target.value}
                                })} />
                            </div>
                            <div style={{marginTop: '6px'}}>
                                <label htmlFor='password'>Password</label>
                                <InputText value={student.password} id='password' type='password' style={{marginTop: '6px'}} onChange={(e) => setStudent((prev) => {
                                    return {...prev, password: e.target.value}
                                })} />
                            </div>
                            <Button label='Login' style={{marginTop: '1rem'}} onClick={handleLogin} />
                            <Divider />
                            <Button label='Register' onClick={() => {navigate('/register')}} />
                            </div>
                        </div>
                        <Toast ref={toastRef} /> 
                    </div>
            }
        </>
  )
}

export default Login;
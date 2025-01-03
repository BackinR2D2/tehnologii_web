import React, { useRef } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'
import { Navigate, useNavigate } from 'react-router'
import { Toast } from 'primereact/toast'
import { register } from '../api/register.js';

function Register() {
    const [student, setStudent] = React.useState({email: '', password: ''});
    const navigate = useNavigate();
    const toastRef = useRef();

    const handleRegister = async () => {
        if(student.email === '' || student.password === '') {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: 'Invalid Request'});
            return;
        }
        if(student.email.includes('@stud.ase.ro') === false) {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: 'Invalid Email'});
            return;
        }
        const { error } = await register(student);
        if (error) {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: error});
            return;
        }
        toastRef.current.show({severity: 'success', summary: 'Success', detail: 'User created successfully'});
        setStudent({email: '', password: ''});
        navigate('/login');
    };  

    return (
        <>
            {
                sessionStorage.getItem('token') ?
                    <Navigate to='/' />
                    :
                    <div className='registerContainer' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '94dvh' }}>
                        <div className='loginForm' style={{ width: '300px' }}>
                            <h1>Register</h1>
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
                            <Button label='Register' style={{marginTop: '1rem'}} onClick={handleRegister} />
                            <Divider />
                            <Button label='Login' onClick={() => {navigate('/login')}} />
                            </div>
                        </div>
                        <Toast ref={toastRef} /> 
                    </div>
            }   
        </>
    )  
}

export default Register;
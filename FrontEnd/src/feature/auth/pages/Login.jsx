import React, {useState} from 'react';
import { useNavigate, Link } from 'react-router';
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth';

function Login() {

    const {loading, handleLogin, error: authError} = useAuth()
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        
        if(!email || !password){
            setError("Please fill all fields")
            return
        }

        try {
            await handleLogin({email, password})
            navigate("/")
        } catch (err) {
            setError(err.message || "Login failed")
        }
    }

    if(loading) {
        return (<main><div className="loader"></div></main>)
    }   

    return ( 
        <main>
            <div className="form-container">
                <h1>Login</h1>
                {(error || authError) && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error || authError}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e) => { setEmail(e.target.value) }}
                            value={email}
                            type="email" id="email" name="email" placeholder='Enter your Email Id' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={(e)=>{ setPassword(e.target.value)}}
                            value={password}
                            type="password" id="password" name="password" placeholder='Enter Password' required />
                    </div>
                    <button className='button primary-button'>Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link></p>
            </div>
        </main>
    );
}

export default Login;
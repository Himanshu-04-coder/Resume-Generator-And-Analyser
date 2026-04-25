import React,{useState} from 'react';
import "../auth.form.scss"
import { useNavigate,Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';



function Register() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();
    
    const {loading, handleRegister} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        
        if(!username || !email || !password){
            setError("Please fill all fields")
            return
        }

        try {
            await handleRegister({username, email, password})
            navigate("/")
        } catch (err) {
            setError(err.message || "Registration failed")
        }
    }

    if(loading){
        return(<main><div className="loader"></div></main>)
    }
    
    return ( 
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            onChange={(e)=>{ setUsername(e.target.value) }}
                            value={username}
                            type="text" id="username" name="username" placeholder='Enter username' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e)=>{ setEmail(e.target.value) }}
                            value={email}
                            type="email" id="email" name="email" placeholder='Enter your Email Id' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={(e)=>{ setPassword(e.target.value) }}
                            value={password}
                            type="password" id="password" name="password" placeholder='Enter Password' required />
                    </div>
                    <button className='button primary-button'>Register</button>
                </form>
                <p>Already have an account? <Link to={"/login"} >Login</Link></p>
            </div>
        </main>
    );
}

export default Register;
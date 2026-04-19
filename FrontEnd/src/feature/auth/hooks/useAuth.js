import { useContext,useEffect, useState } from "react";
import { register,login,logout,getMe } from "../services/auth.api";
import { AuthContext } from "../auth.context";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context
    const [error, setError] = useState(null)

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register({ username, email, password})
            setUser(data.user)
        } catch (err) {
            setError(err.message)
            console.error("Register error:", err)
        }finally{
            setLoading(false)
        }
    }

    const handleLogin = async ({ email, password}) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password})
            setUser(data.user)
        } catch (err) {
            setError(err.message)
            console.error("Login error:", err)
        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {
            setError(err.message)
            console.error("Logout error:", err)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        const getandSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            }catch (err){
                console.error("GetMe error:", err)
            }
            finally{
                setLoading(false)
            }
        }

        getandSetUser()
    },[])
    
    return {
        user,
        loading,
        error,
        handleLogin,
        handleRegister,
        handleLogout
    }
}
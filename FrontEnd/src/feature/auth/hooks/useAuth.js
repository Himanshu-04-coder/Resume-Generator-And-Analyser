import { useContext,useEffect } from "react";
import { register,login,logout,getMe } from "../services/auth.api";
import { AuthContext } from "../auth.context";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context

    const handleRegister = async ({ username, email, password }) => {
        
        setLoading(true)
        try {
            const data = await register({ username, email, password})
            //user ki info Backend se aayegi
            setUser(data.user)
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    const handleLogin = async ({ email, password}) => {
        setLoading(true)
        try {
            const data = await login({ email, password})
            setUser(data.user)
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        
        const getandSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            }catch (error){}
            finally{
                setLoading(false)
            }
        }

        getandSetUser()
    },[])
    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout
    }
}
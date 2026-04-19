import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function register({username, email, password}){

    // try {
    //     const response = await axios.post("http://localhost:300/api/auth/register",
    //         {username, email, password},
    //     {withCredentials: true})
    // }
    try {
        const response = await api.post("/register",
            {username, email, password})
        return response.data
    }
    catch (error) {
        const message = error.response?.data?.message || error.message || "Registration failed"
        throw new Error(message)
    }
}


export async function login({email, password}){
    try{
        const response = await api.post("/login", 
            {email, password})
        return response.data
    }catch(error){
        const message = error.response?.data?.message || error.message || "Login failed"
        throw new Error(message)
    }
}

export async function logout(){
    try{
        const response = await api.get("/logout")
        return response.data
    }
    catch(error){
        const message = error.response?.data?.message || error.message || "Logout failed"
        throw new Error(message)
    }
}

export async function getMe(){
    try{
        const response = await api.get("/get-me")
        return response.data
    }
    catch(error){
        console.log(error);
    }
}


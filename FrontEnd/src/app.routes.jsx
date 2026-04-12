import { createBrowserRouter } from 'react-router';
import Login from './feature/auth/pages/Login';
import Register from './feature/auth/pages/Register';



export const router = createBrowserRouter([
    {
        path: '/login',     
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]) 

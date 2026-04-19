import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./feature/auth/auth.context"
import { InterviewProvider } from "./feature/interviewReport/interview.context"

function App() {

  
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App

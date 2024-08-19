import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { CreateRoom } from "./pages/create_room"
import { Room } from "./pages/room"
import { Toaster } from "sonner"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/react-query"
import { Login } from "./pages/login"

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />
  },
  {
    path: "/room/:roomId",
    element: <Room />
  },
  {
    path: "login",
    element: <Login />
  }
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <Toaster />
    </QueryClientProvider>
  )
}
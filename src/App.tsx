import AppRoutes from "./routes/AppRouter"
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRoutes/>
      <Toaster
        position="top-right"
        richColors
        expand={true}
      />
    </>
  )
}

export default App
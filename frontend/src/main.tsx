import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/toaster";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Schemes } from "./Schemes.tsx";
import FormEdit from "./FormEdit.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ViewPatient } from "./ViewPatient.tsx";


const router = createBrowserRouter([{
  path: "/",
  element: <App />
},
{
  path: "/schemes",
  element: <Schemes />
},
{
  path: "/edit/:uuid",
  element: <FormEdit />
},
{
  path: "/patient/:patientId",
  element: <ViewPatient />
}])

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
    <Toaster />
  </StrictMode>
);

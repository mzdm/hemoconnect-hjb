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
}])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);

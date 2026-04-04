//import { createBrowserRouter } from "react-router-dom";
import React from "react";
import RequireAuth from "../utils/RequireAuth";
import type { RouteObject } from "react-router-dom";
const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/login"));
const NotFound = React.lazy(() => import("../pages/404"));

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <RequireAuth allowed={true} redirectTo="/login"> <Home /></RequireAuth>
//     },
//     {
//         path: "/login",
//         element: <RequireAuth allowed={false} redirectTo="/"> <Login /></RequireAuth>
//     },
//     {
//         path: "*",
//         element: <NotFound />
//     }
// ])


export const routes: RouteObject[] = [
    {
        path: "/",
        element: <RequireAuth allowed={true} redirectTo="/login"> <Home /></RequireAuth>
    },
    {
        path: "/login",
        element: <RequireAuth allowed={false} redirectTo="/dashboard"> <Login /></RequireAuth>
    },
    {
        path: "*",
        element: <NotFound />
    }
]
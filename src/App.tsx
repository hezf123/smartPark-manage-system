import { RouterProvider } from "react-router-dom"
import { useEffect, useState } from "react"
import { routes } from "./router"
import { generateRoutes } from "./utils/generatesRoutes"
import { useDispatch } from "react-redux"
import { createBrowserRouter } from "react-router-dom"
import { Suspense } from "react"
import { Spin } from "antd"
import { getMenu } from "./api/users"
import { setMenu } from "./store/login/authSlice"
import { useSelector } from "react-redux"
function App() {
  const { token } = useSelector((state: any) => state.authSlice);
  const [routerss, setRouter] = useState<any>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    async function loadData() {
      const { data } = await getMenu();
      if (data.length) {
        dispatch(setMenu(data));
        const myRouters = [...routes];
        const routers = generateRoutes(data);
        myRouters[0].children = routers;
        myRouters[0].children[0].index = true
        const route = createBrowserRouter(myRouters);
        //console.log("111", myRouters);
        setRouter(route);
      } else {
        const route = createBrowserRouter(routes);
        setRouter(route);
      }

    }
    loadData();
  }, [token])
  if (routerss) {
    return (
      <div className="App">
        <Suspense fallback={<Spin></Spin>}>
          <RouterProvider router={routerss}></RouterProvider>
        </Suspense>
      </div>
    );
  } else {
    return <Spin></Spin>
  }
}

export default App

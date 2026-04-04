import { lazy } from "react"
const Dashboard=lazy(()=>import("../pages/dashboard"));
const UserList = lazy(() => import("../pages/user"));
const AddUser = lazy (()=>import("../pages/user/addUser"));
const Tenement =lazy(()=>import("../pages/estate/tenement"));
const Room = lazy(()=>import("../pages/estate/room"));
const Car = lazy(()=>import("../pages/estate/car"))
const Repair=lazy(()=>import("../pages/repair"))
const Contract=lazy(()=>import("../pages/finance/contract"))
const Surrender=lazy(()=>import("../pages/finance/surrender"))
const Bill=lazy(()=>import("../pages/finance/bill"));
const Merchants=lazy(()=>import("../pages/merchants"));
const All=lazy(()=>import("../pages/operation/all"));
const Article=lazy(()=>import("../pages/operation/article"));
const Comments=lazy(()=>import("../pages/operation/comments"));
const Equipment=lazy(()=>import("../pages/equipment"));
const Energy=lazy(()=>import("../pages/energy"));
const Settings = lazy(() => import("../pages/settings"));
const Personal=lazy(()=>import("../pages/personal"))
export const componentMap:any={
    "/dashboard":<Dashboard/>,
    '/users/list': <UserList/>,
    '/users/add': <AddUser/>,
    "/estate/tenement":<Tenement/>,
    "/estate/room":<Room/>,
    "/estate/car":<Car/>,
    "/repair":<Repair/>,
    "/finance/contract":<Contract/>,
    "/finance/surrender":<Surrender/>,
    "/finance/bill":<Bill/>,
    "/merchants":<Merchants/>,
    "/operation/all":<All/>,
    "/operation/article":<Article/>,
    "/operation/comments":<Comments/>,
    "/equipment":<Equipment/>,
    "/energy":<Energy/>,
    "/settings":<Settings/>,
    "/personal":<Personal/>
}
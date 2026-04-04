import type { RouteObject } from "react-router-dom";
import { componentMap } from "../router/routerMap";
interface MenuType {
    icon: string,
    key: string,
    label: string,
    children?: MenuType[]
}
export function generateRoutes(menu: MenuType[]):RouteObject[] {
    return menu.map((item: MenuType) => {
        let routerObj: RouteObject = {
            path: item.key,
            element: componentMap[item.key]
        };
        if (item.children) {
            routerObj.children = generateRoutes(item.children)
        }
        return routerObj
    })
}
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux";
import { Breadcrumb } from 'antd';

interface MenuItem {
    key: string,
    label: string,
    children: MenuItem[]
}

function findBreadCrumbPath(path: string, menuItems: MenuItem[]): string[] {
    const pathSegments: string[] = [];
    function findPath(currentPath: string, items: MenuItem[]) {
        for (const item of items) {
            if (currentPath.startsWith(item.key)) {
                pathSegments.push(item.label);
                if (item.children) {
                    findPath(currentPath, item.children);
                }
                break;
            }
        }
        //console.log(pathSegments);

        return pathSegments
    }
    return findPath(path, menuItems)
}
export default function MyBreadCrumb() {
    const location = useLocation();
    const { menuList } = useSelector((state: any) => state.authSlice);
    const breabList = findBreadCrumbPath(location.pathname, menuList).map(item => ({ title: item }));
    //console.log('bbb', breabList);


    return <div>    <Breadcrumb items={breabList} className="mt mb" /></div>
}
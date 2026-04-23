import icons from './iconList';
import { Menu } from 'antd';
import { useEffect } from 'react';
// import { getMenu } from '../../api/users';
import { useState } from 'react';
import logo from '../../assets/logo.png';
// import { setMenu } from '../../store/login/authSlice';
// import { useDispatch } from 'react-redux';
import './index.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function NaviLeft() {
  const { menuList } = useSelector((state: any) => state.authSlice);
  const [menuData, setMenuData] = useState([]);
  //const dispatch = useDispatch();
  const navigate = useNavigate()
  async function configMenu() {
    //const { data } = await getMenu();
    //dispatch(setMenu(data));
    //console.log(menuList);
    const mappedMenuItems = mapMenuItems(menuList);
    setMenuData(mappedMenuItems);
  }
  const location = useLocation();
  useEffect(() => {
    configMenu();
  }, [])

  //转换菜单数据
  function mapMenuItems(items: any): any {
    return items.map((item: any) => ({
      key: item.key,
      label: item.label,
      icon: icons[item.icon],
      children: item.children ? mapMenuItems(item.children) : null
    }))
  }

  function handleClick({key}: {key: string}) {
    //console.log(key);
    navigate(key)
  }

  return (
    <div className='navLeft'>
      <div className='logo'>
        <img src={logo} alt="" width={18} />
        <h1>智慧园区</h1>
      </div>
      <Menu
        defaultSelectedKeys={['/dashboard']}
        mode="inline"
        theme="dark"
        items={menuData}
        onClick={handleClick}
        selectedKeys={[location.pathname]}
      />
    </div>
  );
}
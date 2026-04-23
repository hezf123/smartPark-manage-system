import logo from "../../assets/logo.png"
import bg from "../../assets/bg.jpg";
import lgbg from "../../assets/lgbg.jpg"
import "./index.scss";
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
//import { useEffect } from "react";
import { login } from "../../api/users";
import { setToken } from "../../store/login/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {

    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleLogin() {
        form.validateFields().then(async (res) => {
            setLoading(true);
            const { data: { token, username, btnAuth } } = await login(res);
            setLoading(false);
            dispatch(setToken(token));
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('btnAuth', JSON.stringify(btnAuth));
            navigate('/', { replace: true })
            //console.log("data是", res);
        }).catch((err) => {
            setLoading(false);
            //console.log(err.message);
            //console.log(err);
        })
    }

    // useEffect(() => {
    //     login({username: "梅竹客", password: "123"})
    //     .then((res) => {
    //         console.log(res);
    //     }).catch((err) => {
    //         console.log("错", err);
    //     })
    // }, [])
    return <div className="login" style={{ backgroundImage: `url(${bg})` }}>
        <div className="lgbg" style={{ backgroundImage: `url(${lgbg})` }}>
            <div className="part">
                <div className="title">
                    <div className="logo">
                        <img src={logo} width={50} />
                    </div>
                    <h1>智慧园区管理平台</h1>
                    <Form className="form" form={form}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '用户名不能为空' }]}
                        >
                            <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '密码不能为空' }]}
                        >
                            <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
                        </Form.Item>


                        <Form.Item label={null}>
                            <Button
                                type="primary"
                                style={{ width: "100%" }}
                                onClick={handleLogin}
                                loading={loading}
                            >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    </div>


}

export default Login
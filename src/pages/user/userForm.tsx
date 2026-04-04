import { Modal, Row, Col, Form, Input, Radio, message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { editUser } from "../../api/userList";
interface FormProps {
    visible: boolean,
    hiddenModal: () => void,
    title: string,
    loadData: () => void
}
export default function UserForm(props: FormProps) {
    const [form] = Form.useForm();
    const { userData } = useSelector((state: any) => state.userSlice);

    const { visible, hiddenModal, title, loadData } = props;
    const handleOk = () => {
        form.validateFields().then(async (res) => {
            const {data} = await editUser(res);
            message.success(data);
            console.log(data);
            hiddenModal();
            loadData();
        })
        .catch((err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        title == "新增企业" ? form.resetFields() : form.setFieldsValue(userData)
    }, [visible])
    return <>
        <Modal
            title={title}
            open={visible}
            onCancel={hiddenModal}
            width={800}
            forceRender
            onOk={handleOk}
        >
            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="客户名称"
                            name="name"
                            rules={[{ required: true, message: "客户名称不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="联系电话"
                            name="tel"
                            rules={[{ required: true, message: "电话不能为空" }, { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的电话" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="经营状态"
                            name="status"
                            rules={[{ required: true, message: "经营状态不能为空" }]}
                        >
                            <Radio.Group
                                options={[
                                    { value: "1", label: "营业中" },
                                    { value: "2", label: "暂停营业" },
                                    { value: "3", label: "已关闭" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="所属行业"
                            name="business"
                            rules={[{ required: true, message: "所属行业不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[{ required: true, message: "邮箱不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="统一信用代码"
                            name="creditCode"
                            rules={[{ required: true, message: "统一信用代码不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="工商注册号"
                            name="industryNum"
                            rules={[{ required: true, message: "工商注册号不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="组织机构代码"
                            name="organizationCode"
                            rules={[{ required: true, message: "组织机构代码不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="法人名"
                            name="legalPerson"
                            rules={[{ required: true, message: "法人名不能为空" }]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
}
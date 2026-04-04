import { Card, Col, Row, Table, Input, Button, message } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { fetchRegistrations, deleteRegistrations, addRegistrations } from "../../api/club";
interface DataType {
    id: number,
    name: string,
    email: string,
    club: string,
    created_at: string,
    operate: any
}

export default function Energy() {
    const columns: TableProps<DataType>["columns"] = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '社团',
            dataIndex: 'club',
            key: 'club',
        },
        {
            title: '报名时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (_, record, index) => {
                return (
                    <>
                        <Button type="primary" size="small">编辑</Button>
                        <Button type="primary" size="small" danger
                            className="ml"
                            onClick={() => handleDelete(record.id)}>删除</Button>
                    </>
                );
            }
        }
    ]
    const [dataList, setDataList] = useState<DataType[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        club: ""
    });
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await fetchRegistrations();
            setDataList(data)
        };
        fetchData();
    }, []);
    const handleDelete = async (id: number) => {
        await deleteRegistrations(id);
        const { data } = await fetchRegistrations();
        setDataList(data);
    };
    const handleAdd = async () => {
        const { name, email, club } = formData;

        if (!name?.trim() || !email?.trim() || !club?.trim()) {
            message.error("信息不全");
            return;
        }

        try {
            await addRegistrations(formData);
            message.success("添加成功");

            setFormData({
                name: "",
                email: "",
                club: "",
            });

            const { data } = await fetchRegistrations();
            setDataList(data);

        } catch (err) {
            console.error("添加失败", err);
        }
    };
    return <div>
        <Card className="search">
            <Row gutter={16}>
                <Col span={6}>
                    <p>姓名：</p>
                    <Input placeholder="请输入姓名"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    ></Input>
                </Col>
                <Col span={6}>
                    <p>邮箱：</p>
                    <Input placeholder="请输入邮箱"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}>

                    </Input>
                </Col>
                <Col span={6}>
                    <p>社团：</p>
                    <Input placeholder="请输入社团"
                        value={formData.club}
                        onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    ></Input>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={handleAdd}>添加</Button>
                </Col>
            </Row>
        </Card>
        <Card className="mt">
            <Table
                columns={columns}
                dataSource={dataList}
                rowKey="id"
            >

            </Table>
        </Card>
    </div>
}
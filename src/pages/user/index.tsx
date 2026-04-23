import { Card, Row, Col, Input, Button, Table, Pagination, Tag, Popconfirm, message } from "antd";
import type { TableProps } from 'antd';
import { useState, useEffect, useMemo, useCallback } from "react";
import type { DataType } from "./interface";
import { batchDeleteUser, deleteUser, getUserList } from "../../api/userList";
import type { PaginationProps } from 'antd';
import UserForm from "./userForm";
import React from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userSlice";
interface searchType {
    companyName: string,
    contact: string,
    phone: string
}
const MyUserForm = React.memo(UserForm);
export default function Users() {
    const [dataList, setDataList] = useState<DataType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageSize, setpageSize] = useState<number>(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isModalOpen, setisModalOpen] = useState(false);
    const [title, setTitle] = useState<string>(" ");

    const dispatch = useDispatch();
    const [formData, setFormData] = useState<searchType>({
        companyName: "",
        contact: "",
        phone: ""
    });
    const disabled = useMemo(() => {
        return selectedRowKeys.length ? false : true;
    }, [selectedRowKeys]);
    const loadData = async () => {
        setLoading(true);
        const { data: { list, total } } = await getUserList({ ...formData, page, pageSize });
        setLoading(false);
        //console.log("列表信息", list);
        setTotal(total);
        setDataList(list)
    }
    useEffect(() => {
        loadData()
    }, [page, pageSize]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const onSelectChange = (selectedRowKeys: React.Key[], selectedRow: any) => {
        setSelectedRowKeys(selectedRowKeys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    }

    const onChange: PaginationProps['onChange'] = (page, pageSize) => {
        //console.log(page, pageSize);
        setPage(page);
        setpageSize(pageSize)
    }
    const reset = () => {
        setSelectedRowKeys([]),
            setFormData({ companyName: "", contact: "", phone: "" }),
            setPage(1),
            setpageSize(10),
            loadData();
    }
    const confirm = async function (id: string) {
        const { data } = await deleteUser(id);
        message.success(data);
        //console.log("删除的是:", data);
        loadData();

    }
    const batchDelete = async () => {
        const { data } = await batchDeleteUser(selectedRowKeys);
        message.success(data);
        loadData();
    }
    const edit = (record: DataType) => {
        setisModalOpen(true);
        setTitle("编辑企业");
        dispatch(setUserData(record))
    }
    const add = () => {
        setisModalOpen(true);
        setTitle("新增企业")
    }

    // const hiddenModal = () => {
    //     setisModalOpen(false);
    // }
    const hiddenModal = useCallback(()=> {
        setisModalOpen(false);
    }, []);
    const columns: TableProps<DataType>['columns'] = [
        {
            title: "No.",
            key: "index",
            render(value, record, index) {
                return index + 1
            },
        },
        {
            title: "客户名称",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "经营状态",
            key: "status",
            dataIndex: "status",
            render(value) {
                if (value == 1) {
                    return <Tag color="green">营业中</Tag>
                } else if (value == 2) {
                    return <Tag color="#f50">暂停经营</Tag>
                } else if (value == 3) {
                    return <Tag color="red">已关闭</Tag>
                }
            }
        },
        {
            title: "联系电话",
            key: "tel",
            dataIndex: "tel"
        },
        {
            title: "所属行业",
            key: "business",
            dataIndex: "business"
        },
        {
            title: "邮箱",
            key: "email",
            dataIndex: "email"
        },
        {
            title: "统一信用代码",
            key: "creditCode",
            dataIndex: "creditCode"
        },
        {
            title: "工商注册号",
            key: "industryNum",
            dataIndex: "industryNum"
        },
        {
            title: "组织结构代码",
            key: "orgnizationCode",
            dataIndex: "organizationCode"
        },
        {
            title: "法人名",
            key: "legalPerson",
            dataIndex: "legalPerson"
        },
        {
            title: "操作",
            key: "operate",
            render(value, record, index) {
                return <>
                    <Button type="primary" size="small" onClick={() => edit(record)}>编辑</Button>
                    <Popconfirm
                        title="删除任务"
                        description="你确定要删除吗？"
                        onConfirm={() => confirm(record.id)}
                        //onCancel={cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="primary" size="small" danger className="ml">删除</Button>
                    </Popconfirm>

                </>
            },
        }
    ];
    return <div className="users">
        <MyUserForm visible={isModalOpen} hiddenModal={hiddenModal} title={title} loadData={loadData}></MyUserForm>
        <Card className="search">
            <Row gutter={16}>
                <Col span={7}>
                    <p>企业名称：</p>
                    <Input name="companyName" value={formData.companyName} onChange={handleChange}></Input>
                </Col>
                <Col span={7}>
                    <p>联系人：</p>
                    <Input name="contact" value={formData.contact} onChange={handleChange}></Input>
                </Col>
                <Col span={7}>
                    <p>联系电话：</p>
                    <Input name="phone" value={formData.phone} onChange={handleChange}></Input></Col>
                <Col span={3}>
                    <Button type="primary" onClick={loadData}>查询</Button>
                    <Button className="ml" onClick={reset}>重置</Button>
                </Col>
            </Row>
        </Card>
        <Card className="mt tr">
            <Button type="primary" onClick={add}>新增企业</Button>
            <Button type="primary" className="ml" disabled={disabled} onClick={batchDelete}>批量删除</Button>
        </Card>
        <Card className="mt">
            <Table columns={columns}
                dataSource={dataList}
                rowKey={(record) => record.id}
                loading={loading}
                rowSelection={rowSelection}
                pagination={false}
            >
            </Table>
            <Pagination
                className="mt"
                total={total}
                current={page}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
                onChange={onChange}
            />
        </Card>
    </div>
}
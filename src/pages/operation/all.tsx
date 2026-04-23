import { useEffect, useState, useMemo } from 'react';  // ✅ 引入 useState
import { Carousel, Card, Tag, Table, Button } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import './all.scss';
import { exportToExcel } from '../../utils/exportToExcel'
import type { TableProps } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function Overview() {

    const columns: TableProps<any>["columns"] = [
        {
            title: "No.",
            key: "index",
            render(value, record, index) {
                return index + 1
            },
            width: 100,
            fixed: "left"
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '学历',
            dataIndex: 'education',
            key: 'education',
        },
        {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        },
        {
            title: '学校',
            dataIndex: 'school_name',
            key: 'school_name',
        },
        {
            title: '优秀',
            dataIndex: 'is_qualified',
            key: 'is_qualified',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
    ];


    // ✅ 1. 声明 state 存储数据
    const [appInfo, setAppInfo] = useState<any>(null)
    const [internInfo, setInternInfo] = useState<any>(null)
    const [university985, setUniversity985] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [selectedRows, setSelectedRows] = useState<any>({ accountNo: "" })
    const header = ["name", "age", 'gender', 'education', 'major', 'school_name', 'is_qualified', 'remark']
    const disabled = useMemo(() => {
        return selectedRowKeys.length ? false : true
    }, [selectedRowKeys])
    const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
        //console.log(selectedRows)
        setSelectedRowKeys(selectedRowKeys)
        setSelectedRows(selectedRows)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true
    }
    const batchCancel = async (selectedRows: any) => {
        //console.log(selectedRows)
        setSelectedRowKeys([]);
    }
    useEffect(() => {
        const fetchTableData = async (url: string) => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    const errorText = await response.text()
                    //console.error(response.status, errorText)
                    return null
                }
                const result = await response.json()
                return result
            } catch (error) {
                //console.error(0, error)
                return null
            }
        }

        const loadData = async () => {
            setLoading(true)
            // ✅ 2. 请求数据并存入 state
            const appResult = await fetchTableData('http://localhost:3001/api/app-info')
            const internResult = await fetchTableData('http://localhost:3001/api/intern-info')
            const uniResult = await fetchTableData('http://localhost:3001/api/university-985')

            setAppInfo(appResult?.data || null)
            setInternInfo(internResult?.data || null)
            setUniversity985(uniResult?.data || null)

            // console.log('appInfo:', appResult?.data)
            // console.log('internInfo:', internResult?.data)
            // console.log('university985:', uniResult?.data)
            setLoading(false)
        }

        loadData()
    }, [])

    //const cardData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    //console.log('appInfo:', appInfo)


    if (loading) {
        return <div>加载中...</div>
    }

    return (
        <div className="carousel-container">

            <Card title="高校列表">
                <Carousel
                    arrows={true}
                    infinite={false}
                    draggable={false}
                    slidesToShow={5}
                    slidesToScroll={5}
                >
                    {university985.map((item: any) => (
                        <div key={item} className="card-wrapper">
                            <Card
                                style={{ width: 300 }}
                                cover={
                                    <img
                                        draggable={false}
                                        alt="example"
                                        src={item.logo_url}
                                        style={{ height: "180px", width: "180px", padding: "10px", margin: "0 auto" }}
                                        referrerPolicy="no-referrer"
                                    />
                                }
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    title={`高校名称: ${item.name}`}
                                    description={
                                        <div>
                                            <div>高校位置: {item.location}</div>
                                            <div>高校参与人数: {item.participant_count}</div>
                                        </div>
                                    }
                                />
                            </Card>
                        </div>
                    ))}
                </Carousel>
            </Card>
            <Card title="应用问题" className='mt'>
                <Carousel
                    arrows={true}
                    infinite={false}
                    draggable={false}
                    slidesToShow={5}
                    slidesToScroll={5}
                >
                    {appInfo.map((item: any) => (
                        <div key={item.id} className="card-wrapper">
                            <Card
                                style={{ width: 300 }}
                            >
                                <Meta
                                    title={
                                        <div>
                                            <div>
                                                应用名称: {item.app_name}
                                                <Tag className='ml' style={{ color: item.is_closed ? "green" : "red" }}>{item.is_closed ? '已闭环' : '未闭环'}</Tag>
                                            </div>

                                        </div>}
                                    description={
                                        <div>
                                            <div>问题总数: {item.total_questions}</div>
                                            <div>已解决数: {item.solved_questions}</div>
                                        </div>
                                    }
                                />
                            </Card>
                        </div>
                    ))}
                </Carousel>
            </Card>
            <Card title="实习生列表" className='mt'>
                <Button type="primary" icon={<DownloadOutlined />}
                    disabled={disabled}
                    onClick={() => exportToExcel(selectedRows, header)}
                >
                    导出为Excel</Button>
                <Button icon={<DeleteOutlined />}
                    danger className="ml" type="primary"
                    onClick={() => batchCancel(selectedRows)}
                    disabled={disabled}
                >
                    批量作废</Button>
                <Table
                    dataSource={internInfo}
                    columns={columns}
                    rowKey="id"
                    rowSelection={rowSelection}
                    style={{ marginTop: "20px" }}
                >

                </Table>
            </Card>
        </div>
    )
}
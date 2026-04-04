import { Carousel, Card, Row, Col,Statistic } from "antd"
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import pic1 from "../../assets/1.jpg"
import pic2 from "../../assets/2.jpg"
import pic3 from "../../assets/3.jpg"
import { Avatar } from 'antd';

const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];
function Merchants() {
    return <div>
        <Card>
            <div style={{ width: "1200px", margin: "auto" }}>
                <Carousel autoplay arrows>
                    <div>
                        <img src={pic1} />
                    </div>
                    <div>
                        <img src={pic2} />
                    </div>
                    <div>
                        <img src={pic3} />
                    </div>
                </Carousel>
            </div>
        </Card>
        
            <Row gutter={16} className="mt">
                <Col span={12}>
                    <Card>

                    </Card>

                </Col>
                <Col span={12}>
                <Card>
                    <Statistic
                        title="新签客户"
                        value={11.28}
                        precision={2}
                        style={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                    <Statistic
                        title="续签客户"
                        value={9.3}
                        precision={2}
                        style={{ color: '#cf1322' }}
                        prefix={<ArrowDownOutlined />}
                        suffix="%"
                    />
                    <Statistic
                        title="退租客户"
                        value={5.16}
                        precision={2}
                        style={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                    <Statistic
                        title="意向客户"
                        value={13.3}
                        precision={2}
                        style={{ color: '#cf1322' }}
                        prefix={<ArrowDownOutlined />}
                        suffix="%"
                    />
                </Card>
                </Col>
            </Row>
       
    </div>
}

export default Merchants
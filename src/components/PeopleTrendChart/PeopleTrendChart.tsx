// components/PeopleTrendChart.tsx
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

// 手写防抖函数
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): T & { cancel: () => void } {
    let timer: ReturnType<typeof setTimeout> | null = null

    const debounced = function (this: any, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null
        }, delay)
    } as T & { cancel: () => void }

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    return debounced
}

// 组件 Props 类型
interface PeopleTrendChartProps {
    apiUrl: string              // 后端接口地址，如 'http://localhost:3001/api/people-trend'
    defaultYear?: number        // 默认年份，默认 2026
    defaultType?: 'week' | 'month' | 'quarter'  // 默认类型，默认 'month'
    height?: number | string    // 图表高度，默认 400
    debounceDelay?: number      // 防抖延迟时间（毫秒），默认 500
}

export default function PeopleTrendChart({
    apiUrl,
    defaultYear = 2026,
    defaultType = 'month',
    height = 400,
    debounceDelay = 500
}: PeopleTrendChartProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const chartInstance = useRef<echarts.ECharts | null>(null)
    const [year, setYear] = useState(defaultYear)
    const [type, setType] = useState(defaultType)
    const [loading, setLoading] = useState(false)

    // 请求数据的函数
    const fetchData = async (yearVal: number, typeVal: string) => {
        try {
            const url = `${apiUrl}?year=${yearVal}&type=${typeVal}`
            console.log('📡 发起请求:', url)
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('请求失败:', error)
            return null
        }
    }

    // 更新图表数据
    const updateChartData = async (yearVal: number, typeVal: string) => {
        if (!chartInstance.current) return

        setLoading(true)
        const data = await fetchData(yearVal, typeVal)
        setLoading(false)

        if (data && chartInstance.current) {
            chartInstance.current.setOption({
                xAxis: { data: data.xAxis },
                series: [{ data: data.series }]
            })
        }
    }

    // 防抖更新
    const debouncedUpdate = useRef(
        debounce((yearVal: number, typeVal: string) => {
            console.log('🎯 防抖触发，执行切换请求')
            updateChartData(yearVal, typeVal)
        }, debounceDelay)
    ).current

    // 切换年份
    const handleYearChange = (newYear: number) => {
        setYear(newYear)
        debouncedUpdate(newYear, type)
    }

    // 切换类型
    const handleTypeChange = (newType: 'week' | 'month' | 'quarter') => {
        setType(newType)
        debouncedUpdate(year, newType)
    }

    // 初始化图表
    useEffect(() => {
        if (!chartRef.current) return

        chartInstance.current = echarts.init(chartRef.current)

        const initData = async () => {
            const data = await fetchData(year, type)
            if (data && chartInstance.current) {
                chartInstance.current.setOption({
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category', data: data.xAxis },
                    yAxis: { type: 'value', name: '人力投入' },
                    dataZoom: [{ type: 'slider', start: 0, end: 100 }],
                    series: [{ type: 'line', data: data.series, smooth: true }]
                })
            }
        }
        initData()

        const handleResize = () => chartInstance.current?.resize()
        window.addEventListener('resize', handleResize)

        // ⭐ 清理函数：组件卸载时执行
        return () => {
            window.removeEventListener('resize', handleResize)
            debouncedUpdate?.cancel()  // 取消防抖
            if (chartInstance.current) {
                chartInstance.current.dispose()  // 销毁图表
                chartInstance.current = null
            }
        }
    }, [])  // 空依赖，只初始化一次

    // 年份范围选择器（可配置）
    const yearOptions = [2022, 2023, 2024, 2025, 2026, 2027]

    return (
        <div style={{ padding: 20 }}>
            {/* 控制栏 */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontWeight: 500 }}>选择年份：</label>
                <select
                    value={year}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d9d9d9', cursor: 'pointer' }}
                >
                    {yearOptions.map(y => (
                        <option key={y} value={y}>{y}年</option>
                    ))}
                </select>

                <div style={{ marginLeft: 8, display: 'flex', gap: 8 }}>
                    {(['week', 'month', 'quarter'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => handleTypeChange(t)}
                            style={{
                                padding: '6px 16px',
                                background: type === t ? '#4096ff' : 'white',
                                color: type === t ? 'white' : '#333',
                                border: '1px solid #d9d9d9',
                                borderRadius: 6,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t === 'week' && '📅 按周'}
                            {t === 'month' && '📆 按月'}
                            {t === 'quarter' && '📊 按季度'}
                        </button>
                    ))}
                </div>

                {loading && <span style={{ marginLeft: 16, color: '#4096ff' }}>加载中...</span>}
            </div>

            {/* 图表容器 */}
            <div ref={chartRef} style={{ width: '100%', height }} />
        </div>
    )
}
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button, Card, Input, Spin, Typography, message as antdMessage } from "antd"

type ChatRole = "user" | "assistant"

interface ChatMessage {
    id: string
    role: ChatRole
    content: string
    timestamp: number
}

interface ChatApiResponse {
    code: number
    data: {
        reply: string
    } | null
    msg: string
}

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

const STORAGE_KEY = "operation-ai-chat-history"
const MAX_INPUT_LENGTH = 1000
const { TextArea } = Input

// 对话页面局部错误边界，避免单组件异常影响整个页面
class ChatErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch() {
        antdMessage.error("对话组件发生异常，请刷新页面重试")
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card>
                    <Typography.Text type="danger">对话组件异常，请刷新页面后重试。</Typography.Text>
                </Card>
            )
        }
        return this.props.children
    }
}

function buildId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// 统一格式化时间戳，便于消息项展示
function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleString("zh-CN", { hour12: false })
}

// 首次加载时恢复会话，保证刷新后对话仍可继续
function readStoredMessages() {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
        return [] as ChatMessage[]
    }
    try {
        const parsed = JSON.parse(raw) as ChatMessage[]
        if (!Array.isArray(parsed)) {
            return []
        }
        return parsed.filter((item) => item && typeof item.content === "string" && (item.role === "user" || item.role === "assistant"))
    } catch {
        return []
    }
}

function ContentInner() {
    // 输入框内容、消息列表、发送状态
    const [inputValue, setInputValue] = useState("")
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => readStoredMessages())
    const [sending, setSending] = useState(false)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    // 支持通过环境变量切换后端地址，便于多环境部署
    const apiUrl = useMemo(() => {
        return import.meta.env.VITE_AI_CHAT_API_URL || "http://localhost:3001/api/ai/chat"
    }, [])

    // 任意消息变更都持久化到当前浏览器会话
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatMessages))
    }, [chatMessages])

    // 新消息或发送状态变化时自动滚动到底部
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [chatMessages, sending])

    // 清空历史同时清理会话缓存
    const clearHistory = () => {
        setChatMessages([])
        sessionStorage.removeItem(STORAGE_KEY)
        antdMessage.success("已清空对话历史")
    }

    const patchAssistantMessage = (targetId: string, updater: (oldContent: string) => string) => {
        setChatMessages((prev) =>
            prev.map((item) => {
                if (item.id !== targetId) {
                    return item
                }
                return {
                    ...item,
                    content: updater(item.content)
                }
            })
        )
    }

    // 发送消息主流程：校验 -> 本地追加 -> 请求后端 -> 追加AI回复
    const sendMessage = async () => {
        const content = inputValue.trim()
        if (!content) {
            antdMessage.warning("请输入内容后再发送")
            return
        }
        if (content.length > MAX_INPUT_LENGTH) {
            antdMessage.warning(`单次输入不能超过${MAX_INPUT_LENGTH}字`)
            return
        }
        if (sending) {
            return
        }

        const userMessage: ChatMessage = {
            id: buildId(),
            role: "user",
            content,
            timestamp: Date.now()
        }

        // 将最新上下文一起发送给后端，以保持连续对话能力
        const nextMessages = [...chatMessages, userMessage]
        const assistantId = buildId()
        const assistantPlaceholder: ChatMessage = {
            id: assistantId,
            role: "assistant",
            content: "",
            timestamp: Date.now()
        }
        setChatMessages([...nextMessages, assistantPlaceholder])
        setInputValue("")
        setSending(true)

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMessages.map((item) => ({
                        role: item.role,
                        content: item.content
                    }))
                })
            })
            if (!response.ok) {
                let errMsg = "AI服务调用失败"
                try {
                    const result = await response.json() as ChatApiResponse
                    errMsg = result.msg || errMsg
                } catch {
                    errMsg = `请求失败，状态码: ${response.status}`
                }
                throw new Error(errMsg)
            }

            //console.log(response.body);
            
            if (!response.body) {
                throw new Error("浏览器不支持流式响应")
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            let buffer = ""
            let streamedReply = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }

                //- buffer += decoder.decode(value, { stream: true }) ：
                // 把本次 reader.read() 读到的二进制片段解码成字符串，并追加到
                //  buffer ； stream: true 表示按流式解码，避免多字节字符被截
                // 断时乱码。
                //- const eventBlocks = buffer.split("\n\n") ：按 SSE 事
                // 件分隔符（空行）切成多个“完整或半完整事件块”。
                //- buffer = eventBlocks.pop() || "" ：把最后一段取出来留回
                //  buffer ，因为它可能是不完整事件，等下一次 chunk 到来再继续拼接。
                buffer += decoder.decode(value, { stream: true })
                const eventBlocks = buffer.split("\n\n")
                buffer = eventBlocks.pop() || ""

                for (const block of eventBlocks) {
                    const line = block
                        .split("\n")
                        .find((part) => part.startsWith("data:"))

                    if (!line) {
                        continue
                    }

                    const payloadText = line.replace(/^data:\s*/, "")
                    let payload: { type: string; content?: string; msg?: string } | null = null
                    try {
                        payload = JSON.parse(payloadText)
                    } catch {
                        payload = null
                    }

                    if (!payload) {
                        continue
                    }

                    if (payload.type === "token" && payload.content) {
                        streamedReply += payload.content
                        patchAssistantMessage(assistantId, (oldContent) => oldContent + payload.content!)
                    }

                    if (payload.type === "error") {
                        throw new Error(payload.msg || "AI服务异常")
                    }
                }
            }

            if (!streamedReply) {
                throw new Error("未获取到有效回复")
            }

            // 原非流式逻辑（保留对比）
            // const result = await response.json() as ChatApiResponse
            // const reply = result.data?.reply
            // if (!response.ok || result.code !== 0 || !reply) {
            //     throw new Error(result.msg || "AI服务调用失败")
            // }
            // setChatMessages((prev) => [
            //     ...prev,
            //     {
            //         id: buildId(),
            //         role: "assistant",
            //         content: reply,
            //         timestamp: Date.now()
            //     }
            // ])
        } catch (error) {
            patchAssistantMessage(assistantId, (oldContent) =>
                oldContent || "抱歉，当前服务繁忙，请稍后重试。"
            )
            antdMessage.error(error instanceof Error ? error.message : "请求失败，请稍后重试")
        } finally {
            setSending(false)
        }
    }

    return (
        <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
            <Card
                title="AI 对话助手"
                extra={<Button onClick={clearHistory} disabled={sending || chatMessages.length === 0}>清空历史</Button>}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ display: "flex", flexDirection: "column", minHeight: 560 }}>
                    <div style={{ flex: 1, maxHeight: "62vh", overflowY: "auto", padding: "16px", background: "#fafafa" }}>
                        {chatMessages.length === 0 ? (
                            <Typography.Text type="secondary">请输入问题开始对话</Typography.Text>
                        ) : (
                            chatMessages.map((item) => (
                                <div key={item.id} style={{ display: "flex", justifyContent: item.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                                    <div
                                        style={{
                                            maxWidth: "82%",
                                            borderRadius: 10,
                                            padding: "10px 12px",
                                            background: item.role === "user" ? "#1677ff" : "#ffffff",
                                            color: item.role === "user" ? "#ffffff" : "#1f1f1f",
                                            border: item.role === "user" ? "none" : "1px solid #f0f0f0",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}>{item.content}</div>
                                        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>{formatTime(item.timestamp)}</div>
                                    </div>
                                </div>
                            ))
                        )}

                        {sending && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8c8c8c" }}>
                                <Spin size="small" />
                                <span>AI 正在思考...</span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 16px" }}>
                        <TextArea
                            value={inputValue}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            maxLength={MAX_INPUT_LENGTH}
                            showCount
                            placeholder="请输入问题，Enter 发送，Shift + Enter 换行"
                            onChange={(e) => setInputValue(e.target.value)}
                            // Enter 发送，Shift + Enter 换行
                            onPressEnter={(e) => {
                                if (!e.shiftKey) {
                                    e.preventDefault()
                                    void sendMessage()
                                }
                            }}
                            disabled={sending}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                            <Button type="primary" onClick={() => void sendMessage()} loading={sending}>
                                发送
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default function Content() {
    return (
        <ChatErrorBoundary>
            <ContentInner />
        </ChatErrorBoundary>
    )
}

import {
  BellOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Badge, Popover, List, Button, Typography, Space, Empty, Spin } from 'antd'
import React, { useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const { Text } = Typography

const NOTIFICATION_URL = 'http://localhost:5002'

export default function NotificationBell({ userId, appId = 'umbra-vault' }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // 1. Fetch initial unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(
        `${NOTIFICATION_URL}/api/v1/notifications/unread-count?userId=${userId}&appId=${appId}`
      )
      const data = await res.json()
      if (data?.data?.unreadCount !== undefined) {
        setUnreadCount(data.data.unreadCount)
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }, [userId, appId])

  // 2. Fetch notifications list
  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(
        `${NOTIFICATION_URL}/api/v1/notifications?userId=${userId}&appId=${appId}&page=1&limit=15`
      )
      const data = await res.json()
      if (data?.data?.items) {
        setNotifications(data.data.items)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, appId])

  // 3. Mark single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`${NOTIFICATION_URL}/api/v1/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      setNotifications((prev) =>
        prev.map((item) => (item._id === notificationId ? { ...item, isRead: true } : item))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  // 4. Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await fetch(`${NOTIFICATION_URL}/api/v1/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, appId }),
      })
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  // 5. Connect to Socket.IO & listen for realtime events
  useEffect(() => {
    if (!userId) return

    fetchUnreadCount()

    const socket = io(NOTIFICATION_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      socket.emit('join:user', String(userId))
    })

    // Listen for incoming notifications pushed by notification.service.js
    socket.on('notification:new', (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev])
    })

    // Listen for unread badge changes
    socket.on('notification:badge_update', ({ unreadCount: count }) => {
      setUnreadCount(count)
    })

    return () => {
      socket.disconnect()
    }
  }, [userId, fetchUnreadCount])

  // Refresh list when popover is toggled open
  const handleOpenChange = (visible) => {
    setOpen(visible)
    if (visible) {
      fetchNotifications()
    }
  }

  const popoverContent = (
    <div style={{ width: 340, maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 8,
          borderBottom: '1px solid var(--color-border-default, #eee)',
          marginBottom: 8,
        }}
      >
        <Text strong>Notifications</Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={handleMarkAllRead}
            style={{ padding: 0 }}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 340, paddingRight: 4 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        ) : notifications.length === 0 ? (
          <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  marginBottom: 4,
                  background: item.isRead
                    ? 'transparent'
                    : 'var(--color-bg-subtle, rgba(0, 122, 255, 0.08))',
                  cursor: item.isRead ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => !item.isRead && handleMarkAsRead(item._id)}
                extra={
                  !item.isRead && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined style={{ fontSize: 12 }} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(item._id)
                      }}
                    />
                  )
                }
              >
                <List.Item.Meta
                  title={
                    <Space orientation="horizontal" size={6}>
                      {!item.isRead && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#1890ff',
                          }}
                        />
                      )}
                      <Text strong style={{ fontSize: 13 }}>
                        {item.title}
                      </Text>
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary, #666)' }}>
                        {item.message}
                      </div>
                      <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  )

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
    >
      <button
        aria-label="Notifications"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: '1px solid var(--color-border-default)',
          background: 'var(--toggle-bg)',
          color: 'var(--toggle-icon-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 16,
          position: 'relative',
        }}
      >
        <Badge count={unreadCount} overflowCount={99} size="small" offset={[2, -2]}>
          <BellOutlined style={{ fontSize: 16, color: 'inherit' }} />
        </Badge>
      </button>
    </Popover>
  )
}

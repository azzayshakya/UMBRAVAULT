import {
  CheckCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import ReusableAntdTag from '@devStack/components/AntdTag/ReusableAntdTag'
import PageHeader from '@devStack/components/PageHeader'
import CrudTable from '@devStack/components/table/CrudTable'
import { ROLE_BADGE_CONFIG } from '@devStack/enums/user-role-enums'
import { Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import ChangeRoleModal from './components/ChangeRoleModal'
import { useUserManagementApi } from './hooks/useUserManagementApi'
import { useIsMobile } from '@devStack/utils/useIsMobile'

const actionBtnStyle = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--term-border)',
  borderRadius: 5,
  background: 'transparent',
  color: 'var(--term-green)',
  cursor: 'pointer',
}

const UserManagementPage = () => {
  const { users = [], loading, refetch } = useUserManagementApi()
  const [search, setSearch] = useState('')
  const [activeUser, setActiveUser] = useState(null)
  const [paramObj, setParamObj] = useState({ limit: 10, offset: 0, total: 0 })

  const isMobile = useIsMobile() // 👈 Track mobile screen state

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    const query = search.toLowerCase()
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.id?.toString().toLowerCase().includes(query)
    )
  }, [users, search])

  useEffect(() => {
    setParamObj((prev) => (prev.offset === 0 ? prev : { ...prev, offset: 0 }))
  }, [search])

  const columns = [
    {
      title: 'USER ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
    {
      title: ':USERNAME',
      dataIndex: 'username',
      key: 'username',
      width: 140,
      render: (v) => <span style={{ color: 'var(--term-green)' }}>{v}</span>,
    },
    {
      title: ':NAME',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      render: (v) => <span style={{ color: 'var(--term-green)' }}>{v}</span>,
    },
    {
      title: ':EMAIL',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
    {
      title: ':ROLE',
      dataIndex: 'role',
      key: 'role',
      width: 130,
      render: (v) => <ReusableAntdTag config={ROLE_BADGE_CONFIG} status={v} />,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 90,
      fixed: isMobile ? false : 'right', // Freeze actions column on larger viewports
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={actionBtnStyle} onClick={() => {}}>
            <EyeOutlined style={{ fontSize: 12 }} />
          </button>
          <button style={actionBtnStyle} onClick={() => setActiveUser(record)}>
            <MoreOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ fontFamily: 'var(--term-font)' }}>
      <PageHeader
        title="USER MANAGEMENT"
        titleStyle={{ letterSpacing: 2 }}
        subtitle="Manage system users and their roles"
      />

      <div
        style={{
          border: '1px solid var(--term-border)',
          borderRadius: 10,
          padding: isMobile ? 12 : 20, // Scaled down padding for mobile
          background: 'rgba(6, 18, 10, 0.4)',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 10,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--term-green-dim)' }} />}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: isMobile ? '100%' : 220,
              background: 'rgba(6, 18, 10, 0.6)',
              border: '1px solid var(--term-border)',
              color: 'var(--term-text)',
            }}
          />
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '0 14px',
              border: '1px solid var(--term-border)',
              borderRadius: 6,
              background: 'transparent',
              color: 'var(--term-green)',
              fontFamily: 'var(--term-font)',
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto',
              height: isMobile ? 36 : 'auto',
            }}
          >
            <FilterOutlined /> FILTER
          </button>
        </div>

        {/* Scroll wrapper for CrudTable */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <CrudTable
            tableData={filteredUsers}
            columns={columns}
            loading={loading}
            paramObj={paramObj}
            setParamObj={setParamObj}
            setRefreshCounter={() => {}}
            scroll={{ x: 800 }} // 👈 Enables horizontal scroll bounds cleanly on mobile
          />
        </div>
      </div>

      <ChangeRoleModal
        open={!!activeUser}
        user={activeUser}
        onClose={() => setActiveUser(null)}
        onRoleChanged={refetch}
      />
    </div>
  )
}

export default UserManagementPage

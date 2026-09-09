import {
  ClearOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import ReusableAntdTag from '@devStack/components/AntdTag/ReusableAntdTag'
import PageHeader from '@devStack/components/PageHeader'
import CrudTable from '@devStack/components/table/CrudTable'
import { ROLE_BADGE_CONFIG } from '@devStack/enums/user-role-enums'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import ChangeRoleModal from './components/ChangeRoleModal'
import { useUserManagementApi } from './hooks/useUserManagementApi'

const actionBtnStyle = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #d1fae5',
  borderRadius: 6,
  background: '#f0fdf4',
  color: '#059669',
  cursor: 'pointer',
}

const UserManagementPage = () => {
  const { users = [], loading, refetch } = useUserManagementApi()
  const [search, setSearch] = useState('')
  const [activeUser, setActiveUser] = useState(null)
  const [paramObj, setParamObj] = useState({ limit: 10, offset: 0, total: 0 })

  const isMobile = useIsMobile()

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    const query = search.toLowerCase()
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u._id?.toString().toLowerCase().includes(query) ||
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
      width: 110,
      render: (v) => (
        <span style={{ color: '#059669', fontWeight: 600 }}>
          #{v ? v.slice(-6).toUpperCase() : '—'}
        </span>
      ),
    },
    {
      title: ':USERNAME',
      dataIndex: 'username',
      key: 'username',
      width: 140,
      render: (v) => <span style={{ color: '#065f46', fontWeight: 700 }}>{v}</span>,
    },
    {
      title: ':NAME',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (v) => <span style={{ color: '#065f46', fontWeight: 600 }}>{v}</span>,
    },
    {
      title: ':EMAIL',
      dataIndex: 'email',
      key: 'email',
      width: 210,
      render: (v) => <span style={{ color: '#475569', fontSize: 12 }}>{v}</span>,
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
      fixed: isMobile ? false : 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={actionBtnStyle} onClick={() => {}} title="View User">
            <EyeOutlined style={{ fontSize: 12 }} />
          </button>
          <button style={actionBtnStyle} onClick={() => setActiveUser(record)} title="Edit Role">
            <MoreOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <PageHeader
      title="USER MANAGEMENT"
      subtitle="root@auth:~# cat /etc/passwd | grep -E 'users|roles'"
      icon={<TeamOutlined />}
    >
      {/* Table & Filtering Shell */}
      <div
        style={{
          border: '1.5px solid #d1fae5',
          borderRadius: 16,
          padding: isMobile ? 14 : 20,
          background: '#ffffff',
        }}
      >
        {/* Table Controls Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              color: '#065f46',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.2,
            }}
          >
            USERS // DIRECTORY VIEW
          </span>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: '#059669' }} />}
              placeholder="Search users..."
              value={search}
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: isMobile ? '100%' : 240,
                borderRadius: 8,
                borderColor: '#a7f3d0',
                fontFamily: 'var(--term-font, monospace)',
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  border: '1px solid #a7f3d0',
                  background: '#f0fdf4',
                  color: '#047857',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ClearOutlined /> CLEAR
              </button>
            )}

            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 16px',
                border: '1.5px solid #10b981',
                borderRadius: 8,
                background: '#ecfdf5',
                color: '#047857',
                fontFamily: 'var(--term-font, monospace)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
                width: isMobile ? '100%' : 'auto',
                height: isMobile ? 38 : 'auto',
              }}
            >
              <FilterOutlined /> FILTER
            </button>
          </div>
        </div>

        {/* Scroll wrapper for CrudTable */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <CrudTable
            tableData={filteredUsers}
            columns={columns}
            loading={loading}
            paramObj={{ ...paramObj, total: filteredUsers.length }}
            setParamObj={setParamObj}
            setRefreshCounter={refetch}
            scroll={{ x: 800 }}
          />
        </div>
      </div>

      {/* Role Modification Modal */}
      <ChangeRoleModal
        open={!!activeUser}
        user={activeUser}
        onClose={() => setActiveUser(null)}
        onRoleChanged={refetch}
      />
    </PageHeader>
  )
}

export default UserManagementPage

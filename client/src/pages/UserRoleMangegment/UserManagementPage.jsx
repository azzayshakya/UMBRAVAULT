import { EyeOutlined, MoreOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import ReusableAntdTag from '@devStack/components/AntdTag/ReusableAntdTag'
import PageHeader from '@devStack/components/PageHeader'
import CrudTable from '@devStack/components/table/CrudTable'
import { ROLE_BADGE_CONFIG } from '@devStack/enums/user-role-enums'
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
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
    {
      title: ':USERNAME',
      dataIndex: 'username',
      key: 'username',
      render: (v) => <span style={{ color: 'var(--term-green)' }}>{v}</span>,
    },
    {
      title: ':NAME',
      dataIndex: 'name',
      key: 'name',
      render: (v) => <span style={{ color: 'var(--term-green)' }}>{v}</span>,
    },
    {
      title: ':EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
    {
      title: ':ROLE',
      dataIndex: 'role',
      key: 'role',
      render: (v) => <ReusableAntdTag config={ROLE_BADGE_CONFIG} status={v} />,
    },
    // {
    //   title: ':LAST LOGIN',
    //   dataIndex: 'lastLogin',
    //   key: 'lastLogin',
    //   render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    // },
    {
      title: 'ACTIONS',
      key: 'actions',
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
          padding: 20,
          background: 'rgba(6, 18, 10, 0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--term-green-dim)' }} />}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: 220,
              background: 'rgba(6, 18, 10, 0.6)',
              border: '1px solid var(--term-border)',
              color: 'var(--term-text)',
            }}
          />
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
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
            }}
          >
            <FilterOutlined /> FILTER
          </button>
        </div>

        <div>
          <CrudTable
            tableData={filteredUsers}
            columns={columns}
            loading={loading}
            paramObj={paramObj}
            setParamObj={setParamObj}
            setRefreshCounter={() => {}}
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

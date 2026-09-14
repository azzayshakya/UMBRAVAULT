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
import { Theme } from '@devStack/constants/theme-constants'
import { ROLE_BADGE_CONFIG } from '@devStack/enums/user-role-enums'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import ChangeRoleModal from './components/ChangeRoleModal'
import { useUserManagementApi } from './hooks/useUserManagementApi'

const UserManagementPage = () => {
  const { users = [], loading, refetch } = useUserManagementApi()
  const [search, setSearch] = useState('')
  const [activeUser, setActiveUser] = useState(null)
  const [paramObj, setParamObj] = useState({ limit: 10, offset: 0, total: 0 })

  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK
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

  const handleSearchChange = (value) => {
    setSearch(value)
    setParamObj((prev) => (prev.offset === 0 ? prev : { ...prev, offset: 0 }))
  }

  const actionBtnStyle = {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm, 6px)',
    background: isDark ? 'rgba(57, 255, 106, 0.06)' : 'var(--color-bg-hover)',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }

  const columns = [
    {
      title: 'USER ID',
      dataIndex: '_id',
      key: '_id',
      width: 110,
      render: (v) => (
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          #{v ? v.slice(-6).toUpperCase() : '—'}
        </span>
      ),
    },
    {
      title: ':USERNAME',
      dataIndex: 'username',
      key: 'username',
      width: 140,
      render: (v) => <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{v}</span>,
    },
    {
      title: ':NAME',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (v) => <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{v}</span>,
    },
    {
      title: ':EMAIL',
      dataIndex: 'email',
      key: 'email',
      width: 210,
      render: (v) => (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{v}</span>
      ),
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
          <button
            style={actionBtnStyle}
            onClick={() => {}}
            title="View User"
            aria-label="View User"
          >
            <EyeOutlined style={{ fontSize: 12 }} />
          </button>
          <button
            style={actionBtnStyle}
            onClick={() => setActiveUser(record)}
            title="Edit Role"
            aria-label="Edit Role"
          >
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
          border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
          borderRadius: 'var(--term-radius, 10px)',
          padding: isMobile ? 14 : 20,
          background: 'var(--color-bg-container)',
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.02)',
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
              color: 'var(--color-primary)',
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
              prefix={
                <SearchOutlined
                  style={{ color: isDark ? 'var(--term-green)' : 'var(--color-primary)' }}
                />
              }
              placeholder="Search users..."
              value={search}
              allowClear
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                width: isMobile ? '100%' : 240,
                borderRadius: 'var(--radius, 8px)',
                border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
                background: 'var(--color-bg-container)',
                color: 'var(--color-text)',
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
                  border: isDark
                    ? '1px solid var(--color-border-secondary)'
                    : '1px solid var(--color-border)',
                  background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-bg-hover)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius, 8px)',
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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
                border: isDark ? '1px solid var(--term-border)' : '1px solid rgba(6, 95, 70, 0.25)',
                borderRadius: 'var(--radius, 8px)',
                background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.45)',
                color: isDark ? 'var(--term-green)' : '#065f46',
                fontFamily: 'var(--term-font, monospace)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                width: isMobile ? '100%' : 'auto',
                height: isMobile ? 38 : 'auto',
                transition: 'all 0.15s ease',
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

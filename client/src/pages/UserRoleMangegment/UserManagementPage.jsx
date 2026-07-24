import { EyeOutlined, MoreOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import CrudTable from '@devStack/components/table/CrudTable'
import { Input } from 'antd'
import { useMemo, useState } from 'react'

import { RoleBadge, StatusBadge } from './components/Badges'
import ChangeRoleModal from './components/ChangeRoleModal'
import { useUsers } from './utils/useUsers'
import { useGetAllUsers } from './hooks/useUserManagementApi'

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
  const { users, loading, refetch } = useGetAllUsers()
  const [search, setSearch] = useState('')
  const [paramObj, setParamObj] = useState({ limit: 10, offset: 0, total: 0 })
  const [, setRefreshCounter] = useState(0)
  const [activeUser, setActiveUser] = useState(null)

  const columns = [
    {
      title: 'USER ID',
      dataIndex: 'id',
      key: 'id',
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
    {
      title: ':USERNAME',
      dataIndex: 'username',
      key: 'username',
      render: (v) => <span style={{ color: 'var(--term-green)' }}>{v}</span>,
    },
    {
      title: ':EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
    { title: ':ROLE', dataIndex: 'role', key: 'role', render: (v) => <RoleBadge role={v} /> },
    {
      title: ':STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (v) => <StatusBadge status={v} />,
    },
    {
      title: ':LAST LOGIN',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (v) => <span style={{ color: 'var(--term-text-muted)' }}>{v}</span>,
    },
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
      <style>{`
        .hacker-table .ant-table {
          background: transparent;
        }
        .hacker-table .ant-table-thead > tr > th {
          background: rgba(57, 255, 106, 0.05) !important;
          color: var(--term-green) !important;
          border-bottom: 1px solid var(--term-border) !important;
          font-family: var(--term-font);
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .hacker-table .ant-table-tbody > tr > td {
          background: transparent !important;
          border-bottom: 1px solid var(--term-border) !important;
          color: var(--term-text);
          font-size: 12px;
        }
        .hacker-table .ant-table-tbody > tr:hover > td {
          background: rgba(57, 255, 106, 0.06) !important;
        }
        .hacker-table .ant-pagination-item,
        .hacker-table .ant-pagination-prev .ant-pagination-item-link,
        .hacker-table .ant-pagination-next .ant-pagination-item-link {
          background: transparent !important;
          border: 1px solid var(--term-border) !important;
          color: var(--term-text-muted) !important;
        }
        .hacker-table .ant-pagination-item-active {
          border-color: var(--term-green) !important;
        }
        .hacker-table .ant-pagination-item-active a {
          color: var(--term-green) !important;
        }
        .hacker-table .ant-select-selector {
          background: transparent !important;
          border: 1px solid var(--term-border) !important;
          color: var(--term-text) !important;
        }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            color: 'var(--term-green)',
            fontSize: 24,
            letterSpacing: 2,
            margin: 0,
            textShadow: '0 0 10px rgba(57,255,106,0.35)',
          }}
        >
          USER MANAGEMENT
        </h1>
        <p style={{ color: 'var(--term-text-muted)', fontSize: 12, marginTop: 4 }}>
          Manage system users and their roles
        </p>
      </div>

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
              color: 'var(--term-text-muted)',
              fontFamily: 'var(--term-font)',
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            <FilterOutlined /> FILTER
          </button>
        </div>

        <div className="hacker-table">
          <CrudTable
            tableData={users}
            columns={columns}
            paramObj={{ ...paramObj, total: filtered.length }}
            setParamObj={setParamObj}
            setRefreshCounter={setRefreshCounter}
            loading={loading}
          />
        </div>
      </div>

      <ChangeRoleModal
        open={!!activeUser}
        user={activeUser}
        onClose={() => setActiveUser(null)}
        onRoleChanged={{}}
      />
    </div>
  )
}

export default UserManagementPage

import ModeTable from './ModeTable'

export default function CrudTable({
  tableData,
  columns,
  paramObj,
  setParamObj,
  setRefreshCounter,
  loading,
}) {
  const handleTableChange = (pagination) => {
    setParamObj((prev) => ({
      ...prev,
      limit: pagination.pageSize,
      offset: pagination.current - 1,
      total: pagination.total,
    }))

    setRefreshCounter((c) => c + 1)
  }

  return (
    <ModeTable
      size="small"
      dataSource={tableData}
      columns={columns}
      rowKey={(record) => record?.id || record?.aon}
      pagination={{
        current: paramObj.offset + 1,
        pageSize: paramObj.limit,
        total: tableData.length,
        showSizeChanger: true,
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  )
}

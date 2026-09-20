import './AuthGate.css'

export default function AuthGate() {
  return (
    <div className="ag-auth-gate-container ag-loading-state">
      <div className="ag-loading-content">
        <div className="ag-spinner-container">
          <div className="ag-spinner-ring ag-ring-1" />
          <div className="ag-spinner-ring ag-ring-2" />
          <div className="ag-spinner-ring ag-ring-3" />
          <div className="ag-spinner-core" />
        </div>
        <div className="ag-loading-text">Verifying Access</div>
        <div className="ag-loading-subtext">Authenticating credentials...</div>
      </div>
    </div>
  )
}

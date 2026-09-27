import { hasMenuPermission } from '@devStack/components/sidebar/constants/Permission'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ menuKey, children }) => {
  const location = useLocation()
  const { isAuthenticated, user } = useSelector((s) => s.user)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (menuKey && !hasMenuPermission(menuKey, user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute

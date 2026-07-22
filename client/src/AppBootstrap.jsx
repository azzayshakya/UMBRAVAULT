import { useValidateUserSession } from '@devStack/hooks/useValidataUserSession'

import PageLoader from '../devStack/components/spinners/PageLoader'

const AppBootstrap = ({ children }) => {
  const { isPending } = useValidateUserSession()

  if (isPending) return <PageLoader />

  return children
}

export default AppBootstrap

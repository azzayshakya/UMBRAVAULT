import { StorageKey } from '@devStack/enums/storage-key-enums'
import { useUserSessionStore } from '@devStack/store/Store'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { useEffect } from 'react'

export const useAuthSync = () => {
  const { setUserSession } = useUserSessionStore()

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Session was removed in another tab → logout this tab too
      if (event.key === StorageKey.USER_SESSION && !event.newValue) {
        setUserSession(null)
        redirectToLoginUtil(false) // don't save path, intentional logout
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [setUserSession])
}

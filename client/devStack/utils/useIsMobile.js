import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

export const isMobileDevice = (breakpoint = MOBILE_BREAKPOINT) => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < breakpoint
}

export const useIsMobile = (breakpoint = MOBILE_BREAKPOINT) => {
  const [isMobile, setIsMobile] = useState(() => isMobileDevice(breakpoint))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

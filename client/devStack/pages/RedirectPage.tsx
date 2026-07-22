import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface RedirectPageProps {
  className?: string
}

/* Default message is "Loading...".
   Example URL: redirect?url=https://domain.com/&msg=Please Wait...
*/
const RedirectPage = ({ className }: RedirectPageProps) => {
  const [searchParams] = useSearchParams()

  const url = searchParams.get('url')
  const message = searchParams.get('msg') || 'Loading...' // Default loading message

  useEffect(() => {
    if (url) {
      window.location.assign(url)
    }
  }, [url])

  return (
    <div
    // className={cn(
    //   'flex h-screen w-full flex-col items-center justify-center p-3 lg:w-full',
    //   className
    // )}
    >
      <div className="-mt-4 flex items-center gap-6 text-gray-300">
        <div className="loading-container">
          <div className="loading"></div>
          <div id="loading-icon">
            <img src="loader.svg" alt="Loading..." />
          </div>
        </div>
        {message}
      </div>
    </div>
  )
}

export { RedirectPage }

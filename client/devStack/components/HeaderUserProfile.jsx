// components/HeaderUserProfile.jsx
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

import { Skeleton, SkeletonAvatar } from './Skelton/Skeleton'
import useUserInfo from '@/pages/Dashboard/hooks/useUserInfo'

const wrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '4px 8px 4px 4px',
  borderRadius: 'var(--radius-sm, 6px)',
  cursor: 'pointer',
  userSelect: 'none',
}

const avatarFrameStyle = {
  position: 'relative',
  width: 36,
  height: 36,
  flexShrink: 0,
  borderRadius: '50%',
  border: '1.5px solid var(--term-green, var(--color-primary))',
  boxShadow: '0 0 10px rgba(34, 224, 122, 0.4)',
  overflow: 'hidden',
  background: 'var(--color-bg-container)',
}

const avatarImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}

const nameStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--term-green, var(--color-primary))',
  letterSpacing: 0.4,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
}

const taglineStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 10,
  color: 'var(--term-text-muted, var(--color-text-muted))',
  letterSpacing: 0.3,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
}

const chevronStyle = {
  fontSize: 10,
  color: 'var(--term-text-muted, var(--color-text-muted))',
  marginLeft: 2,
}

/**
 * <HeaderUserProfile />
 *
 * Compact avatar + username + tagline chip used in the top-right of the
 * app header. Shows a skeleton placeholder (avatar + two text lines)
 * while user data is loading, then swaps in the real authenticated user's
 * photo, name and role once available.
 *
 * Not wired to open a dropdown yet — click is a visual affordance only.
 */
const HeaderUserProfile = () => {
  const { user, loading } = useUserInfo()
  const authenticUser = useSelector((state) => state.user.user)

  const avatarUrl = authenticUser?.avatar || '/images/global/my-profile.jpg'
  // console.log()
  if (loading) {
    return (
      <div style={wrapStyle}>
        <SkeletonAvatar size={36} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Skeleton width={78} height={11} borderRadius={4} />
          <Skeleton width={56} height={9} borderRadius={4} />
        </div>
      </div>
    )
  }

  return (
    <div style={wrapStyle} className="header-user-profile">
      <div style={avatarFrameStyle}>
        <img style={avatarImgStyle} src={avatarUrl} alt={authenticUser?.name || 'user avatar'} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={nameStyle}>{authenticUser?.username || authenticUser?.name}</span>
        <span style={taglineStyle}>
          {authenticUser?.tagline || `# ${user?.role || authenticUser?.role || 'member'}`}
        </span>
      </div>

      <DownOutlined style={chevronStyle} />
    </div>
  )
}

export default HeaderUserProfile

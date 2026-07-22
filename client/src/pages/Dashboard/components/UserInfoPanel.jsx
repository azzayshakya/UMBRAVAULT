// components/UserInfoPanel.jsx
import {
  UserOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  EyeOutlined,
  KeyOutlined,
} from '@ant-design/icons'
import Loader from '@devStack/components/spinners/Loader'
import { useSelector } from 'react-redux'

import useUserInfo from '../hooks/useUserInfo'

const wrapStyle = {
  position: 'relative',
  border: '1px solid var(--term-border-strong, rgba(34, 224, 122, 0.35))',
  background:
    'radial-gradient(circle at 15% 15%, rgba(34,224,122,0.08), transparent 55%), linear-gradient(135deg, rgba(34, 224, 122, 0.05), rgba(4, 9, 6, 0.9))',
  borderRadius: 'var(--radius-sm, 6px)',
  padding: 20,
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  height: '100%',
  overflow: 'hidden',
}

const cornerBase = {
  position: 'absolute',
  width: 16,
  height: 16,
  borderColor: 'var(--term-green, #22e07a)',
  opacity: 0.9,
}

const avatarFrameStyle = {
  position: 'relative',
  width: 84,
  height: 84,
  flexShrink: 0,
  borderRadius: '50%',
  border: '2px solid var(--term-green, #22e07a)',
  boxShadow: '0 0 18px rgba(34, 224, 122, 0.45), inset 0 0 12px rgba(34,224,122,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at 30% 20%, rgba(34,224,122,0.18), #060b08)',
  color: 'var(--term-green, #22e07a)',
  fontSize: 32,
  overflow: 'hidden',
}

const labelStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 11,
  color: 'var(--term-text-muted, #6b8f78)',
  letterSpacing: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const valueStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 12,
  color: 'var(--term-text, #d7ffe4)',
  letterSpacing: 0.3,
}

const iconRowStyle = {
  display: 'flex',
  gap: 18,
  marginTop: 12,
}

const bioIcons = [
  { Icon: UserOutlined, tag: 'FIR' },
  { Icon: KeyOutlined, tag: 'OID' },
  { Icon: IdcardOutlined, tag: 'IP' },
  { Icon: EyeOutlined, tag: 'RET' },
  { Icon: SafetyCertificateOutlined, tag: 'BIO' },
]

const UserInfoPanel = () => {
  const { user, loading } = useUserInfo()
  const authenticUser = useSelector((state) => state.user.user)
  const contentBgUrl = '/images/global/my-profile.jpg'
  if (loading) {
    return (
      <div style={{ ...wrapStyle, justifyContent: 'center' }}>
        <Loader
          size={18}
          thickness={2}
          color="var(--term-green, #22e07a)"
          trackColor="rgba(34, 224, 122, 0.15)"
          label="FETCHING YOUR INFO..."
          labelColor="var(--term-green, #22e07a)"
          labelSize={12}
        />
      </div>
    )
  }

  return (
    <div style={wrapStyle} className="dash-user-panel">
      <style>{`
        @keyframes scanSweep {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes radarSpin { to { transform: rotate(360deg); } }
        @keyframes glitchShift {
          0%, 96%, 100% { transform: translate(0,0); opacity: 1; }
          97% { transform: translate(-1px, 0.5px); opacity: 0.85; }
          98% { transform: translate(1px, -0.5px); opacity: 1; }
        }
        @keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes cursorBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        .dash-user-panel__scanline {
          position: absolute; left: 0; right: 0; height: 40px;
          background: linear-gradient(180deg, transparent, rgba(34,224,122,0.18), transparent);
          animation: scanSweep 4s linear infinite;
          pointer-events: none;
        }
        .dash-user-panel__radar {
          position: absolute; inset: -2px; border-radius: 50%;
          border-top: 1.5px solid var(--term-green, #22e07a);
          border-right: 1.5px solid transparent;
          border-bottom: 1.5px solid transparent;
          border-left: 1.5px solid transparent;
          animation: radarSpin 2.4s linear infinite;
          opacity: 0.8;
        }
        .dash-user-panel__handle { animation: glitchShift 6s infinite; }
        .dash-user-panel__cursor { animation: cursorBlink 1s step-end infinite; }
        .dash-user-panel__bio-icon:hover { color: var(--term-green, #22e07a) !important; }
      `}</style>

      {/* scan frame corners */}
      <span
        style={{ ...cornerBase, top: 6, left: 6, borderTop: '2px solid', borderLeft: '2px solid' }}
      />
      <span
        style={{
          ...cornerBase,
          top: 6,
          right: 6,
          borderTop: '2px solid',
          borderRight: '2px solid',
        }}
      />
      <span
        style={{
          ...cornerBase,
          bottom: 6,
          left: 6,
          borderBottom: '2px solid',
          borderLeft: '2px solid',
        }}
      />
      <span
        style={{
          ...cornerBase,
          bottom: 6,
          right: 6,
          borderBottom: '2px solid',
          borderRight: '2px solid',
        }}
      />

      <span className="dash-user-panel__scanline" />

      {/* live session badge */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontFamily: 'var(--term-font, monospace)',
          fontSize: 9,
          color: 'var(--term-green, #22e07a)',
          letterSpacing: 1,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--term-green, #22e07a)',
            boxShadow: '0 0 6px var(--term-green, #22e07a)',
            animation: 'livePulse 1.4s ease-in-out infinite',
          }}
        />
        LIVE SESSION
      </div>

      <div style={avatarFrameStyle}>
        <span className="dash-user-panel__radar" />
        {/* <UserOutlined /> */}
        <div
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            borderRadius: 'var(--radius)',
            // padding: 'var(--page-padding)',
            flex: 1,
            overflow: 'hidden ',
          }}
        >
          <img style={{ overflow: 'hidden' }} src={contentBgUrl} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        <span
          className="dash-user-panel__handle"
          style={{
            fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--term-green, #22e07a)',
            letterSpacing: 1,
            textShadow: '0 0 8px rgba(34,224,122,0.6)',
          }}
        >
          {authenticUser?.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
            fontSize: 11,
            color: 'var(--term-text-muted, #6b8f78)',
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          {authenticUser?.username}
        </span>
        <span
          style={{
            fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
            fontSize: 11,
            color: 'var(--term-text-muted, #6b8f78)',
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          {authenticUser?.role}
        </span>

        <span style={labelStyle}>
          <SafetyCertificateOutlined /> Clearance Level:{' '}
          <span style={valueStyle}>{user.clearanceLevel}</span>
        </span>
        <span style={labelStyle}>
          <IdcardOutlined /> Access Level: <span style={valueStyle}>{user.accessLevel}</span>
        </span>
        <span style={labelStyle}>
          Session ID: <span style={valueStyle}>{authenticUser.deviceId}</span>
        </span>
        <span style={labelStyle}>
          email: <span style={valueStyle}>{authenticUser?.email}</span>
          <span className="dash-user-panel__cursor" style={{ color: 'var(--term-green, #22e07a)' }}>
            ▍
          </span>
        </span>

        <div style={iconRowStyle}>
          {bioIcons.map(({ Icon, tag }) => (
            <div
              key={tag}
              className="dash-user-panel__bio-icon"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: 'var(--term-green-dim, #6fae87)',
                fontSize: 15,
                cursor: 'pointer',
                transition: 'color 0.15s ease',
              }}
            >
              <Icon />
              <span
                style={{
                  fontFamily: 'var(--term-font, monospace)',
                  fontSize: 8,
                  letterSpacing: 1,
                }}
              >
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserInfoPanel

import {
  UserOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  EyeOutlined,
  KeyOutlined,
} from '@ant-design/icons'
import Loader from '@devStack/components/spinners/Loader'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { useSelector } from 'react-redux'

import useUserInfo from '../hooks/useUserInfo'

const cornerBase = {
  position: 'absolute',
  width: 16,
  height: 16,
  borderColor: 'var(--color-primary)',
  opacity: 0.8,
}

const labelStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 11,
  color: 'var(--color-text-muted)',
  letterSpacing: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  wordBreak: 'break-all',
}

const valueStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 12,
  color: 'var(--color-text)',
  fontWeight: 600,
  letterSpacing: 0.3,
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
  const authenticUser = useSelector((state) => state.user?.user)
  const isMobile = useIsMobile()
  const contentBgUrl = authenticUser?.avatar || '/images/global/my-profile.jpg'

  const wrapStyle = {
    position: 'relative',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-container)',
    borderRadius: 'var(--radius, 10px)',
    padding: isMobile ? 14 : 20,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    textAlign: isMobile ? 'center' : 'left',
    gap: isMobile ? 14 : 18,
    height: '100%',
    overflow: 'hidden',
  }

  const avatarFrameStyle = {
    position: 'relative',
    width: isMobile ? 70 : 84,
    height: isMobile ? 70 : 84,
    flexShrink: 0,
    borderRadius: '50%',
    border: '2px solid var(--color-primary)',
    boxShadow: '0 0 14px var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    color: 'var(--color-primary)',
    fontSize: 32,
    overflow: 'hidden',
  }

  const iconRowStyle = {
    display: 'flex',
    gap: isMobile ? 12 : 18,
    marginTop: 12,
    justifyContent: isMobile ? 'center' : 'flex-start',
    flexWrap: 'wrap',
  }

  if (loading) {
    return (
      <div style={{ ...wrapStyle, justifyContent: 'center' }}>
        <Loader
          size={18}
          thickness={2}
          color="var(--color-primary)"
          trackColor="var(--color-primary-light)"
          label="FETCHING YOUR INFO..."
          labelColor="var(--color-primary)"
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
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
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
          background: linear-gradient(180deg, transparent, var(--color-primary-light), transparent);
          animation: scanSweep 4s linear infinite;
          pointer-events: none;
        }
        .dash-user-panel__radar {
          position: absolute; inset: -2px; border-radius: 50%;
          border-top: 1.5px solid var(--color-primary);
          border-right: 1.5px solid transparent;
          border-bottom: 1.5px solid transparent;
          border-left: 1.5px solid transparent;
          animation: radarSpin 2.4s linear infinite;
          opacity: 0.8;
        }
        .dash-user-panel__handle { animation: glitchShift 6s infinite; }
        .dash-user-panel__cursor { animation: cursorBlink 1s step-end infinite; }
        .dash-user-panel__bio-icon {
          color: var(--color-text-muted);
        }
        .dash-user-panel__bio-icon:hover {
          color: var(--color-primary) !important;
        }

        /* ── Dark Scheme Visual Effects ── */
        [data-scheme='dark'] .dash-user-panel {
          background: radial-gradient(circle at 15% 15%, rgba(57,255,106,0.08), transparent 55%), 
                      linear-gradient(135deg, rgba(57, 255, 106, 0.05), rgba(4, 9, 6, 0.9)) !important;
          border-color: var(--term-border) !important;
        }
        [data-scheme='dark'] .dash-user-panel__handle {
          text-shadow: 0 0 8px rgba(57, 255, 106, 0.6);
        }

        /* ── Light Scheme Visual Overrides ── */
        [data-scheme='light'] .dash-user-panel {
          background: var(--primitive-white) !important;
          border: 1px solid var(--color-border) !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }
        [data-scheme='light'] .dash-user-panel__handle {
          text-shadow: none !important;
        }
      `}</style>

      {/* Scan frame corners */}
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

      {/* Live session badge */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: isMobile ? 12 : 28,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontFamily: 'var(--term-font, monospace)',
          fontSize: 9,
          color: 'var(--color-primary)',
          letterSpacing: 1,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            boxShadow: '0 0 6px var(--color-primary)',
            animation: 'livePulse 1.4s ease-in-out infinite',
          }}
        />
        LIVE SESSION
      </div>

      <div style={avatarFrameStyle}>
        <span className="dash-user-panel__radar" />
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={contentBgUrl}
            alt="Profile Avatar"
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minWidth: 0,
          alignItems: isMobile ? 'center' : 'flex-start',
          width: '100%',
        }}
      >
        <span
          className="dash-user-panel__handle"
          style={{
            fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
            fontSize: isMobile ? 17 : 20,
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: 1,
          }}
        >
          {authenticUser?.name || 'User Name'}
        </span>
        <span
          style={{
            fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            letterSpacing: 1.5,
            marginBottom: 2,
          }}
        >
          {authenticUser?.username}
        </span>
        <span
          style={{
            fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            letterSpacing: 1.5,
            marginBottom: 2,
            textTransform: 'uppercase',
          }}
        >
          {authenticUser?.role}
        </span>

        <span style={labelStyle}>
          <SafetyCertificateOutlined /> Clearance Level:{' '}
          <span style={valueStyle}>{user?.clearanceLevel || 'Level 1'}</span>
        </span>
        <span style={labelStyle}>
          <IdcardOutlined /> Access Level:{' '}
          <span style={valueStyle}>{user?.accessLevel || 'Standard'}</span>
        </span>
        <span style={labelStyle}>
          Session ID: <span style={valueStyle}>{authenticUser?.deviceId || '—'}</span>
        </span>
        <span style={labelStyle}>
          email: <span style={valueStyle}>{authenticUser?.email || '—'}</span>
          <span className="dash-user-panel__cursor" style={{ color: 'var(--color-primary)' }}>
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

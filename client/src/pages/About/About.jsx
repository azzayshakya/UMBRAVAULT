import {
  CodeOutlined,
  CompassOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  LockOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'

const About = () => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  const cards = [
    {
      id: '01',
      icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />,
      title: 'Autonomous Defense',
      subtitle: 'Zero-Trust Architecture',
      description:
        'Deterministic protocol execution that analyzes vector anomalies and neutralizes unauthorized ingress before execution.',
      stat: '99.99%',
      statLabel: 'THREAT DEFLECTION',
    },
    {
      id: '02',
      icon: <FolderOpenOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />,
      title: 'Knowledge Vaults',
      subtitle: 'Synchronized Intelligence',
      description:
        'Instantaneous heuristics capture. Structuring raw developer notes and cryptographic credentials into encrypted nodes.',
      stat: '< 10ms',
      statLabel: 'READ LATENCY',
    },
    {
      id: '03',
      icon: <ThunderboltOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />,
      title: 'Quantum Guardrails',
      subtitle: 'Hardened Session Control',
      description:
        'Continuous session attestation paired with ephemeral tokens, ensuring absolute data integrity at rest and in transit.',
      stat: '256-BIT',
      statLabel: 'ENCRYPTION TIER',
    },
  ]

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--term-font, -apple-system, BlinkMacSystemFont, sans-serif)',
        overflowX: 'hidden',
        padding: '0 24px 60px 24px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @keyframes eclipsePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.85; }
          50% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
        }
        @keyframes termBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes scanSweep {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(300px); opacity: 0; }
        }
      `}</style>
      {/* Cyber Eclipse Ambient Halo (Reference Image Top Center Effect) */}
      <div
        style={{
          position: 'absolute',
          top: '320px',
          left: '50%',
          width: '560px',
          height: '560px',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'eclipsePulse 7s ease-in-out infinite',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, var(--color-primary) 0%, rgba(57, 255, 106, 0.08) 55%, transparent 72%)',
            filter: 'blur(70px)',
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, transparent 60%, var(--color-primary) 68%, rgba(57, 255, 106, 0.15) 74%, transparent 78%)',
            filter: 'drop-shadow(var(--color-glow))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '16%',
            borderRadius: '50%',
            background: 'var(--color-bg)',
          }}
        />
      </div>
      {/* Top Navbar
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--color-bg-container)',
              border: '1px solid var(--color-border-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              boxShadow: 'var(--color-glow)',
            }}
          >
            <CompassOutlined style={{ fontSize: 18 }} />
          </div>
          <span
            style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1.5, fontFamily: 'monospace' }}
          >
            UMBRA<span style={{ color: 'var(--color-primary)' }}>VAULT</span>
          </span>
        </div>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 6px',
            borderRadius: 30,
            background: 'var(--color-bg-container)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          {['Vision', 'Architecture', 'Protocol', 'Intelligence'].map((tab, idx) => {
            const isActive = activeTab === idx
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(idx)}
                style={{
                  border: isActive
                    ? '1px solid var(--color-border-secondary)'
                    : '1px solid transparent',
                  background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  padding: '6px 16px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            borderRadius: 8,
            background: 'var(--color-primary)',
            color: 'var(--color-bg)',
            border: 'none',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: 'monospace',
            cursor: 'pointer',
            boxShadow: 'var(--color-glow)',
            transition: 'opacity 0.2s ease',
          }}
        >
          <LockOutlined /> ENTER VAULT
        </button>
      </header> */}
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '820px',
          margin: '0 auto',
          textAlign: 'center',
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 20,
            background: 'var(--color-bg-container)',
            border: '1px solid var(--color-border-secondary)',
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'inline-block',
              animation: 'termBlink 1.5s infinite',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              letterSpacing: 1.5,
              color: 'var(--color-text-secondary)',
            }}
          >
            root@vault:~# cat core_manifest.txt
          </span>
        </div>

        <h1
          style={{
            fontSize: ' clamp(32px, 5vw, 54px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 18px 0',
          }}
        >
          Engineering unyielding clarity &amp;{' '}
          <span
            style={{
              background:
                'linear-gradient(90deg, var(--color-primary) 0%, var(--primitive-green-300, #7dffb0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            autonomous resilience.
          </span>
        </h1>

        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.65,
            fontFamily: 'monospace',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
          }}
        >
          &ldquo;The quieter you become, the more you are able to hear.&rdquo;
          <br />
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            We do not hack systems, we study them.
          </span>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 8,
              background: 'var(--color-primary)',
              color: 'var(--color-bg)',
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: 1,
              cursor: 'pointer',
              boxShadow: 'var(--color-glow)',
            }}
          >
            EXPLORE ARCHITECTURE <RightOutlined style={{ fontSize: 11 }} />
          </button>

          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 8,
              background: 'var(--color-bg-container)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            <CodeOutlined style={{ color: 'var(--color-primary)' }} /> READ SPEC
          </button>
        </div>
      </section>
      {/* 3 Core Cards Section (Matches the 3 feature cards from your image) */}
      <section
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '1100px',
          margin: '40px auto 0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EyeOutlined style={{ color: 'var(--color-primary)', fontSize: 14 }} />
            <span
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                letterSpacing: 2,
                color: 'var(--color-text-muted)',
                fontWeight: 700,
              }}
            >
              CORE DIRECTIVES
            </span>
          </div>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
            STATUS: ENCRYPTED // 03 NODES
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {cards.map((item, index) => {
            const isHovered = hoveredCard === index
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative',
                  padding: 26,
                  borderRadius: 'var(--radius, 12px)',
                  background: 'var(--color-bg-container)',
                  border: isHovered
                    ? '1px solid var(--color-border-secondary)'
                    : '1px solid var(--color-border)',
                  boxShadow: isHovered ? 'var(--color-glow)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 280,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                }}
              >
                {/* Scanline Sweep animation */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'var(--color-primary)',
                      boxShadow: '0 0 10px var(--color-primary)',
                      animation: 'scanSweep 1.8s ease-in-out infinite',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        background: 'var(--color-bg-hover)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          fontFamily: 'monospace',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {item.stat}
                      </div>
                      <div
                        style={{
                          fontSize: 9.5,
                          fontFamily: 'monospace',
                          color: 'var(--color-text-muted)',
                          letterSpacing: 0.5,
                        }}
                      >
                        {item.statLabel}
                      </div>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      margin: '0 0 4px 0',
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.title}
                  </h3>
                  <h4
                    style={{
                      fontSize: 11.5,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      margin: '0 0 12px 0',
                      color: 'var(--color-primary)',
                      opacity: 0.9,
                    }}
                  >
                    {item.subtitle}
                  </h4>

                  <p
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 22,
                    paddingTop: 14,
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 10.5,
                    fontFamily: 'monospace',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span>DIRECTIVE_{item.id}</span>
                  <RightOutlined
                    style={{
                      fontSize: 10,
                      color: 'var(--color-primary)',
                      opacity: isHovered ? 1 : 0.3,
                      transition: 'opacity 0.2s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
      {/* Bottom Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '1100px',
          margin: '60px auto 0 auto',
          paddingTop: 20,
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          fontFamily: 'monospace',
          color: 'var(--color-text-muted)',
        }}
      >
        <span>&copy; {new Date().getFullYear()} UMBRAVAULT SECURITY SYSTEMS</span>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--color-primary)',
              }}
            />
            ENCRYPTED ARCHITECTURE
          </span>
          <span>LATENCY: 8ms</span>
        </div>
      </footer>
    </div>
  )
}

export default About

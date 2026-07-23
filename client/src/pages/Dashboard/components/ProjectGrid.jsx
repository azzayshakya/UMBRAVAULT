import { Tooltip } from 'antd'
import {
  Radar,
  Mail,
  Lock,
  Crosshair,
  Biohazard,
  Terminal,
  //   Github,
  ExternalLink,
  ChevronsRight,
  Link,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

/* ─────────────────────────────────────────────────────────────────────────
   MOCK API — swap this whole block for a real fetch() call later.
   Shape matches what the real /api/projects endpoint should return.
   ───────────────────────────────────────────────────────────────────────── */

const DUMMY_PROJECTS = [
  {
    id: 'shadownet',
    name: 'SHADOWNET',
    desc: 'Anonymous Network Scanner',
    icon: Radar,
    tags: ['RECON', 'SCAN'],
    threat: 'high',
  },
  {
    id: 'phishx',
    name: 'PHISHX',
    desc: 'Advanced Phishing Framework',
    icon: Mail,
    tags: ['SOCIAL', 'PHISH'],
    threat: 'critical',
  },
  {
    id: 'cryptex',
    name: 'CRYPTEX',
    desc: 'File Encryption Toolkit',
    icon: Lock,
    tags: ['CRYPTO', 'TOOL'],
    threat: 'low',
  },
  {
    id: 'bughunter',
    name: 'BUG HUNTER',
    desc: 'Web Vulnerability Scanner',
    icon: Crosshair,
    tags: ['WEB', 'SCAN'],
    threat: 'medium',
  },
  {
    id: 'payloadlab',
    name: 'PAYLOAD LAB',
    desc: 'Payload Generator Suite',
    icon: Biohazard,
    tags: ['EXPLOIT', 'GEN'],
    threat: 'critical',
  },
  {
    id: 'shellstorm',
    name: 'SHELL STORM',
    desc: 'Reverse Shell Manager',
    icon: Terminal,
    tags: ['SHELL', 'REMOTE'],
    threat: 'high',
  },
]

/**
 * fetchProjects — mock network call.
 * Replace the body with: return (await fetch('/api/projects')).json()
 */
function fetchProjects() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_PROJECTS), 1500)
  })
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared frame styles — reused verbatim from the existing terminal-frame
   system (terminal-frame.css) so this stays visually identical to the
   rest of the dashboard. Only new bits: .proj-shimmer + .proj-card-in.
   ───────────────────────────────────────────────────────────────────────── */

const FRAME_CSS = `
.terminal-frame {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--term-bg-panel);
  border: 1px solid var(--term-border);
  border-radius: var(--term-radius);
  box-shadow: var(--term-glow);
  font-family: var(--term-font);
  color: var(--term-text);
}
.terminal-frame__corner {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 3;
  pointer-events: none;
  animation: term-corner-pulse 3s ease-in-out infinite;
}
.terminal-frame__corner--tl { top: -1px; left: -1px; border-top: 2px solid var(--term-green); border-left: 2px solid var(--term-green); }
.terminal-frame__corner--tr { top: -1px; right: -1px; border-top: 2px solid var(--term-green); border-right: 2px solid var(--term-green); }
.terminal-frame__corner--bl { bottom: -1px; left: -1px; border-bottom: 2px solid var(--term-green); border-left: 2px solid var(--term-green); }
.terminal-frame__corner--br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--term-green); border-right: 2px solid var(--term-green); }
.terminal-frame__scanlines {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(57,255,106,0.035) 3px);
  mix-blend-mode: overlay;
}
.terminal-frame__beam {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--term-green), transparent);
  animation: term-scan-sweep 6s linear infinite;
}
@keyframes term-corner-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@keyframes term-scan-sweep { 0% { top: 0; opacity: 0; } 10% { opacity: 0.55; } 90% { opacity: 0.55; } 100% { top: 100%; opacity: 0; } }
@keyframes term-fade-in { from { opacity: 0; filter: blur(2px); } to { opacity: 1; filter: blur(0); } }
@keyframes proj-shimmer-sweep { 0% { background-position: -300px 0; } 100% { background-position: 300px 0; } }

.proj-shimmer {
  background-image: linear-gradient(90deg, rgba(57,255,106,0.05) 25%, rgba(57,255,106,0.16) 50%, rgba(57,255,106,0.05) 75%);
  background-size: 300px 100%;
  animation: proj-shimmer-sweep 1.3s infinite linear;
  border-radius: 4px;
}
.proj-card-in {
  animation: term-fade-in 0.5s ease-out both;
}
`

/* ─────────────────────────────────────────────────────────────────────────
   Threat-level accent colors (kept out of the main --term-green palette
   on purpose — this is the one place severity should read as "dangerous")
   ───────────────────────────────────────────────────────────────────────── */

const THREAT_COLOR = {
  low: '#39ff6a',
  medium: '#e0c341',
  high: '#ff9d3d',
  critical: '#ff3b3b',
}

/* ─────────────────────────────────────────────────────────────────────────
   Skeleton card — shown while fetchProjects() is in flight. Mirrors the
   exact layout of the real card so there's no size jump on swap-in.
   ───────────────────────────────────────────────────────────────────────── */
function ProjectCardSkeleton({ index }) {
  return (
    <div
      className="terminal-frame"
      style={{
        padding: 0,
        minHeight: 240,
        animationDelay: `${index * 70}ms`,
      }}
    >
      <span className="terminal-frame__corner terminal-frame__corner--tl" />
      <span className="terminal-frame__corner terminal-frame__corner--tr" />
      <span className="terminal-frame__corner terminal-frame__corner--bl" />
      <span className="terminal-frame__corner terminal-frame__corner--br" />
      <span className="terminal-frame__scanlines" />

      <div
        style={{
          minHeight: 240,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Status */}
        <div
          className="proj-shimmer"
          style={{
            width: 50,
            height: 10,
            alignSelf: 'flex-end',
          }}
        />

        {/* Icon */}
        <div
          className="proj-shimmer"
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
          }}
        />

        {/* Title */}
        <div
          className="proj-shimmer"
          style={{
            width: '70%',
            height: 18,
          }}
        />

        {/* Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div className="proj-shimmer" style={{ width: '90%', height: 10 }} />
          <div className="proj-shimmer" style={{ width: '75%', height: 10 }} />
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 8,
          }}
        >
          <div
            className="proj-shimmer"
            style={{
              width: 60,
              height: 20,
              borderRadius: 4,
            }}
          />

          <div
            className="proj-shimmer"
            style={{
              width: 60,
              height: 20,
              borderRadius: 4,
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--term-border)',
          }}
        >
          <div
            className="proj-shimmer"
            style={{
              width: 18,
              height: 18,
            }}
          />

          <div
            className="proj-shimmer"
            style={{
              width: 18,
              height: 18,
            }}
          />

          <div
            className="proj-shimmer"
            style={{
              width: 18,
              height: 18,
            }}
          />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Real project card
   ───────────────────────────────────────────────────────────────────────── */

function ProjectCard({ project, index }) {
  const Icon = project.icon
  const threatColor = THREAT_COLOR[project.threat] || THREAT_COLOR.low

  return (
    <div
      className="terminal-frame proj-card-in"
      style={{
        padding: 0,
        height: 240,
        transition: 'all .3s ease',
        animationDelay: `${index * 70}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 0 30px rgba(57,255,106,.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--term-glow)'
      }}
    >
      <span className="terminal-frame__corner terminal-frame__corner--tl" />
      <span className="terminal-frame__corner terminal-frame__corner--tr" />
      <span className="terminal-frame__corner terminal-frame__corner--bl" />
      <span className="terminal-frame__corner terminal-frame__corner--br" />
      <span className="terminal-frame__scanlines" />
      <span className="terminal-frame__beam" />

      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* icon + menu + threat dot */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              border: '1px solid var(--term-border)',
              background: 'rgba(57,255,106,.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(57,255,106,.25)',
            }}
          >
            <Icon
              size={40}
              style={{
                color: 'var(--term-green',
              }}
            />
          </div>

          {/* <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              title={`threat: ${project.threat}`}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: threatColor,
                boxShadow: `0 0 6px ${threatColor}`,
              }}
            />
            <span style={{ color: 'var(--term-green-dim)', fontSize: 14, letterSpacing: 1 }}>
              ⋮
            </span>
          </div> */}
        </div>

        {/* title + desc */}
        <div>
          <div
            style={{
              fontSize: 18,
              textAlign: 'center',
              // fontWeight: 700,
              color: 'var(--term-green)',
              textTransform: 'uppercase',
              textShadow: '0 0 15px rgba(57,255,106,.5)',
            }}
          >
            {project.name}
          </div>
          <Tooltip title={project.desc}>
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--term-text-muted)',
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {project.desc}
            </div>
          </Tooltip>
        </div>

        {/* tags */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                letterSpacing: '0.5px',
                padding: '3px 8px',
                borderRadius: 4,
                border: '1px solid var(--term-border)',
                color: 'var(--term-green-dim)',
                background: 'rgba(57,255,106,0.04)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--term-border)',
          }}
        >
          <Link size={18} color="white" />
          <ExternalLink size={18} color="white" />
          <ChevronsRight size={18} color="white" />
        </div>
        {/* footer actions */}
        {/* <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            paddingTop: 10,
            borderTop: '1px solid var(--term-border)',
          }}
        >
          <ExternalLink size={15} color="var(--term-green-dim)" style={{ cursor: 'pointer' }} />
          <ChevronsRight
            size={15}
            color="var(--term-green-dim)"
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
          />
        </div> */}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   ProjectsGrid — the piece you actually mount
   ───────────────────────────────────────────────────────────────────────── */

export default function ProjectsGrid() {
  const [projects, setProjects] = useState(null)

  useEffect(() => {
    let alive = true
    fetchProjects().then((data) => {
      if (alive) setProjects(data)
    })
    return () => {
      alive = false
    }
  }, [])

  const cards = projects ?? Array.from({ length: DUMMY_PROJECTS.length })

  return (
    <div style={{ background: 'var(--term-bg)', padding: 24, fontFamily: 'var(--term-font)' }}>
      <style>{FRAME_CSS}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            fontSize: 10,
            color: '#39ff6a',
          }}
        >
          ACTIVE
        </div>
        <span
          style={{
            fontSize: 11,
            letterSpacing: 0.5,
            color: 'var(--term-green)',
            cursor: 'pointer',
          }}
        >
          VIEW ALL -&gt;
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 16,
        }}
      >
        {cards.map((item, i) =>
          projects ? (
            <ProjectCard key={item.id} project={item} index={i} />
          ) : (
            <ProjectCardSkeleton key={i} index={i} />
          )
        )}
      </div>
    </div>
  )
}

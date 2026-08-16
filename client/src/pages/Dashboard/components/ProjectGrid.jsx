import { ProjectCardSkeleton } from '@devStack/components/Skelton/ProjectCardSkelton'
import { Tooltip } from 'antd'
import {
  Radar,
  Mail,
  Lock,
  Crosshair,
  Biohazard,
  Terminal,
  ExternalLink,
  ChevronsRight,
  Link as LinkIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

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

function fetchProjects() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_PROJECTS), 1500)
  })
}

const terminalFrameStyle = {
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  background: 'var(--color-bg-container, var(--term-bg-panel))',
  border: '1px solid var(--color-border, var(--term-border))',
  borderRadius: 'var(--radius, 10px)',
  fontFamily: 'var(--term-font, monospace)',
  color: 'var(--color-text)',
}

function ProjectCard({ project, index }) {
  const Icon = project.icon

  return (
    <div
      style={{
        ...terminalFrameStyle,
        padding: 0,
        height: 240,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        animation: 'term-fade-in 0.5s ease-out both',
        animationDelay: `${index * 70}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--color-glow)'
        e.currentTarget.style.borderColor = 'var(--color-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    >
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              size={36}
              style={{
                color: 'var(--color-primary)',
              }}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: 'center',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {project.name}
          </div>
          <Tooltip title={project.desc}>
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                marginTop: 2,
              }}
            >
              {project.desc}
            </div>
          </Tooltip>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.5px',
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm, 4px)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-primary)',
                background: 'var(--color-bg-hover)',
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
            alignItems: 'center',
            paddingTop: 10,
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <LinkIcon size={16} style={{ cursor: 'pointer', opacity: 0.8 }} />
          <ExternalLink size={16} style={{ cursor: 'pointer', opacity: 0.8 }} />
          <ChevronsRight size={16} style={{ cursor: 'pointer', opacity: 0.8 }} />
        </div>
      </div>
    </div>
  )
}

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
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius, 8px)',
        background: 'var(--color-bg-container)',
        padding: 20,
        fontFamily: 'var(--term-font, monospace)',
      }}
    >
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
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: 'var(--color-success, var(--color-primary))',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'currentColor',
              display: 'inline-block',
            }}
          />
          ACTIVE
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: 'var(--color-primary)',
            cursor: 'pointer',
          }}
        >
          VIEW ALL -&gt;
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: 8,
          scrollbarColor: 'var(--color-primary) transparent',
          scrollbarWidth: 'thin',
        }}
        className="terminal-scroll"
      >
        {cards.map((item, i) =>
          projects ? (
            <div
              key={item.id + i}
              style={{
                flex: '0 0 170px',
              }}
            >
              <ProjectCard project={item} index={i} />
            </div>
          ) : (
            <div
              key={i}
              style={{
                flex: '0 0 170px',
              }}
            >
              <ProjectCardSkeleton index={i} />
            </div>
          )
        )}
      </div>
    </div>
  )
}

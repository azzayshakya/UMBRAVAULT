import { ProjectCardSkeleton } from '@devStack/components/Skelton/ProjectCardSkelton'
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
  {
    id: 'shellstorm',
    name: 'SHELL STORM',
    desc: 'Reverse Shell Manager',
    icon: Terminal,
    tags: ['SHELL', 'REMOTE'],
    threat: 'high',
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
  background: 'var(--term-bg-panel)',
  border: '1px solid var(--term-border)',
  borderRadius: 'var(--term-radius)',
  // boxShadow: 'var(--term-glow)',
  fontFamily: 'var(--term-font)',
  color: 'var(--term-text)',
}

function ProjectCard({ project, index }) {
  const Icon = project.icon

  return (
    <div
      style={{
        ...terminalFrameStyle,
        padding: 0,
        height: 240,
        transition: 'all .3s ease',
        animation: 'term-fade-in 0.5s ease-out both',
        animationDelay: `${index * 70}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = 'var(--term-glow)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                color: 'var(--term-green)',
              }}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 18,
              textAlign: 'center',
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
        // background: 'var(--term-bg)',
        border: '1px solid var(--term-border)',
        padding: 24,
        fontFamily: 'var(--term-font)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          // border: '2px red solid',
        }}
      >
        <div
          style={{
            // position: 'absolute',
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
          display: 'flex',
          // alignItems: 'center',
          // justifyItems: 'center',
          // justifyContent: 'center',
          gap: 16,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: 8,
          scrollbarColor: '#39ff6a transparent',
          scrollbarWidth: 'thin',
        }}
        className="terminal-scroll"
      >
        {cards.map((item, i) =>
          projects ? (
            <div
              key={item.id}
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

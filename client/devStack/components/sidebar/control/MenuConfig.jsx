import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  CheckSquareOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'

import MENU_KEYS from '../constants/MenuKeys'
import MENU_LABELS from '../constants/MenuLabels'

const createColoredIcon = (IconComponent, color, bg) => {
  const ColoredIcon = (props) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 8,
        background: bg,
        color: color,
        fontSize: 14,
        boxShadow: `0 2px 8px ${bg}`,
        transition: 'all 0.2s ease',
        flexShrink: 0,
        marginRight: 6,
      }}
    >
      <IconComponent {...props} />
    </span>
  )
  ColoredIcon.displayName = `ColoredIcon(${IconComponent.displayName || IconComponent.name})`
  return ColoredIcon
}

export const MENU_CONFIG = [
  {
    key: MENU_KEYS.HOME,
    label: MENU_LABELS.home,
    icon: createColoredIcon(HomeOutlined, '#10B981', 'rgba(16, 185, 129, 0.18)'), // Emerald Green
  },
  {
    key: MENU_KEYS.ABOUT,
    label: MENU_LABELS.about,
    icon: createColoredIcon(InfoCircleOutlined, '#8B5CF6', 'rgba(139, 92, 246, 0.18)'), // Violet / Purple
  },
  {
    key: MENU_KEYS.MY_PROFILE,
    label: MENU_LABELS.my_profile,
    icon: createColoredIcon(UserOutlined, '#3B82F6', 'rgba(59, 130, 246, 0.18)'), // Tech Blue
  },
  {
    key: MENU_KEYS.ADD_USER,
    label: MENU_LABELS.add_user,
    icon: createColoredIcon(UserAddOutlined, '#F59E0B', 'rgba(245, 158, 11, 0.18)'), // Amber / Gold
  },
  {
    key: MENU_KEYS.ROLE_MANAGEMENT,
    label: MENU_LABELS.role_management,
    icon: createColoredIcon(SafetyCertificateOutlined, '#EF4444', 'rgba(239, 68, 68, 0.18)'), // Rose / Crimson
  },
  {
    key: MENU_KEYS.TASK_MANAGEMENT,
    label: MENU_LABELS.task_management,
    icon: createColoredIcon(CheckSquareOutlined, '#06B6D4', 'rgba(6, 182, 212, 0.18)'), // Cyan / Turquoise
  },
  {
    key: MENU_KEYS.KNOWLEDGE_VAULT,
    label: MENU_LABELS.Knowledge_vault,
    icon: createColoredIcon(DatabaseOutlined, '#22C55E', 'rgba(34, 197, 94, 0.18)'), // Lime / Matrix Green
  },
  {
    key: MENU_KEYS.DOCUMENT_VAULT,
    label: MENU_LABELS.document_vault,
    icon: createColoredIcon(FolderOpenOutlined, '#6366F1', 'rgba(99, 102, 241, 0.18)'), // Indigo / Secure Vault
  },
]

export default MENU_CONFIG

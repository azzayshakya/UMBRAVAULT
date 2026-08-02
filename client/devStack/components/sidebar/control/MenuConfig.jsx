import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
  UserAddOutlined,
  SafetyOutlined,
} from '@ant-design/icons'

import MENU_KEYS from '../constants/MenuKeys'
import MENU_LABELS from '../constants/MenuLabels'

export const MENU_CONFIG = [
  {
    key: MENU_KEYS.HOME,
    label: MENU_LABELS.home,
    icon: HomeOutlined,
  },
  {
    key: MENU_KEYS.ABOUT,
    label: MENU_LABELS.about,
    icon: InfoCircleOutlined,
  },
  {
    key: MENU_KEYS.MY_PROFILE,
    label: MENU_LABELS.my_profile,
    icon: UserOutlined,
  },
  {
    key: MENU_KEYS.ADD_USER,
    label: MENU_LABELS.add_user,
    icon: UserAddOutlined,
  },
  {
    key: MENU_KEYS.ROLE_MANAGEMENT,
    label: MENU_LABELS.role_management,
    icon: SafetyOutlined,
  },
  {
    key: MENU_KEYS.TASK_MANAGEMENT,
    label: MENU_LABELS.task_management,
    icon: SafetyOutlined,
  },
]

export default MENU_CONFIG

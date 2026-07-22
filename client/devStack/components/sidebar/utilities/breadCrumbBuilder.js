/**
 * Breadcrumb builder utility
 * Generates breadcrumb items from menu structure and current route
 */

import MENU_CONFIG from '../control/MenuConfig'

import { findMenuItemByKey, getParentKeys } from './MenuBuilder'

// header navigation ui
export const buildBreadcrumbs = (currentKey, menuConfig = MENU_CONFIG) => {
  if (!currentKey) return []

  const breadcrumbs = []

  // Get parent keys
  const parentKeys = getParentKeys(menuConfig, currentKey)

  // Add parent items
  parentKeys.forEach((key) => {
    const item = findMenuItemByKey(menuConfig, key)
    if (item) {
      breadcrumbs.push({
        title: item.label,
        key: item.key,
      })
    }
  })

  // Add current item
  const currentItem = findMenuItemByKey(menuConfig, currentKey)
  if (currentItem) {
    breadcrumbs.push({
      title: currentItem.label,
      key: currentItem.key,
    })
  }

  return breadcrumbs
}

/**
 * Build breadcrumbs from route path
 * @param {string} pathname - Current route pathname
 * @returns {Array} Breadcrumb items
 */
export const buildBreadcrumbsFromPath = (pathname) => {
  if (!pathname || pathname === '/') return []

  // Split path and create breadcrumbs
  const segments = pathname.split('/').filter(Boolean)

  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    return {
      title,
      key: path,
      href: path,
    }
  })
}

export default {
  buildBreadcrumbs,
  buildBreadcrumbsFromPath,
}

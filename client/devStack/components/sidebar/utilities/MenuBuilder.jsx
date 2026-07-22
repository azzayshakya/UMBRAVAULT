/**
 * Menu builder utility
 * Transforms menu configuration into Ant Design Menu format
 * Handles permissions, icons, and menu structure
 */

import React from 'react'

import { hasMenuPermission } from '../constants/Permission'

/**
 * Create menu item in Ant Design format
 * @param {string} label - Menu label
 * @param {string} key - Menu key
 * @param {React.Component} icon - Icon component
 * @param {Array} children - Child menu items
 * @param {Object} extra - Additional properties
 * @returns {Object} Formatted menu item
 */
export const createMenuItem = (label, key, icon, children, extra = {}) => {
  return {
    key,
    icon: icon ? React.createElement(icon) : null,
    children,
    label,
    ...extra,
  }
}

/**
 * Filter menu items based on user permissions
 * @param {Array} menuItems - Menu configuration
 * @param {string} userRole - User's role
 * @returns {Array} Filtered menu items
 */
const filterMenuByPermissions = (menuItems, userRole) => {
  return menuItems
    .filter((item) => {
      // Check if user has permission for this menu item
      return hasMenuPermission(item.key, userRole)
    })
    .map((item) => {
      // Recursively filter children
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterMenuByPermissions(item.children, userRole)
        // Only include parent if it has accessible children
        return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null
      }
      return item
    })
    .filter(Boolean) // Remove null items
}

/**
 * Builds sidebar menu items based on:
 * - MENU_CONFIG (structure)
 * - userRole (permissions)
 */
export const buildMenuItems = (menuConfig, userRole = null) => {
  // Filter by permissions if userRole is provided

  const filteredConfig = userRole ? filterMenuByPermissions(menuConfig, userRole) : menuConfig

  const buildItems = (items) => {
    return items.map((item) => {
      const { key, label, icon, children, divider, ...rest } = item
      // Recursively build children if they exist
      const childItems = children && children.length > 0 ? buildItems(children) : undefined

      return createMenuItem(label, key, icon, childItems, rest)
    })
  }

  return buildItems(filteredConfig)
}

/**
 * Get all menu keys (for default open keys, etc.)
 * @param {Array} menuConfig - Menu configuration
 * @returns {Array} Array of all menu keys
 */
export const getAllMenuKeys = (menuConfig) => {
  const keys = []

  const extractKeys = (items) => {
    items.forEach((item) => {
      keys.push(item.key)
      if (item.children && item.children.length > 0) {
        extractKeys(item.children)
      }
    })
  }

  extractKeys(menuConfig)
  return keys
}

/**
 * Find menu item by key
 * @param {Array} menuConfig - Menu configuration
 * @param {string} targetKey - Key to find
 * @returns {Object|null} Found menu item or null
 */
export const findMenuItemByKey = (menuConfig, targetKey) => {
  for (const item of menuConfig) {
    if (item.key === targetKey) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const found = findMenuItemByKey(item.children, targetKey)
      if (found) return found
    }
  }
  return null
}

/**
 * Get parent keys for a given menu key
 * @param {Array} menuConfig - Menu configuration
 * @param {string} targetKey - Target menu key
 * @returns {Array} Array of parent keys
 */
export const getParentKeys = (menuConfig, targetKey) => {
  const parents = []

  const findParents = (items, target, currentParents = []) => {
    for (const item of items) {
      if (item.key === target) {
        parents.push(...currentParents)
        return true
      }
      if (item.children && item.children.length > 0) {
        if (findParents(item.children, target, [...currentParents, item.key])) {
          return true
        }
      }
    }
    return false
  }

  findParents(menuConfig, targetKey)
  return parents
}

export default {
  createMenuItem,
  buildMenuItems,
  getAllMenuKeys,
  findMenuItemByKey,
  getParentKeys,
}

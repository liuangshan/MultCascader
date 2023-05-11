import React from 'react'

export type ValueType = any

export type TreeNode = {
  parent?: TreeNode | null
  children?: TreeNode[]
  name?: string
  value: string
  title: React.ReactNode
  isLeaf?: boolean
}

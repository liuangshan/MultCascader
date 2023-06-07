import React, { useState, useMemo, useCallback } from 'react'
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { TreeNode } from '../index.d'
import MultiCascader from '../container'
import { prefix } from '../constants'
import Checkbox from './Checkbox'
import Tooltip from 'antd/es/tooltip'

export interface MenuItemProps {
  node: TreeNode
  depth: number
}

export default React.memo((props: MenuItemProps) => {
  const { node, depth } = props
  const { children, value, label, isLeaf } = node
  const {
    handleCascaderChange,
    menuPath,
    selectLeafOnly,
  } = MultiCascader.useContainer()
  const [loading, setLoading] = useState(false)
  const hasChildren = (children && children.length > 0) || isLeaf === false
  const checkboxHidden = selectLeafOnly && hasChildren

  const handleClick = useCallback(() => {
    setLoading(true)
    handleCascaderChange(node, depth)
  }, [node, depth])

  const showLabel = useMemo(() => {
    if (!label) {
      return '';
    }
    const length = (label as string).length;
    if (length <= 10) {
      return label
    }

    return (label as string).slice(0, 10) + '...'
  }, [label])

  const active = useMemo(
    () => !!menuPath.find((item) => item.value === value),
    [menuPath, value]
  )
  const cls = classnames(`${prefix}-column-item`, {
    [`${prefix}-column-item-active`]: active,
  })

  return (
    <li onClick={handleClick} className={cls}>
      {checkboxHidden ? null : <Checkbox node={node} />}
      <p
        className={`${prefix}-column-item-label`}
        style={{ paddingLeft: checkboxHidden ? '0px' : '' }}
      >
        <Tooltip arrow={false} title={label}>
          <span>{showLabel}</span>
        </Tooltip>
      </p>
      {!hasChildren ? null : loading && !children?.length ? (
        <LoadingOutlined className={`${prefix}-column-item-icon`} />
      ) : (
        <RightOutlined className={`${prefix}-column-item-icon`} />
      )}
    </li>
  )
})

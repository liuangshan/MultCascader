import React, { useCallback } from 'react'
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { hasChildChecked, isParentChecked } from '../libs/utils'
import { MenuItemProps } from './MenuItem'
import MultiCascader from '../container'

export default React.memo((props: Pick<MenuItemProps, 'node'>) => {
  const { node } = props
  const {
    value: containerValue,
    handleSelectChange,
  } = MultiCascader.useContainer()

  const handleClick = useCallback((event: any) => {
    event.stopPropagation()
  }, [])

  const handleChange = useCallback(
    (event: CheckboxChangeEvent) => {
      const { checked } = event.target
      handleSelectChange(node, checked, containerValue)
    },
    [node, containerValue]
  )

  const checked = isParentChecked(node, containerValue)
  // 是否是半选状态
  const indeterminate = !checked && hasChildChecked(node, containerValue)

  return (
    <Checkbox
      onClick={handleClick}
      onChange={handleChange}
      checked={checked}
      indeterminate={indeterminate}
    />
  )
})

import React, { Ref, useCallback } from 'react'
import { CloseOutlined, CloseCircleFilled } from '@ant-design/icons'
import classnames from 'classnames'
import Overflow from 'rc-overflow'
import { TreeNode } from '../index.d'
import { Props } from './MultiCascader'
import MultiCascaderContainer from '../container'
import { prefix } from '../constants'
export interface SelectorProps extends Props {
  onRemove: (value: TreeNode[]) => void
  onClear: () => void
  forwardRef?: Ref<HTMLDivElement>
}

const Tag = (props: {
  onRemove?: SelectorProps['onRemove']
  item: TreeNode[]
  renderTitle: Props['renderTitle']
  closable?: boolean
}) => {
  const {
    onRemove,
    item,
    renderTitle = () => undefined,
    closable = true,
  } = props
  const handleRemove = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation()
    if (onRemove) {
      onRemove(item)
    }
  }

  const value = item
  const title = renderTitle(value)

  return (
    <span className="self-ant-select-selection-item">
      <span className="self-ant-select-selection-item-content">{title}</span>
      {closable && (
        <span className="self-ant-select-selection-item-remove">
          <CloseOutlined onClick={handleRemove} />
        </span>
      )}
    </span>
  )
}

const Selector = (props: SelectorProps) => {
  const {
    width,
    onRemove,
    placeholder,
    allowClear,
    onClear,
    forwardRef,
    className,
    disabled,
    data,
    selectAll,
    value: valueProps,
    onChange,
    okText,
    cancelText,
    selectAllText,
    onCascaderChange,
    popupTransitionName,
    renderTitle,
    selectLeafOnly,
    getPopupContainer,
    maxTagCount,
    ...rest
  } = props
  const { selectedLeafNode } = MultiCascaderContainer.useContainer()

  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.stopPropagation()
      if (onClear) {
        onClear()
      }
    },
    [onClear]
  )

  const renderItem = useCallback(
    (item: any) => {
      return (
        <Tag
          key={item}
          onRemove={onRemove}
          item={item}
          renderTitle={renderTitle}
        />
      )
    },
    [renderTitle, onRemove]
  )

  const renderRest = useCallback(
    (omittedValues: TreeNode[][]) => (
      <Tag
        closable={false}
        renderTitle={() => <span>+{omittedValues.length}...</span>}
        item={[
          {
            label: '',
            value: '',
          }
        ]}
      />
    ),
    []
  )

  return (
    <div
      className={classnames(
        prefix,
        'self-ant-select self-ant-tree-select self-ant-select-multiple',
        className,
        {
          'self-ant-select-disabled': disabled,
        }
      )}
      ref={forwardRef}
      {...rest}
    >
      <div
        className="self-ant-select-selector"
        style={{ paddingRight: !disabled && allowClear ? '24px' : undefined, width: `${width}px`, borderRadius: '6px' }}
      >
        {selectedLeafNode.length ? (
          <Overflow
            prefixCls={`${prefix}-overflow`}
            data={selectedLeafNode}
            renderItem={renderItem}
            renderRest={renderRest}
            maxCount={maxTagCount}
          />
        ) : (
          <span
            className={`${prefix}-placeholder self-ant-select-selection-placeholder`}
          >
            {placeholder}
          </span>
        )}
      </div>
      <span className='self-ant-select-arrow'>
        <span role="img" aria-label="down" className="anticon anticon-down self-ant-select-suffix"><svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg></span>
      </span>
      {!disabled && allowClear ? (
        <span className="self-ant-select-clear" onClick={handleClear}>
          <CloseCircleFilled />
        </span>
      ) : null}
    </div>
  )
}

export default Selector

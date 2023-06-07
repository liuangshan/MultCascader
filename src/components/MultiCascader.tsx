import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { Empty } from 'antd'
import { ConfigContext } from 'antd/lib/config-provider'
import Trigger from 'rc-trigger'
import BUILT_IN_PLACEMENTS from '../libs/placement'
import Menu from './Menu'
import { TreeNode } from '../index.d'
import MultiCascaderContainer from '../container'
import Selector from './Selector'
import { matchAllLeafValue, reconcile } from '../libs/utils'
import { prefix } from '../constants'

import '../antd.css'

export interface Props {
  width?: number
  value?: string[][]
  data?: TreeNode[]
  allowClear?: boolean
  columnWidth?: number
  placeholder?: string
  onChange?: (newVal: string[][], selectedItems?: TreeNode[][]) => void
  onCascaderChange?: (
    node: TreeNode,
    operations: { add: (children: TreeNode[]) => TreeNode[] }
  ) => void
  selectAll?: boolean
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  okText?: string
  cancelText?: string
  selectAllText?: string
  popupTransitionName?: string
  selectLeafOnly?: boolean
  renderTitle?: (value: TreeNode[]) => ReactNode | undefined
  getPopupContainer?: (props: any) => HTMLElement
  maxTagCount?: number | 'responsive'
}

export interface PopupProps extends Props {
  onCancel?: () => void
  onConfirm?: () => void
  onLayout?: (dom: HTMLDivElement) => void
}

const Popup = (props: PopupProps) => {
  const ref = useRef(null)
  const {
    data,
    width,
  } = props

  return (
    <div className={`${prefix}-popup`} ref={ref}>
      {data && data.length ? (
        <>
          <Menu />
        </>
      ) : (
        <Empty style={{ width: `${width}px` }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  )
}

const Component = React.memo(
  React.forwardRef((props: Props, ref) => {
    const { getPopupContainer: getContextPopupContainer } = React.useContext(
      ConfigContext
    )
    const selectorRef = useRef(null)
    const {
      disabled,
      popupTransitionName = 'ant-slide-up',
      getPopupContainer,
    } = props
    const {
      popupVisible,
      setPopupVisible,
      flattenData,
      value,
      resetMenuState,
      triggerChange,
    } = MultiCascaderContainer.useContainer()

    const handleCancel = useCallback(() => {
      console.log(2)
      setPopupVisible(false)
    }, [])

    const handleItemRemove = useCallback(
      (item: TreeNode[]) => {
        let nextValue: (TreeNode)[]
        nextValue = reconcile(item[item.length - 1], false, value)

        triggerChange(nextValue)
      },
      [value, triggerChange]
    )

    const handleClear = useCallback(() => {
      resetMenuState()
      triggerChange([])
    }, [resetMenuState, triggerChange])

    const handleConfirm = useCallback(() => {
      triggerChange(value)
    }, [triggerChange, value])

    useImperativeHandle(
      ref,
      () => {
        return {
          // 匹配所有叶子节点的 value
          matchAllLeafValue: (v: TreeNode[]) =>
            matchAllLeafValue(v, flattenData),
        }
      },
      [flattenData]
    )

    return (
      <Trigger
        action={!disabled ? ['click'] : []}
        prefixCls={prefix}
        popup={
          <Popup {...props} onCancel={handleCancel} onConfirm={handleConfirm} />
        }
        popupVisible={disabled ? false : popupVisible}
        onPopupVisibleChange={setPopupVisible}
        popupStyle={{
          position: 'absolute',
          zIndex: 1050,
        }}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupPlacement="bottomLeft"
        popupTransitionName={popupTransitionName}
        getPopupContainer={getPopupContainer || getContextPopupContainer}
      >
        <Selector
          forwardRef={selectorRef}
          onRemove={handleItemRemove}
          onClear={handleClear}
          {...props}
        />
      </Trigger>
    )
  })
)

const MultiCascader: React.FunctionComponent<Props> = React.forwardRef(
  (props: Props, ref) => {
    return (
      <MultiCascaderContainer.Provider initialState={props}>
        <Component {...props} ref={ref} />
      </MultiCascaderContainer.Provider>
    )
  }
)

MultiCascader.defaultProps = {
  data: [],
  value: undefined,
}

export default MultiCascader
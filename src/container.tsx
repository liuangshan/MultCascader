import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createContainer } from 'unstated-next'
import { TreeNode } from './index.d'
import {
  transformValue as originalTransformValue,
  reconcile,
  findAllLeafNode,
  transTreeNodesToArray,
  transPropsValueToValues,
} from './libs/utils'
import { Props } from './components/MultiCascader'
import useFlattenData from './hooks/useFlattenData'

const useCascade = (params?: Props) => {
  const {
    // 全部级联数据
    data,
    // 用户选中的数据
    value: valueProp,
    onChange,
    onCascaderChange,
    selectLeafOnly,
  } = params || {}

  // 是否显示下垃圾
  const [popupVisible, setPopupVisible] = useState(false)
  // 被拍平后的全部数据
  const {flattenData} = useFlattenData(data)

  // menu里全部的数据，按列分
  const [menuData, setMenuData] = useState<any[]>([]);

  // 点击显示两的路径
  const [menuPath, setMenuPath] = useState<TreeNode[]>([]);

  // 把从props传入的value 转换成节点类型，并兼容其父子节点
  const transformValue = useCallback(
    (propsValue: string[][]) => {
      const value = transPropsValueToValues(propsValue, data || []);
      const nextValue = originalTransformValue(value, flattenData)

      // if (onChange && !shallowEqualArray(nextValue, value)) {
      //   requestAnimationFrame(() => triggerChange(nextValue))
      // }

      return nextValue
    },
    [flattenData]
  )
  // 选中的全部数据(合并后)
  const [value, setValue] = useState<TreeNode[]>([])


  // 选中的全部数据(合并前，原始数据)
  const selectedLeafNode = useMemo(() => findAllLeafNode(value), [value])

  // selector 的改变触发的函数
  const triggerChange = useCallback(
    (nextValue: TreeNode[]) => {
      const selectedLeafNode = findAllLeafNode(nextValue);
      const hasError = onChange && onChange(transTreeNodesToArray(selectedLeafNode), selectedLeafNode)
      if (hasError) {
        return
      }
      setValue(nextValue)
      console.log(1)
      setPopupVisible(false)
    },
    []
  )

  // 用户点击 menuItem 的时候的回调函数，动态显示columns
  const addMenu = useCallback((menu: TreeNode[], index: number) => {
    if (menu && menu.length) {
      setMenuData((prevMenuData) => [...prevMenuData.slice(0, index), menu])
    } else {
      setMenuData((prevMenuData) => [...prevMenuData.slice(0, index)])
    }
  }, [])

  // const addChildrenToNode = useCallback(
  //   (target: TreeNode, children: TreeNode[]): TreeNode[] => {
  //     const found = findNodeByValue(target.value, dataRef.current!)
  //     if (found) {
  //       found.children = children
  //     }
  //     return [...dataRef.current!]
  //   },
  //   []
  // )

  const lastItemRef = useRef<TreeNode | null>(null)

  const handleCascaderChange = useCallback(
    (item: TreeNode, depth: number) => {
      const { children } = item
      lastItemRef.current = item
      // onCascaderChange?.(item, {
      //   add: (newChildren: TreeNode[]) => {
      //     const newData = addChildrenToNode(item, newChildren)
      //     if (lastItemRef.current === item) {
      //       item.children = newChildren
      //       newChildren.forEach((child) => {
      //         child.parent = item
      //       })
      //       setFlattenData((prev) => [...prev, ...newChildren])
      //       handleCascaderChange(item, depth)
      //     }
      //     return newData
      //   },
      // })
      addMenu(children!, depth + 1)
      // 设置 亮的路径
      setMenuPath((prevMenuPath) => prevMenuPath.slice(0, depth).concat(item))
    },
    [menuPath, onCascaderChange]
  )

  const handleSelectChange = useCallback(
    (item: TreeNode, checked: boolean, value: TreeNode[]) => {
      const newValue = reconcile(item, checked, value);
      const selectedLeafNode = findAllLeafNode(newValue);
      const hasError = onChange && onChange(transTreeNodesToArray(selectedLeafNode), selectedLeafNode);
      if (hasError) {
        return
      }
      setValue([...newValue])
    },
    [flattenData]
  )

  const resetMenuState = useCallback(() => {
    if (flattenData.length === 1) {
      return setMenuData([])
    } else {
      setMenuData([flattenData.filter((item) => !item.parent)])
    }
    setMenuPath([])
  }, [flattenData])

  // 传入的 value 有变更时重新计算
  useEffect(() => {
    if (popupVisible) {
      setValue(transformValue(valueProp || []))
      resetMenuState()
    }
  }, [popupVisible])

  useEffect(() => {
    setValue(transformValue(valueProp || []))
  }, [valueProp])

  return {
    menuPath,
    popupVisible,
    setPopupVisible,
    menuData,
    addMenu,
    setMenuData,
    value,
    setValue,
    handleCascaderChange,
    handleSelectChange,
    flattenData,
    resetMenuState,
    triggerChange,
    selectLeafOnly,
    selectedLeafNode
  }
}

export default createContainer(useCascade)

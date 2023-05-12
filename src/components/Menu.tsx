import React, { useEffect, useRef, useState, useMemo } from 'react'
import { TreeNode } from '../index.d'
import { Props } from './MultiCascader'
import MultiCascader from '../container'
import { prefix } from '../constants'
import MenuItem from './MenuItem'
import { List } from 'react-virtualized';
import { Input } from 'antd'
import './Menu.less'
import { SearchOutlined } from '@ant-design/icons'

const Column = (props: {
  item: TreeNode[]
  columnWidth?: number
  depth: number
  setMenuData: React.Dispatch<React.SetStateAction<TreeNode[][]>>
}) => {
  const { item, columnWidth, depth, setMenuData } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(columnWidth)
  const [searchVal, setSearchVal] = useState<string>();

  const showOptions = useMemo(() => {
    setMenuData(preMenuData => preMenuData.slice(0, depth + 1))
    return item.filter(eachItem => {
      if (!searchVal?.length) {
        return true;
      }
      return eachItem.value.includes(searchVal)
    })
  }, [searchVal, item, depth])

  // 固定宽度，避免切换时菜单跳动的问题
  useEffect(() => {
    const { width: refWidth } = ref.current!.getBoundingClientRect()
    setWidth(refWidth)
  }, [])

  function rowRenderer ({
    key,         
    index,      
    isScrolling, 
    isVisible,   
    style      
  }) {
    return (
      <div
        key={key}
        style={style}
      >
        {<MenuItem key={showOptions[index].value} depth={depth} node={showOptions[index]} />}
      </div>
    )
  }

  return (
    <div
      className={`${prefix}-column`}
      style={{ width: `${columnWidth || width}px` }}
      ref={ref}
    >
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Input
            bordered={false}
            className={'itemtype-input'}
            prefix={<SearchOutlined />}
            value={searchVal}
            onChange={e => setSearchVal(e?.target?.value ?? '')}
            placeholder="请输入类型关键字"
            allowClear
          />
          <List
            width={245}
            height={180}
            rowCount={showOptions.length}
            rowHeight={32}
            rowRenderer={rowRenderer}
            />
      </div>
    </div>
  )
}

export default (props: Props) => {
  const { columnWidth } = props
  const { menuData, setMenuData } = MultiCascader.useContainer()

  return (
    <div className={`${prefix}-menu`}>
      {menuData.map((item, index) => {
        return (
          <Column
            item={item}
            columnWidth={columnWidth}
            depth={index}
            key={item[0]?.value || index}
            setMenuData={setMenuData}
          />
        )
      })}
    </div>
  )
}

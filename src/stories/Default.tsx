import React, { useState } from 'react'
import { Checkbox } from 'antd'
import { storiesOf } from '@storybook/react'
import MultiCascader from '../index'
import { UnorderedListOutlined } from '@ant-design/icons'

storiesOf('MultiCascader', MultiCascader as any).add('Default', () => {
  const [state, setState] = useState<string[][]>([['Node1', 'Node1-1', 'Node1-1-1'], ['Node1', 'Node1-1', 'Node1-1-2']])
  const [disabled, setDisabled] = useState<boolean>(false)
  const [options] = useState([
    {
      value: 'Node1',
      name: 'Node1',
      title: (
        <>
          <UnorderedListOutlined /> Node1
        </>
      ),
      children: [
        {
          value: 'Node1-1',
          name: 'Node1-1',
          title: (
            <>
              <UnorderedListOutlined /> Node1-1
            </>
          ),
          children: [
            {
              value: 'Node1-1-1',
              name: 'Node1-1-1',
              title: (
                <>
                  <UnorderedListOutlined /> Node1-1-1
                </>
              ),
            },
            {
              value: 'Node1-1-2',
              name: 'Node1-1-2',
              title: (
                <>
                  <UnorderedListOutlined /> Node1-1-2
                </>
              ),
            },
          ],
        },
        {
          value: 'Node1-2',
          name: 'Node1-2',
          title: (
            <>
              <UnorderedListOutlined /> Node1-2
            </>
          ),
        },
      ],
    },
    {
      value: 'Node2',
      name: 'Node2',
      title: 'Node2',
    },
  ])

  const handleChange = (e) => setDisabled(e.target.checked)

  return (
    <>
      <MultiCascader
        data={options}
        value={state}
        onChange={(val, selectedOption) => {
          console.log('change val: ', val);
          console.log('change selectedOption: ', selectedOption);
          setState(val)
        }}
        allowClear
        disabled={disabled}
        placeholder="Default"
        style={{ width: '200px' }}
        renderTitle={(node) => {
          let res = '';
          if (!node?.length) {
            return res;
          }
          node.forEach(eachLeaf => {
            res += `(${eachLeaf.value})`;
          })
          return res;
        }}
        maxTagCount={2}
      />
      <div>
        <Checkbox checked={disabled} onChange={handleChange}>
          Disabled
        </Checkbox>
      </div>
    </>
  )
})

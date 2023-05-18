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
      label: (
        <>
          <UnorderedListOutlined /> Node1
        </>
      ),
      children: [
        {
          value: 'Node1-1',
          name: 'Node1-1',
          label: (
            <>
              <UnorderedListOutlined /> Node1-1
            </>
          ),
          children: [
            {
              value: 'Node1-1-1',
              name: 'Node1-1-1',
              label: (
                <>
                  <UnorderedListOutlined /> Node1-1-1
                </>
              ),
            },
            {
              value: 'Node1-1-2',
              name: 'Node1-1-2',
              label: (
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
          label: (
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
      label: 'Node2',
    },
    {
      value: 'Node3',
      name: 'Node3',
      label: 'Node3',
    },
    {
      value: 'Node4',
      name: 'Node4',
      label: 'Node4',
    },
    {
      value: 'Node5',
      name: 'Node5',
      label: 'Node5',
    },
    {
      value: 'Node6',
      name: 'Node6',
      label: 'Node6',
    },
    {
      value: 'Node7',
      name: 'Node7',
      label: 'Node7',
    },
    {
      value: 'Node8',
      name: 'Node8',
      label: 'Node8',
    },
    {
      value: 'Node9',
      name: 'Node9',
      label: 'Node9',
    },
    {
      value: 'Node10',
      name: 'Node10',
      label: 'Node10',
    },
    {
      value: 'Node11',
      name: 'Node11',
      label: 'Node11',
    },
    {
      value: 'Node12',
      name: 'Node12',
      label: 'Node12',
    },
    {
      value: 'Node13',
      name: 'Node13',
      label: 'Node13',
    },
    {
      value: 'Node14',
      name: 'Node14',
      label: 'Node14',
    },
    {
      value: 'Node15',
      name: 'Node15',
      label: 'Node15',
    },
    {
      value: 'Node16',
      name: 'Node16',
      label: 'Node16',
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
        width={480}
        renderTitle={(node) => {
          if (!node?.length) {
            return '';
          }
          let res = node[0].value;
          for (let i = 1;i < node.length;i++) {
            res += `(${node[i].value})`;
          }
          return res;
        }}
        maxTagCount="responsive"
      />
      <div>
        <Checkbox checked={disabled} onChange={handleChange}>
          Disabled
        </Checkbox>
      </div>
    </>
  )
})

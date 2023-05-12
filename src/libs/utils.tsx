import { TreeNode } from '../index.d'

// 平铺树结构，方便根据 value（字符串） 获取到所有的 NodeItem 节点
// 添加 parent 链接到父节点
export function flattenTree(root: TreeNode[]): TreeNode[] {
  const res: TreeNode[] = []

  function dfs(nodes: TreeNode[], parent: TreeNode | null = null) {
    if (!nodes) {
      return
    }

    const newChildren: TreeNode[] = []

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const { children } = node

      const newNode = {
        ...node,
        parent,
      }

      res.push(newNode)
      newChildren.push(newNode)
      if (children) {
        dfs(children, newNode)
      }
    }

    if (parent) {
      // eslint-disable-next-line no-param-reassign
      parent.children = newChildren
    }
  }
  dfs(root)

  return res
}

// 是否有子节点（包括自己）被选中
export function hasChildChecked(
  item: TreeNode,
  curValue: TreeNode[]
): boolean {
  function dfs(node: TreeNode): boolean {
    if (!node) {
      return false
    }

    const { children } = node

    if (curValue.includes(node)) {
      return true
    }
    if (!children) {
      return false
    }
    return children.some((child: TreeNode) => dfs(child))
  }

  return dfs(item)
}

/**
 * 判断两个节点是不是彻底相等
 * @param node 当前节点
 * @param comparedNode 被比较的节点
 */
function isSameNode(node: TreeNode | null | undefined, comparedNode: TreeNode | null | undefined) {
  // 终止条件
  if (node == null && comparedNode == null) {
    return true;
  }
  if (node?.value !== comparedNode?.value) {
    return false
  }

  return isSameNode(node?.parent, comparedNode?.parent);
}

/**
 * 判断当前的 nodeList 里是否有 node
 * @param nodeList node列表
 * @param node 当前节点
 * @returns 
 */
function isHasSameNode(nodeList, node) {
  let res = false;
  nodeList.forEach(eachNode => {
    if (isSameNode(eachNode, node)) {
      res = true;
    }
  })

  return res;
}

// 是否有父节点（包括自己）被选中
/**
 * 
 * @param item 被更改的节点
 * @param value 之前全部选择的值
 * @returns 
 */
export function isParentChecked(item: TreeNode, value: TreeNode[]): boolean {
  let tmp: TreeNode | null | undefined = item

  while (tmp) {
    const isExist = value.find(eachValue => isSameNode(tmp, eachValue));
    if (isExist) {
      return true
    }

    tmp = tmp.parent
  }

  return false
}

export function matchAllLeafValue(
  value: TreeNode[],
  roots: Array<TreeNode>
): TreeNode[] {
  const res: TreeNode[] = []

  function dfs(nodes: TreeNode[] | undefined, needed: boolean) {
    if (!nodes) {
      return
    }

    nodes.forEach((node: TreeNode) => {
      const { children } = node

      if (needed || isHasSameNode(value, node)) {
        if (!children) {
          // 叶子节点
          res.push(node)
        } else {
          dfs(children, true)
        }
      } else {
        dfs(children, needed)
      }
    })
  }
  dfs(roots, false)

  return Array.from(new Set(res))
}

/**
 * 获取 root 下全部的子元素(不包含root本身)，再对value进行一层过滤，过滤掉root下的子元素
 * @param root 当前选中节点 的最顶层节点
 * @param value 已经选中的值
 * @returns 更改后的value
 */
export function removeAllDescendanceValue(
  root: TreeNode,
  value: TreeNode[]
): TreeNode[] {
  const allChildrenValue: TreeNode[] = []
  function dfs(node: TreeNode): void {
    if (node.children) {
      node.children.forEach((item) => {
        allChildrenValue.push(item)
        dfs(item)
      })
    }
  }
  dfs(root)
  return value.filter((val) => !isHasSameNode(allChildrenValue, val))
}

// 状态提升
export function liftTreeState(
  // 被更改的节点
  item: TreeNode,
  // 之前全部选择的值
  curVal: TreeNode[]
): TreeNode[] {
  // 加入当前节点 value
  const nextValue = curVal.concat(item)
  let last = item

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 如果父节点的所有子节点都已经 checked, 添加该节点 value，继续尝试提升
    if (
      last && last?.parent?.children!.every((child: TreeNode) =>
        isHasSameNode(nextValue, child)
      )
    ) {
      nextValue.push(last.parent)
      last = last.parent
    } else {
      break
    }
  }
  // 找到被更改的节点item受影响的顶级父元素，删除nextValue中 属于父元素的子元素
  return removeAllDescendanceValue(last, nextValue)
}

// 找到 受 被更改的节点 影响的父级节点
function getCheckedParent(
  node: TreeNode | null | undefined,
  parentValues: TreeNode[],
  value: TreeNode[]
): TreeNode | null {
  if (!node) {
    return null
  }
  parentValues.push(node)
  if (isHasSameNode(value, node)) {
    return node
  }

  return getCheckedParent(node.parent, parentValues, value)
}

// 状态下沉
/**
 * 如果它的父元素被选中，则删除父元素，把父元素下选择的子元素都推入value
 * @param root 被更改的节点
 * @param value 之前全部选择的值
 * @returns 
 */
export function sinkTreeState(root: TreeNode, value: TreeNode[]): TreeNode[] {
  // value 这条路径下的全部节点(包含自己)
  const parentValues: TreeNode[] = []
  // checkedParent下的全部叶子节点(不包含自己)
  const subTreeValues: TreeNode[] = []

  // 找到 受 被更改的节点 影响的父级节点
  const checkedParent = getCheckedParent(root, parentValues, value)
  // 如果没有，则根本不需要管他
  if (!checkedParent) {
    return value
  }

  function dfs(node: TreeNode) {
    if (!node.children || node.value === root.value) {
      return
    }
    node.children.forEach((item: TreeNode) => {
      if (item.value !== root.value) {
        if (parentValues.includes(item)) {
          dfs(item)
        } else {
          subTreeValues.push(item)
        }
      }
    })
  }
  dfs(checkedParent)
  // 替换 checkedParent 下子树的值
  const nextValue = removeAllDescendanceValue(checkedParent, value).filter(
    (item) => item !== checkedParent
  )
  return Array.from(new Set(nextValue.concat(subTreeValues)))
}

// checked, unchecked 时重新计算
// 如果父节点已经选中了，返回之前全部选择的值(兼容父元素后)
/**
 * 把变动的节点(不管是选中还是没选中)，从value里新增或删除时，兼容它的父节点与子节点
 * @param item 变动的节点
 * @param checked 变动的节点到底是选中还是未选中状态
 * @param value 之前全部选择的值
 * @returns TreeNode[]
 */
export function reconcile(
  item: TreeNode,
  checked: boolean,
  value: TreeNode[]
): TreeNode[] {
  if (checked) {
    // 如果已经有父节点被 checked, 再进行 checked 没有意义，直接忽略
    // 主要是用在避免初始化时传入的 value 结构不合理
    if (isParentChecked(item, value)) {
      return value
    }
    return liftTreeState(item, value)
  }
  return sinkTreeState(item, value)
}

// // 按树的 dfs 前序排
// export function sortByTree(value: TreeNode[], flattenData: TreeNode[]) {
//   // 按照树结构前顺排序
//   const map = flattenData.reduce(
//     (cur: Record<string, number>, node: TreeNode, index: number) => {
//       cur[node.value] = index
//       return cur
//     },
//     {}
//   )
//   return value.sort((a, b) => map[a.value] - map[b.value] || 0)
// }

// 过滤非法数据，排序
export function transformValue(value: TreeNode[], flattenData: TreeNode[]) {
  let nextValue: TreeNode[] = [];
  for (let i = 0; i < value.length; i++) {
    const node = flattenData.find((item) => isSameNode(item, value[i]))
    if (node) {
      nextValue = reconcile(node, true, nextValue)
    } else {
      nextValue.push(value[i])
    }
  }
  // return sortByTree(nextValue, flattenData)
  return nextValue
}

export function shallowEqualArray(arrA, arrB) {
  if (arrA === arrB) {
    return true
  }

  if (!arrA || !arrB) {
    return false
  }

  var len = arrA.length

  if (arrB.length !== len) {
    return false
  }

  for (var i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false
    }
  }

  return true
}

// // 通过 value 查找树节点
// export function findNodeByValue(
//   value: string,
//   tree: TreeNode[]
// ): TreeNode | undefined {
//   function findParent(nodes: TreeNode[]): TreeNode | undefined {
//     if (!nodes) {
//       return undefined
//     }
//     for (let i = 0; i < nodes.length; i++) {
//       const node = nodes[i]

//       if (value === node.value) {
//         return node
//       }
//       if (node.children) {
//         const foundInChildren = findParent(node.children)
//         if (foundInChildren) {
//           return foundInChildren
//         }
//       }
//     }
//   }

//   return findParent(tree)
// }

/**
 * 在 allData 里查找出 propsValue 里全部的节点
 * @param propsValues 用户输入的value
 * @param allData 全部的节点
 * @returns 
 */
export function transPropsValueToValues(propsValues: string[][], allData: TreeNode[]) {
  let res: TreeNode[] = [];
  propsValues.forEach(eachNodeValues => {
    let nodeArr: TreeNode[] = [];
    let curLevelNodes = allData;
    for (let i = 0;i < eachNodeValues.length;i++) {
      let curNode = curLevelNodes?.find(node => node.value === eachNodeValues[i]);
      curLevelNodes = curNode?.children || [];
      if (curNode) {
        nodeArr.push(curNode)
      } else {
        nodeArr = [];
        break;
      }
    }
    for (let i = nodeArr.length - 1;i > 0;i--) {
      nodeArr[i].parent = nodeArr[i - 1];
    }
    if (nodeArr.length) {
      res = reconcile(nodeArr[nodeArr.length - 1], true, res);
    }
  })

  return res;
}

/**
 * 把 TreeNode 类型的树型节点转换成数组对象(返回给onchange的第二个参数)
 * @param leafNode 
 * @returns 
 */
function transLeafToPathArr(leafNode: TreeNode) {
  let res: TreeNode[] = [];
  let curNode: TreeNode | null | undefined = leafNode;
  while(curNode) {
    res.unshift(curNode);
    curNode = curNode.parent;
  }

  return res;
}

/**
 * 把 selectedNode 里的全部叶子节点或自身推送到 selectedNodeLeafArr 里去
 * @param selectedNode 被推入的节点
 * @param selectedNodeLeafArr 被推入的数组
 * @returns 
 */
function dfsSelectedNode(selectedNode: TreeNode, selectedNodeLeafArr: TreeNode[]) {
  // 设置终止条件
  if (!selectedNode.children) {
    selectedNodeLeafArr.push(selectedNode);
    return;
  }

  selectedNode.children.forEach(childNode => dfsSelectedNode(childNode, selectedNodeLeafArr));
}

// 获取 selectedNodes 下所有节点到叶子节点的全部路径
export function findAllLeafNode(selectedNodes: TreeNode[]) {
  const res: TreeNode[][] = [];
  selectedNodes.forEach(selectedNode => {
    // 如果 selectedNode 是叶子节点
    if (!selectedNode.children) {
      res.push(transLeafToPathArr(selectedNode));
      return;
    }
    // 如果 selectedNode 不是叶子节点，则要获取它全部的叶子节点
    const selectedNodeLeafArr = [];
    dfsSelectedNode(selectedNode, selectedNodeLeafArr);
    selectedNodeLeafArr.forEach((leafNode) => {
      res.push(transLeafToPathArr(leafNode));
    })
  })

  return res;
}

// 把多维的叶子节点数组，转换成字符串类型的数组
export function transTreeNodesToArray(treeNodes: TreeNode[][]) {
  return treeNodes.map(treeNode => {
    const values: string[] = [];
    treeNode.forEach(eachLevelNode => values.push(eachLevelNode.value));
    return values;
  })
}
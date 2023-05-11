import { useEffect, useState } from "react";
import { flattenTree } from "../libs/utils";

// 平铺树结构，方便根据 value（字符串） 获取到所有的 NodeItem 节点
// 添加 parent 链接到父节点
function useFlattenData(data) {

  const [flattenData, setFlattenData] = useState(flattenTree(data || []))

  useEffect(() => {
    setFlattenData(() => {
      return flattenTree(data || [])
    })
  }, [data])

  return {
    flattenData,
    setFlattenData
  }
}

export default useFlattenData;

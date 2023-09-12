import { TreeNodeInterface } from '@shared/components/tree-table/tree-table.component';

function convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
  const stack: TreeNodeInterface[] = [];
  const array: TreeNodeInterface[] = [];
  const hashMap = {};
  stack.push({ ...root, level: 0, expand: false, _checked: false });

  while (stack.length !== 0) {
    const node = stack.pop()!;
    visitNode(node, hashMap, array);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ ...node.children[i], level: node.level! + 1, _checked: false, expand: false, parent: node });
      }
    }
  }

  return array;
}

function visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
  if (!hashMap[node.id]) {
    hashMap[node.id] = true;
    array.push(node);
  }
}

// Lấy treeData ở dạng bản đồ và tham số đầu vào là dataList
const fnTreeDataToMap = function tableToTreeData(dataList: any[]): { [key: string]: TreeNodeInterface[] } {
  const mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  dataList.forEach(item => {
    mapOfExpandedData[item.id] = convertTreeToList(item);
  });
  return mapOfExpandedData;
};

/**
 * Phương thức này dùng để chuyển đổi mảng có quan hệ cha-con thành mảng có cấu trúc cây
 * Nhận một mảng có tham số là mối quan hệ cha-con
 * Trả về một mảng cấu trúc cây
 */
const fnFlatDataHasParentToTree = function translateDataToTree(data: any[], fatherId = 'fatherId'): any {

  // Chúng tôi tin rằng dữ liệu có parentId=0 là dữ liệu cấp một
  // dữ liệu không có nút cha
  let parents = data.filter(value => value[fatherId] === 0)
  .sort((a, b) => a.orderNum - b.orderNum);

  //Dữ liệu với nút cha
  let children = data.filter(value => value[fatherId] !== 0)
  .sort((a, b) => a.orderNum - b.orderNum);

  //Xác định cách triển khai cụ thể của phương thức chuyển đổi
  let translator = (parents: any[], children: any[]): any => {
    //Duyệt qua dữ liệu nút cha
    parents.forEach(parent => {
      //Duyệt qua dữ liệu nút con
      children.forEach((current, index) => {
        //Lúc này, một nút con tương ứng với nút cha được tìm thấy.
        if (current[fatherId] === parent.id) {
          //Thực hiện sao chép sâu dữ liệu nút con. Ở đây chỉ hỗ trợ một số loại dữ liệu sao chép sâu. Giày trẻ em chưa quen với bản sao sâu có thể tìm hiểu về bản sao sâu trước.
          let temp = JSON.parse(JSON.stringify(children));
          //Hãy xóa nút con hiện tại khỏi temp và temp được sử dụng làm dữ liệu nút con mới. Điều này nhằm làm cho số lần truyền qua nút con ít hơn trong quá trình đệ quy. Nếu mối quan hệ cha-con có nhiều cấp độ hơn thì sẽ nhiều hơn có lợi
          temp.splice(index, 1);
          //Đặt nút con hiện tại là nút cha duy nhất và tìm kiếm đệ quy nút con tương ứng của nó.
          translator([current], temp);
          //Đặt nút con tìm thấy vào thuộc tính con của nút cha
          typeof parent.children !== 'undefined' ? parent.children.push(current) : (parent.children = [current]);
        }
      });
    });
  };
  //phương pháp chuyển đổi cuộc gọi
  translator(parents, children);
  return parents;
};

// Thêm một hệ thống phân cấp vào dữ liệu cấu trúc cây và đánh dấu xem đó có phải là nút gốc hay không, nút gốc isLeaf là đúng và cấp độ được biểu thị bằng cấp độ
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fnAddTreeDataGradeAndLeaf = function AddTreeDataGradeAndLeaf(array: any[], levelName = 'level', childrenName = 'children') {
  const recursive = (array: any[], level = 0): any => {
    level++;
    return array.map((v: any) => {
      v[levelName] = level;
      const child = v[childrenName];
      if (child && child.length > 0) {
        v.isLeaf = false;
        recursive(child, level);
      } else {
        v.isLeaf = true;
      }
      return v;
    });
  };
  return recursive(array);
};

// Dữ liệu cây phẳng
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fnFlattenTreeDataByDataList = function flattenTreeData(dataList: any[]) {
  const mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = fnTreeDataToMap(dataList);
  return fnGetFlattenTreeDataByMap(mapOfExpandedData);
};

// Lấy dữ liệu cây phẳng và tham số đầu vào là treeData ở dạng bản đồ.
const fnGetFlattenTreeDataByMap = function getFlattenTreeData(mapOfExpandedData: { [key: string]: TreeNodeInterface[] }): TreeNodeInterface[] {
  const targetArray: TreeNodeInterface[] = [];
  Object.values(mapOfExpandedData).forEach(item => {
    item.forEach(item_1 => {
      targetArray.push(item_1);
    });
  });
  return targetArray;
};

export { fnTreeDataToMap, fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList, fnGetFlattenTreeDataByMap };

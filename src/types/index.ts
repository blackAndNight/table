const uuidv1 = require("uuid/v1");

class QueueNode {
  value: any;
  next: any;
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  first: any;
  last: any;
  size: any;
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  //newnode goes to back of the line/end of the queue
  enqueue(value) {
    const newNode = new QueueNode(value);
    //if queue is empty
    if (this.size === 0) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    this.size++;

    return this;
  }
  // dequeue nodes off the front of the line
  dequeue() {
    if (this.size === 0) return false;
    const dequeuedNode = this.first;
    const newFirst = this.first.next;
    if (!newFirst) {
      this.last = newFirst;
    }
    this.first = newFirst;
    dequeuedNode.next = null;
    this.size--;
    return dequeuedNode;
  }
}

export class TreeNode {
  id: string;
  verticalSpan: number;
  color: string;
  value: number | string;
  children: TreeNode[];
  width: number;
  constructor(value: number | string, color: string, verticalSpan: number) {
    this.id = `${value}_${uuidv1()}`;
    this.value = value;
    this.children = [];
    this.color = color;
    this.verticalSpan = verticalSpan;
    this.width = !!this.children.length ? this.children.length : 1;
  }
}

export class Tree {
  root: any;
  constructor() {
    this.root = null;
  }

  traverseBFS(): { nodes: TreeNode[]; leavesAmount: number } {
    if (!this.root) {
      return { nodes: [], leavesAmount: 0 };
    }
    let leavesAmount = 0;
    const queue = new Queue();
    const nodes: TreeNode[] = [];
    queue.enqueue(this.root);

    while (queue.size !== 0) {
      const nodeChildren = queue.first.value.children;
      if (nodeChildren.length !== 0) {
        nodeChildren.forEach((child) => queue.enqueue(child));
      } else {
        leavesAmount += 1;
      }
      const width = getLeavesCount(queue.first.value);
      nodes.push({ ...queue.first.value, width });
      queue.dequeue();
    }
    
    return { nodes, leavesAmount };
  }
}

const getLeavesCount = (node): number => {
  let leaves = 0;
  let current = node;

  const postOrderHelper = (node: TreeNode) => {
    if (node.children.length !== 0) {
      node.children.forEach((child) => {
        postOrderHelper(child);
      });
    } else {
      leaves += 1;
    }
    return true;
  };
  postOrderHelper(current);
  return leaves;
};

export class TableCell {
  id: string;
  verticalSpan: number;
  color: string;
  value: number | string;
  width: number;
  constructor(
    value: number | string,
    color: string,
    verticalSpan: number,
    width: number,
    id?: string
  ) {
    this.id = !!id ? id : `${value}_${uuidv1()}`;
    this.value = value;
    this.color = color;
    this.verticalSpan = verticalSpan;
    this.width = width;
  }
}

export enum MockType {
  rowSpan = "Row Span",
  colSpan = "Column Span",
}

export class TableCellMock {
  id: string;
  parentId: string;
  type: MockType;
  constructor(type: MockType, parentId: string) {
    this.id = uuidv1();
    this.parentId = parentId;
    this.type = type;
  }
}

export class MockInfo {
  width: number;
  colIndex: number;
  rowIndex: number;
  parentId: string;
  type: MockType;
  constructor(width: number, colIndex: number, rowIndex: number, parentId: string, type?: MockType) {
    this.width = width;
    this.colIndex = colIndex;
    this.rowIndex = rowIndex;
    this.parentId = parentId;
    this.type = !!type ? type : MockType.rowSpan;
  }
}

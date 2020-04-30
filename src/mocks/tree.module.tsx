import {Tree, TreeNode } from "types";



//simple tree
const simpleTree = new Tree();
simpleTree.root = new TreeNode("TT (tree table - no row spans)", "#73bcf9", 1);
simpleTree.root.children.push(new TreeNode(1, "#ffb74d", 1));
simpleTree.root.children.push(new TreeNode(2, "#ffb74d", 1));
simpleTree.root.children.push(new TreeNode(3, "#ffb74d", 1));
simpleTree.root.children.push(new TreeNode(4, "#ffb74d", 1));
simpleTree.root.children[0].children.push(new TreeNode(5, "#aed581", 1));
simpleTree.root.children[1].children.push(new TreeNode(6, "#aed581", 1));
simpleTree.root.children[2].children.push(new TreeNode(7, "#aed581", 1));
simpleTree.root.children[3].children.push(new TreeNode(8, "#aed581", 1));

simpleTree.root.children[0].children[0].children.push(
  new TreeNode(9, "#ba68c8", 1)
);
simpleTree.root.children[1].children[0].children.push(
  new TreeNode(10, "#ba68c8", 1)
);
simpleTree.root.children[2].children[0].children.push(
  new TreeNode(11, "#ba68c8", 1)
);
simpleTree.root.children[3].children[0].children.push(
  new TreeNode(12, "#ba68c8", 1)
);


//vertical span
const verticalSpanTree = new Tree();

verticalSpanTree.root = new TreeNode("TT (tree table - with row spans)", "#73bcf9", 1);
verticalSpanTree.root.children.push(new TreeNode(1, "#ffb74d", 1));
verticalSpanTree.root.children.push(new TreeNode(2, "#ffb74d", 1));
verticalSpanTree.root.children.push(new TreeNode(3, "#ffb74d", 2));

verticalSpanTree.root.children[0].children.push(new TreeNode(4, "#aed581", 1));
verticalSpanTree.root.children[0].children.push(new TreeNode(5, "#aed581", 1));
verticalSpanTree.root.children[1].children.push(new TreeNode(6, "#aed581", 2));

verticalSpanTree.root.children[2].children.push(new TreeNode(9, "#ba68c8", 1));
verticalSpanTree.root.children[2].children.push(new TreeNode(10, "#ba68c8", 1));
verticalSpanTree.root.children[0].children[0].children.push(
  new TreeNode(7, "#ba68c8", 1)
);
verticalSpanTree.root.children[0].children[1].children.push(
  new TreeNode(8, "#ba68c8", 1)
);

//colspans only
const colspanOnlyTree = new Tree();
colspanOnlyTree.root = new TreeNode("TT (tree table - no row spans)", "#73bcf9", 1);
colspanOnlyTree.root.children.push(new TreeNode(1, "#ffb74d", 1));
colspanOnlyTree.root.children.push(new TreeNode(2, "#ffb74d", 1));
colspanOnlyTree.root.children.push(new TreeNode(3, "#ffb74d", 1));

colspanOnlyTree.root.children[0].children.push(new TreeNode(4, "#aed581", 1));
colspanOnlyTree.root.children[0].children.push(new TreeNode(5, "#aed581", 1));
colspanOnlyTree.root.children[1].children.push(new TreeNode(6, "#aed581", 1));
colspanOnlyTree.root.children[2].children.push(new TreeNode(7, "#aed581", 1));

colspanOnlyTree.root.children[0].children[0].children.push(
  new TreeNode(8, "#ba68c8", 1)
);
colspanOnlyTree.root.children[0].children[1].children.push(
  new TreeNode(9, "#ba68c8", 1)
);
colspanOnlyTree.root.children[1].children[0].children.push(
  new TreeNode(10, "#ba68c8", 1)
);
colspanOnlyTree.root.children[2].children[0].children.push(
  new TreeNode(11, "#ba68c8", 1)
);
colspanOnlyTree.root.children[2].children[0].children.push(
  new TreeNode(12, "#ba68c8", 1)
);

export const verticalSpanTreeData = verticalSpanTree.traverseBFS();
export const colspanOnlyTreeData = colspanOnlyTree.traverseBFS();
export const simpleTreeData = simpleTree.traverseBFS();

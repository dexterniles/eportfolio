---
title: Binary Search Tree
course: cis158
section: c-projects
date: 2026-04-19
summary: "Builds a binary search tree from user input, prints all three traversals, and reports its height and a search result."
software: C · gcc · make
cover: ./images/binary-search-tree.png
coverAlt: "Terminal window showing in-order, pre-order, and post-order traversals of a binary search tree"
code:
  dir: /code/cis158/binary-search-tree
  files: [main.c, bst.h, bst.c, Makefile]
order: 13.6
---

From the data structures unit. Integers are inserted into a binary search tree, where smaller values go left and larger values go right, and the tree is walked three different ways. Height and search were extra credit.

## Sample run
Inserting 8, 3, 10, 1, 6, 14, 4, 7, 13:

```text
$ make
$ ./main
Enter integers to insert into the BST (end with -1): 8 3 10 1 6 14 4 7 13 -1
In-order Traversal: 1 3 4 6 7 8 10 13 14
Pre-order Traversal: 8 3 1 6 4 7 10 14 13
Post-order Traversal: 1 4 7 6 3 13 14 10 8
Height of BST: 3
Search for 7: found
```

## How it works
- **Recursive insert.** `insert` walks left or right by comparing values, allocates a new node with `malloc` when it reaches an empty spot, and returns the root so the tree can be rebuilt on the way back up. Duplicate values are ignored.
- **Three traversals.** In-order (left, root, right) prints the values sorted; pre-order (root first) and post-order (root last) show the shape of the tree.
- **Height** is `1 + max(left height, right height)`, with an empty tree counting as -1, so a single node has height 0. The tree above has height 3 (8 → 10 → 14 → 13).
- **Search** follows the same left/right rule as insert, so it only visits one path down the tree.
- **Freeing memory.** `freeTree` uses a post-order walk so each node's children are freed before the node itself.

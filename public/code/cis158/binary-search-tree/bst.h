/* A binary search tree of integers. */

#ifndef BST_H
#define BST_H

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

/* one node in the binary search tree */
struct Node {
	int value;
	struct Node *left;
	struct Node *right;
};

typedef struct Node Node;

Node *insert(Node *root, int value);             /* add a value to the tree                  */
void inOrderTraversal(const Node *root);         /* print left, root, right                  */
void preOrderTraversal(const Node *root);        /* print root, left, right                  */
void postOrderTraversal(const Node *root);       /* print left, right, root                  */
void freeTree(Node *root);                       /* release every node in the tree           */

bool search(const Node *root, int value);        /* extra credit: true if value is present   */
int height(const Node *root);                    /* extra credit: -1 for empty, 0 for a leaf */

#endif

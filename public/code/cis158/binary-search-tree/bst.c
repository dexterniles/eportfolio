/* The basic BST routines. */

#include "bst.h"

/* insert value into the BST and return the (possibly new) root */
Node *insert(Node *root, int value)
{
	if (root == NULL) {
		/* empty spot found: allocate a new leaf */
		Node *p = malloc(sizeof(Node));
		p -> value = value;
		p -> left = NULL;
		p -> right = NULL;
		return p;
	}
	if (value < root -> value)
		root -> left = insert(root -> left, value);
	else if (value > root -> value)
		root -> right = insert(root -> right, value);
	/* equal values are ignored */
	return root;
}

/* print the tree in-order: left, root, right (sorted order) */
void inOrderTraversal(const Node *root)
{
	if (root == NULL)
		return;
	inOrderTraversal(root -> left);
	printf("%d ", root -> value);
	inOrderTraversal(root -> right);
}

/* print the tree pre-order: root, left, right */
void preOrderTraversal(const Node *root)
{
	if (root == NULL)
		return;
	printf("%d ", root -> value);
	preOrderTraversal(root -> left);
	preOrderTraversal(root -> right);
}

/* print the tree post-order: left, right, root */
void postOrderTraversal(const Node *root)
{
	if (root == NULL)
		return;
	postOrderTraversal(root -> left);
	postOrderTraversal(root -> right);
	printf("%d ", root -> value);
}

/* free every node in the tree (post-order so children go before the parent) */
void freeTree(Node *root)
{
	if (root == NULL)
		return;
	freeTree(root -> left);
	freeTree(root -> right);
	free(root);
}

/* return true if value is in the tree */
bool search(const Node *root, int value)
{
	if (root == NULL)
		return false;
	if (value == root -> value)
		return true;
	if (value < root -> value)
		return search(root -> left, value);
	return search(root -> right, value);
}

/* return the height of the tree: -1 for empty, 0 for a single node */
int height(const Node *root)
{
	int lh, rh;

	if (root == NULL)
		return -1;
	lh = height(root -> left);
	rh = height(root -> right);
	return 1 + (lh > rh ? lh : rh);
}

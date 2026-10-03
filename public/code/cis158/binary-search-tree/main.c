#include "bst.h"

int main(void)
{
	Node *root = NULL;   /* the BST starts empty */
	int x;

	/* read integers until -1 and insert each one */
	printf("Enter integers to insert into the BST (end with -1): ");
	while (scanf("%d", &x) == 1 && x != -1)
		root = insert(root, x);

	/* print the three traversal orders */
	printf("In-order Traversal: ");
	inOrderTraversal(root);
	putchar('\n');

	printf("Pre-order Traversal: ");
	preOrderTraversal(root);
	putchar('\n');

	printf("Post-order Traversal: ");
	postOrderTraversal(root);
	putchar('\n');

	/* extra credit: height and a sample search */
	printf("Height of BST: %d\n", height(root));
	printf("Search for 7: %s\n", search(root, 7) ? "found" : "not found");

	freeTree(root);
	return 0;
}

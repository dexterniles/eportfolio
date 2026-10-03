#include "stack.h"

int main(void)
{
	int n, i, x;
	stack s;

	initialize(&s);
	printf("How many integers? ");
	scanf("%d", &n);

	/* push every integer onto the stack */
	printf("Enter %d integers: ", n);
	for (i = 0; i < n; ++i) {
		scanf("%d", &x);
		if (!full(&s))
			push(x, &s);
	}

	/* pop them back off to print in reverse order */
	printf("Reversed: ");
	while (!empty(&s))
		printf("%d ", pop(&s));
	putchar('\n');

	return 0;
}

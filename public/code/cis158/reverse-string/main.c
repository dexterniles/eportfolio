#include "stack.h"
#include <string.h>

int main(void)
{
	char str[256];   /* input buffer */
	int i;
	stack s;

	do {
		initialize(&s);
		printf("Enter a string to see it in reverse: ");
		fgets(str, sizeof(str), stdin);
		str[strcspn(str, "\n")] = '\0';   /* drop trailing newline */

		/* push every character onto the stack */
		for (i = 0; str[i] != '\0'; ++i)
			if (!full(&s))
				push(str[i], &s);

		/* pop them back off to print in reverse order */
		printf("Reversed: ");
		while (!empty(&s))
			putchar(pop(&s));
		putchar('\n');

		printf("Enter another? (y/n): ");
		fgets(str, sizeof(str), stdin);
	} while (str[0] == 'y' || str[0] == 'Y');

	return 0;
}
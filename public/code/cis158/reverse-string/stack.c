/* The basic stack routines. */

#include "stack.h"

/* set the stack to empty */
void initialize(stack *stk)
{
	stk -> cnt = 0;
	stk -> top = NULL;
}

/* add a new node containing d to the top of the stack */
void push(data d, stack *stk)
{
	elem *p;

	p = malloc(sizeof(elem));
	p -> d = d;
	p -> next = stk -> top;
	stk -> top = p;
	stk -> cnt++;
}

/* remove the top node and return its value */
data pop(stack *stk)
{
	data d;
	elem *p;

	d = stk -> top -> d;
	p = stk -> top;
	stk -> top = stk -> top -> next;
	stk -> cnt--;
	free(p);
	return d;
}

/* return the value at the top without removing it */
data top(stack *stk)
{
	return (stk -> top -> d);
}

/* true if the stack has no elements */
boolean empty(const stack *stk)
{
	return ((boolean) (stk -> cnt == EMPTY));
}

/* true if the stack has reached FULL */
boolean full(const stack *stk)
{
	return ((boolean) (stk -> cnt == FULL));
}

/* A linked list implementation of a stack. */

#ifndef STACK_H
#define STACK_H

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define EMPTY 0      /* count value when the stack is empty */
#define FULL 10000   /* maximum number of elements allowed  */

typedef char data;   /* the type stored in the stack */
typedef bool boolean;

/* one node in the linked list */
struct elem {
	data d;
	struct elem *next;
};

typedef struct elem elem;

/* the stack: a count plus a pointer to the top node */
struct stack {
	int cnt;
	elem *top;
};

typedef struct stack stack;

void initialize(stack *stk);          /* set the stack to empty            */
void push(data d, stack *stk);        /* add an element on top             */
data pop(stack *stk);                 /* remove and return the top element */
data top(stack *stk);                 /* peek at the top element           */
boolean empty(const stack *stk);      /* true if the stack has no elements */
boolean full(const stack *stk);       /* true if the stack is at capacity  */

#endif

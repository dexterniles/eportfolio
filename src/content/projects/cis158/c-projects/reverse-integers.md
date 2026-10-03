---
title: Reverse Integers with a Stack
course: cis158
section: c-projects
summary: "Reads a list of integers and prints them in reverse using a linked-list stack."
software: C · gcc · make
cover: ./images/reverse-integers.png
coverAlt: "Terminal window showing five integers entered and printed back in reverse order"
code:
  dir: /code/cis158/reverse-integers
  files: [main.c, stack.h, stack.c, Makefile]
order: 13
---

From the data structures unit. A stack is last-in, first-out, so pushing a list of numbers and popping them all back off reverses them.

## Sample run
Reversing five integers:

```text
$ make
$ ./main
How many integers? 5
Enter 5 integers: 10 20 30 40 50
Reversed: 50 40 30 20 10
```

## How it works
- **Linked-list stack.** Each element is a node (`struct elem`) holding a value and a pointer to the node below it. The stack tracks the top node and a count.
- **Push** allocates a node with `malloc` and links it in on top; **pop** unlinks the top node, saves its value, and `free`s it.
- **Reversal.** `main` pushes every number as it reads it, then pops until `empty` returns true, which prints them in reverse.
- **Reusable type.** `typedef int data;` sets the type the stack holds; the [string version](/cis158/c-projects/reverse-string) uses the same stack code with `char` instead.

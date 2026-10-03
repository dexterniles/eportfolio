---
title: Reverse a String with a Stack
course: cis158
section: c-projects
summary: "Reverses any line of text character by character with a linked-list stack, looping until you say stop."
software: C · gcc · make
cover: ./images/reverse-string.png
coverAlt: "Terminal window showing \"hello world\" and \"CIS158 rocks\" printed in reverse"
code:
  dir: /code/cis158/reverse-string
  files: [main.c, stack.h, stack.c, Makefile]
order: 13.3
---

The same linked-list stack as the [integer version](/cis158/c-projects/reverse-integers), holding characters this time.

## Sample run
Reversing two strings:

```text
$ make
$ ./main
Enter a string to see it in reverse: hello world
Reversed: dlrow olleh
Enter another? (y/n): y
Enter a string to see it in reverse: CIS158 rocks
Reversed: skcor 851SIC
Enter another? (y/n): n
```

## How it works
- **Same stack, new type.** The only change to the stack is `typedef char data;`, so `push`, `pop`, and the rest work on characters without being rewritten.
- **Reading a whole line.** `fgets` reads input with spaces included, and `strcspn` finds and removes the trailing newline.
- **Reversal.** Each character is pushed, then popped back off with `putchar` until the stack is empty.
- **Repeat loop.** A `do`/`while` loop starts each round with a fresh stack and keeps going while the answer starts with `y`.

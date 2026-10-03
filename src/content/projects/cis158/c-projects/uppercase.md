---
title: Command Line Arguments and User Input
course: cis158
section: c-projects
date: 2026-04-26
summary: A small C utility that uppercases text from a prompt, a command-line argument, or a file, with optional output to a new file.
software: C · gcc · make
cover: ./images/uppercase.png
coverAlt: Terminal window showing the uppercase program converting a word and a file of words to uppercase, plus an error for a missing file
code:
  dir: /code/cis158/uppercase
  files: [main.c, uppercase.h, uppercase.c, Makefile, words.txt, out.txt]
order: 14
---

Project 14 for CIS158, from the unit on file processing and command-line arguments. The program reads words and prints them in uppercase, and `main` picks a mode based on the arguments it's given.

## Modes
| Command | What it does |
| --- | --- |
| `./uppercase` | Prompts for a word on stdin |
| `./uppercase -w <word>` | Uppercases the word passed as an argument |
| `./uppercase -f <input>` | Uppercases each line of a file to stdout |
| `./uppercase -f <input> <output>` | Same, but writes to a new file (extra credit) |

Wrong or missing arguments print a message to `stderr` and exit with status `1`.

## Sample run
A real session covering every mode and the error handling:

```text
$ make
$ ./uppercase
Enter a word: hello world
HELLO WORLD
$ ./uppercase -w gcc
GCC
$ cat words.txt
cat
dog
fish
$ ./uppercase -f words.txt
CAT
DOG
FISH
$ ./uppercase -f words.txt out.txt
$ cat out.txt
CAT
DOG
FISH
$ ./uppercase -f missing.txt
Error: Unable to open file 'missing.txt'
$ echo $?
1
$ ./uppercase -w
Error: -w requires a word
$ ./uppercase -x
Error: Unknown flag '-x'
```

## How it works
- **Argument dispatch.** `main` checks `argc` and compares `argv[1]` with `strcmp`: `-w` needs exactly one more argument, and `-f` takes one or two.
- **Output to any stream.** The processing functions take a `FILE *out`, so the same code writes to `stdout` or to an output file opened with `fopen`.
- **Safe input.** Lines are read with `fgets` into a fixed buffer instead of `scanf("%s")`, so long input can't overrun it, and the trailing newline is stripped so the output isn't double-spaced.
- **Correct `toupper` use.** Each character is cast through `unsigned char` before `toupper`, because passing a negative `char` is undefined behavior.
- **Two modules.** `main.c` handles the arguments, `uppercase.c` does the work, and the Makefile builds them separately and links them.

---
title: Superhero Power Tracker
course: cis158
section: c-projects
summary: "A menu program that stores five superpowers as bit flags in a single unsigned int, using bitwise operators to add, remove, and check them."
software: C · gcc
cover: ./images/superhero-power-tracker.png
coverAlt: "Terminal window showing the superhero power tracker menu adding FLIGHT and HEALING powers"
code:
  dir: /code/cis158/superhero-power-tracker
  files: [sptb158.c]
order: 10.5
---

Also from the bitwise operations unit. Instead of five separate variables, every power lives in one `unsigned int`, with each power owning a single bit.

## Sample run
Adding FLIGHT and HEALING, checking for STRENGTH, then removing FLIGHT:

```text
$ gcc -std=c99 -Wall -o sptb158 sptb158.c
$ ./sptb158
Welcome to the Superhero Power Tracker!

1. Add a power
2. Remove a power
3. Check a power
4. Display all powers
5. Exit
Choose an option: 1
Select a power (1: FLIGHT, 2: STRENGTH, 3: INVISIBILITY, 4: TELEPATHY, 5: HEALING): 1
Added FLIGHT power!

[menu]
Choose an option: 1
Select a power (1: FLIGHT, 2: STRENGTH, 3: INVISIBILITY, 4: TELEPATHY, 5: HEALING): 5
Added HEALING power!

[menu]
Choose an option: 3
Select a power (1: FLIGHT, 2: STRENGTH, 3: INVISIBILITY, 4: TELEPATHY, 5: HEALING): 2
STRENGTH is NOT active.

[menu]
Choose an option: 4

Current powers:
  - FLIGHT
  - HEALING

[menu]
Choose an option: 2
Select a power (1: FLIGHT, 2: STRENGTH, 3: INVISIBILITY, 4: TELEPATHY, 5: HEALING): 1
Removed FLIGHT power!

[menu]
Choose an option: 4

Current powers:
  - HEALING

[menu]
Choose an option: 5

Goodbye! Thanks for using Superhero Power Tracker!
```

## How it works
- **Bit flags.** Each power is a `#define` built with a left shift: `FLIGHT` is `1 << 0`, `STRENGTH` is `1 << 1`, up to `HEALING` at `1 << 4`.
- **Add a power** with bitwise OR: `powers | power` sets that bit and leaves the others alone.
- **Remove a power** with AND and the complement: `powers & ~power` clears just that bit.
- **Check a power** with AND: `(powers & power) != 0` is true only if the bit is set.
- **Lookup helpers.** `get_power` and `get_power_name` map menu numbers to flags and names with `switch` statements, so the menu code stays short.

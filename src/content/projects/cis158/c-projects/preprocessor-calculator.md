---
title: Preprocessor Calculator
course: cis158
section: c-projects
date: 2026-04-05
summary: "A menu-driven calculator whose scientific features are switched on or off at compile time with #define and #ifdef."
software: C · gcc
cover: ./images/preprocessor-calculator.png
coverAlt: "Terminal window showing the calculator in scientific mode adding numbers and catching a division by zero"
code:
  dir: /code/cis158/preprocessor-calculator
  files: [calculator.c]
order: 11
---

From the unit on the preprocessor. It's a basic four-function calculator, plus power and square root, but the interesting part is that the scientific features only exist if `SCIENTIFIC_MODE` is defined when the program is compiled.

## Sample run
Adding, dividing by zero, raising 2 to the 10th, and taking square roots of 144 and -9:

```text
$ gcc -std=c99 -Wall -o calculator calculator.c -lm
$ ./calculator
Calculator running in SCIENTIFIC_MODE

--- Calculator Menu ---
1. Add
2. Subtract
3. Multiply
4. Divide
5. Power
6. Square Root
0. Exit
Choice: 1
Enter two numbers: 12 30
Result: 42

[menu]
Choice: 4
Enter two numbers: 10 0
Error: division by zero.
Result: 0

[menu]
Choice: 5
Enter base and exponent: 2 10
Result: 1024

[menu]
Choice: 6
Enter a number: 144
Result: 12

[menu]
Choice: 6
Enter a number: -9
Error: square root of negative number.
Result: 0

[menu]
Choice: 0
```

## How it works
- **Compile-time feature flag.** `#define SCIENTIFIC_MODE` at the top turns on the `power` and `squareRoot` functions, their menu entries, and their `case` labels, all wrapped in `#ifdef SCIENTIFIC_MODE` blocks. Remove that line and the preprocessor strips them out before the compiler ever sees them, leaving a basic calculator.
- **Mode banner.** An `#ifdef`/`#else` prints which mode the program was built in.
- **Input guards.** Division checks for a zero divisor and square root rejects negative numbers, printing an error instead of returning `inf` or `NaN`.
- **Clean output.** Results print with `%g`, which drops trailing zeros (`42` instead of `42.000000`), and the loop ends on `0` or when `scanf` can't read a number.
- **Linking the math library.** `pow` and `sqrt` come from `math.h`, so the build needs `-lm`.

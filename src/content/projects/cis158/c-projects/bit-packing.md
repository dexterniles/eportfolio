---
title: Bit Printing & Character Packing
course: cis158
section: c-projects
date: 2026-03-29
summary: "Prints an integer's 32 bits and packs four characters into a single int, then unpacks them again."
software: C · gcc · make
cover: ./images/bit-packing.png
coverAlt: "Terminal window showing the number 5 printed as 32 bits, and the characters a, b, c, d packed into one integer and unpacked"
code:
  dir: /code/cis158/bit-packing
  files: [main.c, bit_print.h, bit_print.c, pack_bits.h, pack_bits.c, Makefile]
order: 10
---

From the unit on enums and bitwise operations. A small menu program with two features: print the bit pattern of any integer, or pack four characters into one `int` and pull them back out.

## Sample run
Printing the bits of 5, then packing and unpacking `a b c d`:

```text
$ make
$ ./bp158
Choose an option:
  b - bit print
  p - pack function
Enter choice: b
Enter a number: 5
Bit representation: 00000000 00000000 00000000 00000101
Try another feature? (y/n): y
[menu]
Enter choice: p
Enter 4 characters: a b c d
Packed value: 01100001 01100010 01100011 01100100
Unpacked: abcd
Try another feature? (y/n): n
Goodbye!
```

## How it works
- **Printing bits.** `bit_print` builds a mask with only the highest bit set (`1 << (n-1)`, where `n` is `sizeof(int) * CHAR_BIT`), tests each bit with `&`, and shifts the number left one place at a time. A space after every 8 bits makes the bytes easy to read.
- **Packing.** `pack` starts with the first character and, for each of the next three, shifts everything left by one byte (`<< CHAR_BIT`) and ORs the new character into the low byte. In the run above, the packed value's four bytes, from high to low, are `0x61 0x62 0x63 0x64`: the ASCII codes for `a` through `d`.
- **Unpacking.** `unpack` slides a one-byte mask (`255`) into position `k`, ANDs it with the packed value, and shifts the result back down to recover the character.
- **Three modules.** The Makefile builds `main.c`, `bit_print.c`, and `pack_bits.c` separately and links them into `bp158`.

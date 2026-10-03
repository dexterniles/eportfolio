---
title: AV Gear Rental Tracker
course: cis158
section: final-project
summary: A command-line inventory manager in C that tracks AV equipment, who has it checked out, and what's in maintenance, saved to a text file between runs.
software: C · gcc · make
cover: ./images/rental-tracker.png
coverAlt: Terminal window showing the rental tracker's inventory table with seven pieces of AV gear and their status
code:
  dir: /code/cis158/rental-tracker
  files: [main.c, inventory.h, inventory.c, fileio.h, fileio.c, Makefile, inventory.txt, README.txt]
order: 1
---

My final project for CIS158: a menu-driven command-line program that tracks an inventory of audio/video equipment, who has each piece checked out, and which items are down for maintenance. The inventory is saved to a plain text file, so it persists between runs.

## What it does
- Loads the inventory from `inventory.txt` at startup, or starts empty if the file doesn't exist yet
- Presents a numbered menu to:
  1. View all gear in a formatted table
  2. Check out an item by ID
  3. Return an item by ID
  4. Add a new item
  5. Search by name substring or ID
  6. Mark an item as in maintenance, or send it back into service
  7. Save and quit
- Writes the inventory back to `inventory.txt` on "Save and quit"

## Sample run
A real session: viewing the gear, checking out a microphone, trying to put a checked-out item into maintenance (refused), adding a new mic, and saving.

```text
$ make
$ ./rental_tracker
Loaded 6 item(s) from inventory.txt.

=== AV Gear Rental Tracker ===
1. View all gear
2. Check out an item
3. Return an item
4. Add new item
5. Search by name or ID
6. Mark / unmark maintenance
7. Save and quit
Choose an option (1-7): 1

ID   Name                      Category        Status       Renter
---- ------------------------- --------------- ------------ --------------------
1    Barco S3                  Processor       Available    none
2    Brompton SX40             Processor       Checked Out  Dexter
3    AJA Ki Pro Go             Recorder        Maintenance  none
4    Shure SM58                Microphone      Available    none
5    Sennheiser EW100          Wireless Mic    Checked Out  Alex
6    Panasonic UCX1000         Broadcast Camera Available    none


[menu]
Choose an option (1-7): 2
Enter item ID to check out: 4
Renter name: Maya
Checked out item 4 to Maya.

[menu]
Choose an option (1-7): 6
Enter item ID to toggle maintenance: 2
Could not change item 2 — not found, or currently checked out.

[menu]
Choose an option (1-7): 4
Item name: Rode NTG3
Category: Shotgun Mic
Added 'Rode NTG3' as ID 7.

[menu]
Choose an option (1-7): 1

ID   Name                      Category        Status       Renter
---- ------------------------- --------------- ------------ --------------------
1    Barco S3                  Processor       Available    none
2    Brompton SX40             Processor       Checked Out  Dexter
3    AJA Ki Pro Go             Recorder        Maintenance  none
4    Shure SM58                Microphone      Checked Out  Maya
5    Sennheiser EW100          Wireless Mic    Checked Out  Alex
6    Panasonic UCX1000         Broadcast Camera Available    none
7    Rode NTG3                 Shotgun Mic     Available    none


[menu]
Choose an option (1-7): 7
Saved 7 item(s) to inventory.txt. Goodbye!
```

## Building it
```bash
make              # gcc -std=c99 -Wall -Wextra -pedantic
./rental_tracker
make clean
```

The program is split across three modules: `main.c` for the menu loop and input, `inventory.c` for the gear operations, and `fileio.c` for loading and saving. The Makefile builds each one as a separate object file.

## Design decisions
- **No dynamic memory.** The inventory lives in a fixed-size array (`GearItem inventory[MAX_ITEMS]`) declared in `main()`. 100 items is plenty for this project and avoids `malloc`/`free` entirely.
- **Safe input.** All input goes through `fgets` followed by `strtol`. Bare `scanf` and `gets` are never used, which avoids the classic buffer-overflow and leftover-newline problems.
- **Auto-assigned IDs.** A new item gets an ID one greater than the current maximum, so IDs stay unique across multiple runs.
- **Pipe-delimited file format** (`id|name|category|status|renter`) instead of CSV, which would need quoting rules for commas in names. Names and categories containing `|` are rejected so user input can never corrupt the file.
- **`strtok` over `sscanf`.** Loading splits each line on `|` because gear names like "Barco S3" contain spaces, which `%s` would split on.
- **Graceful failures.** A missing `inventory.txt` on first run prints a friendly message and starts empty; a corrupted file produces a warning instead of a crash.
- **Status rules.** An item that's already checked out or in maintenance can't be checked out, and a checked-out item has to be returned before it can be marked for maintenance.

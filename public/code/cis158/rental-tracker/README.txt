AV Gear Rental Tracker
======================

A small command-line program written in C that tracks an inventory of
audio/video equipment, who has each piece checked out, and how long it
has been out. The inventory is saved to a plain text file so it persists
between runs.

This is a final project for CIS 158 (Intro to Procedural Programming).


What it does
------------
- Loads an inventory from inventory.txt at startup (or starts empty if
  the file does not exist yet).
- Presents a numbered menu and lets the user:
    1. View all gear (formatted table)
    2. Check out an item by ID
    3. Return an item by ID
    4. Add a new item
    5. Search by name substring or ID
    6. Mark an item as in maintenance, or send it back into service
    7. Save and quit
- Writes the inventory back to inventory.txt when you choose "Save and
  quit".


How to build
------------
You need gcc and make. From this directory:

    make

This produces an executable named `rental_tracker` using:

    gcc -std=c99 -Wall -Wextra -pedantic

To clean build artifacts:

    make clean


How to run
----------
    ./rental_tracker

The program reads/writes inventory.txt in the current working directory.
A small sample inventory.txt is included so you can try the menu options
right away. If you delete it, the program will start with an empty
inventory and create a new one when you save.


File layout
-----------
    main.c         - menu loop and input dispatch
    inventory.c    - add / find / check out / return / list / search
    inventory.h    - GearItem struct, ItemStatus enum, function decls
    fileio.c       - load and save the pipe-delimited data file
    fileio.h       - load/save function declarations
    Makefile       - build rules
    README.txt     - this file
    inventory.txt  - sample data (created/overwritten by the program)


Data file format
----------------
The data file is plain text, one item per line, fields separated by '|':

    id|name|category|status|renter

Status is an integer matching the ItemStatus enum:
    0 = Available
    1 = Checked Out
    2 = Maintenance

Example:

    1|Barco S3|Processor|0|none
    2|Brompton SX40|Processor|1|Dexter
    3|AJA Ki Pro Go|Recorder|2|none


Design notes
------------
- No dynamic memory. The inventory lives in a fixed-size array
  (GearItem inventory[MAX_ITEMS]) declared in main(). MAX_ITEMS is 100,
  which is plenty for an intro project and avoids malloc/free entirely.

- All input goes through fgets followed by strtol or sscanf-style
  parsing. Bare scanf and gets are never used, which avoids the classic
  buffer-overflow and leftover-newline problems.

- IDs are auto-assigned. When you add a new item, it gets an ID one
  greater than the current maximum. This keeps IDs unique even after
  items are added across multiple runs.

- Pipe-delimited rather than CSV, because CSV would require quoting
  rules for commas in names. Names and categories are rejected if they
  contain a '|' character so the file format can never get corrupted by
  user input.

- Loading uses strtok with "|" rather than sscanf("%s") because gear
  names like "Barco S3" contain spaces, which %s would split on.

- A missing inventory.txt on first run is handled gracefully: the
  program prints a friendly message and starts with an empty inventory.
  A corrupted file produces a warning and also starts empty rather than
  crashing.

- The check-out flow refuses to check out an item that is already
  checked out or in maintenance. The maintenance toggle (option 6)
  refuses to flip an item that is currently checked out — return it
  first, then mark it for maintenance.

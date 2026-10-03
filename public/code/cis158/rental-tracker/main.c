/*
 * main.c
 * AV Gear Rental Tracker — menu loop and user input dispatch.
 *
 * Build:  make
 * Run:    ./rental_tracker
 *
 * Inventory persists to inventory.txt in the current directory.
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "inventory.h"
#include "fileio.h"

/* Path to the data file used for persistence. */
#define DATA_FILE "inventory.txt"
/* Buffer size for fgets-based input lines. */
#define INPUT_BUFFER 128

/*
 * Read a line of input from stdin into buf using fgets.
 * Strips a trailing newline if present.
 * Returns 1 on success, 0 on EOF / read error.
 */
static int read_line(char *buf, int size) {
    if (fgets(buf, size, stdin) == NULL) {
        return 0;
    }
    size_t len = strlen(buf);
    if (len > 0 && buf[len - 1] == '\n') {
        buf[len - 1] = '\0';
    }
    return 1;
}

/*
 * Prompt the user and read an integer using fgets + strtol.
 * Returns 1 on success, 0 on EOF or if the input was not a valid integer.
 */
static int read_int(const char *prompt, int *out) {
    char buf[INPUT_BUFFER];
    char *endptr;

    printf("%s", prompt);
    if (!read_line(buf, sizeof(buf))) {
        return 0;
    }
    if (buf[0] == '\0') {
        return 0;
    }

    long value = strtol(buf, &endptr, 10);
    /* endptr should land on the null terminator if the whole string was numeric. */
    if (*endptr != '\0') {
        return 0;
    }

    *out = (int) value;
    return 1;
}

/* Print the main menu options. */
static void print_menu(void) {
    printf("\n=== AV Gear Rental Tracker ===\n");
    printf("1. View all gear\n");
    printf("2. Check out an item\n");
    printf("3. Return an item\n");
    printf("4. Add new item\n");
    printf("5. Search by name or ID\n");
    printf("6. Mark / unmark maintenance\n");
    printf("7. Save and quit\n");
}

/* Handle the "check out" menu option. */
static void do_check_out(GearItem inventory[], int item_count) {
    int id;
    char renter[MAX_RENTER];

    if (!read_int("Enter item ID to check out: ", &id)) {
        printf("Invalid ID.\n");
        return;
    }

    printf("Renter name: ");
    if (!read_line(renter, sizeof(renter)) || renter[0] == '\0') {
        printf("Renter name is required.\n");
        return;
    }

    if (inventory_check_out(inventory, item_count, id, renter)) {
        printf("Checked out item %d to %s.\n", id, renter);
    } else {
        printf("Could not check out item %d — not found or unavailable.\n", id);
    }
}

/* Handle the "return" menu option. */
static void do_return(GearItem inventory[], int item_count) {
    int id;
    if (!read_int("Enter item ID to return: ", &id)) {
        printf("Invalid ID.\n");
        return;
    }

    if (inventory_return(inventory, item_count, id)) {
        printf("Returned item %d.\n", id);
    } else {
        printf("Could not return item %d — not found or not currently checked out.\n", id);
    }
}

/* Handle the "mark / unmark maintenance" menu option. */
static void do_toggle_maintenance(GearItem inventory[], int item_count) {
    int id;
    if (!read_int("Enter item ID to toggle maintenance: ", &id)) {
        printf("Invalid ID.\n");
        return;
    }

    int result = inventory_toggle_maintenance(inventory, item_count, id);
    if (result == 1) {
        printf("Item %d is now in maintenance.\n", id);
    } else if (result == 2) {
        printf("Item %d is back in service.\n", id);
    } else {
        printf("Could not change item %d — not found, or currently checked out.\n", id);
    }
}

/* Handle the "add new item" menu option. */
static void do_add(GearItem inventory[], int *item_count) {
    char name[MAX_NAME];
    char category[MAX_NAME];

    if (*item_count >= MAX_ITEMS) {
        printf("Inventory is full (%d items max).\n", MAX_ITEMS);
        return;
    }

    printf("Item name: ");
    if (!read_line(name, sizeof(name)) || name[0] == '\0') {
        printf("Name is required.\n");
        return;
    }

    printf("Category: ");
    if (!read_line(category, sizeof(category)) || category[0] == '\0') {
        printf("Category is required.\n");
        return;
    }

    /* Reject characters that would corrupt the pipe-delimited file format. */
    if (strchr(name, '|') != NULL || strchr(category, '|') != NULL) {
        printf("Name and category cannot contain the '|' character.\n");
        return;
    }

    if (inventory_add(inventory, item_count, name, category)) {
        printf("Added '%s' as ID %d.\n", name, inventory[*item_count - 1].id);
    } else {
        printf("Could not add item.\n");
    }
}

/* Handle the "search" menu option. Accepts either an ID or a name substring. */
static void do_search(const GearItem inventory[], int item_count) {
    char query[MAX_NAME];

    printf("Enter ID number or part of a name: ");
    if (!read_line(query, sizeof(query)) || query[0] == '\0') {
        printf("Search query required.\n");
        return;
    }

    /* Try to interpret the query as an integer ID. If it parses cleanly,
       search by ID; otherwise treat it as a name substring. */
    char *endptr;
    long maybe_id = strtol(query, &endptr, 10);
    int id = -1;
    if (*endptr == '\0') {
        id = (int) maybe_id;
        inventory_search(inventory, item_count, "", id);
    } else {
        inventory_search(inventory, item_count, query, -1);
    }
}

int main(void) {
    GearItem inventory[MAX_ITEMS];
    int item_count = 0;

    /* Try to load existing data. A missing file is OK — start empty. */
    int load_result = fileio_load(DATA_FILE, inventory, &item_count);
    if (load_result == 1) {
        printf("Loaded %d item(s) from %s.\n", item_count, DATA_FILE);
    } else if (load_result == 0) {
        printf("No existing data file found — starting with an empty inventory.\n");
    } else {
        printf("Warning: %s exists but could not be parsed. Starting empty.\n", DATA_FILE);
        item_count = 0;
    }

    int running = 1;
    while (running) {
        print_menu();

        int choice;
        if (!read_int("Choose an option (1-7): ", &choice)) {
            printf("Please enter a number from 1 to 7.\n");
            continue;
        }

        switch (choice) {
            case 1:
                inventory_list_all(inventory, item_count);
                break;
            case 2:
                do_check_out(inventory, item_count);
                break;
            case 3:
                do_return(inventory, item_count);
                break;
            case 4:
                do_add(inventory, &item_count);
                break;
            case 5:
                do_search(inventory, item_count);
                break;
            case 6:
                do_toggle_maintenance(inventory, item_count);
                break;
            case 7:
                if (fileio_save(DATA_FILE, inventory, item_count)) {
                    printf("Saved %d item(s) to %s. Goodbye!\n", item_count, DATA_FILE);
                } else {
                    printf("ERROR: could not write to %s. Changes not saved.\n", DATA_FILE);
                }
                running = 0;
                break;
            default:
                printf("Please enter a number from 1 to 7.\n");
                break;
        }
    }

    return 0;
}

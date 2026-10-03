/*
 * inventory.c
 * Implementation of the inventory operations declared in inventory.h.
 */

#include <stdio.h>
#include <string.h>

#include "inventory.h"

/* Convert an ItemStatus enum value to a short label for display. */
const char *status_to_string(ItemStatus status) {
    switch (status) {
        case STATUS_AVAILABLE:   return "Available";
        case STATUS_CHECKED_OUT: return "Checked Out";
        case STATUS_MAINTENANCE: return "Maintenance";
    }
    /* Fallback in case a bad value somehow ends up in the file. */
    return "Unknown";
}

/* Linear search for an item by id. Returns the array index or -1. */
int inventory_find_index(const GearItem inventory[], int item_count, int id) {
    for (int i = 0; i < item_count; i++) {
        if (inventory[i].id == id) {
            return i;
        }
    }
    return -1;
}

/* Print the entire inventory as a formatted table. */
void inventory_list_all(const GearItem inventory[], int item_count) {
    if (item_count == 0) {
        printf("Inventory is empty.\n");
        return;
    }

    printf("\n%-4s %-25s %-15s %-12s %-20s\n",
           "ID", "Name", "Category", "Status", "Renter");
    printf("---- ------------------------- --------------- ------------ --------------------\n");

    for (int i = 0; i < item_count; i++) {
        printf("%-4d %-25s %-15s %-12s %-20s\n",
               inventory[i].id,
               inventory[i].name,
               inventory[i].category,
               status_to_string(inventory[i].status),
               inventory[i].renter);
    }
    printf("\n");
}

/*
 * Add a new item. The id is auto-assigned to (max existing id) + 1
 * so ids stay unique even after items are added across multiple runs.
 */
int inventory_add(GearItem inventory[], int *item_count,
                  const char name[], const char category[]) {
    if (*item_count >= MAX_ITEMS) {
        return 0;
    }

    /* Find the largest existing id so we can pick the next one. */
    int max_id = 0;
    for (int i = 0; i < *item_count; i++) {
        if (inventory[i].id > max_id) {
            max_id = inventory[i].id;
        }
    }

    GearItem *item = &inventory[*item_count];
    item->id = max_id + 1;

    /* Copy strings safely with explicit null termination. */
    strncpy(item->name, name, MAX_NAME - 1);
    item->name[MAX_NAME - 1] = '\0';
    strncpy(item->category, category, MAX_NAME - 1);
    item->category[MAX_NAME - 1] = '\0';

    item->status = STATUS_AVAILABLE;
    strcpy(item->renter, "none");

    (*item_count)++;
    return 1;
}

/* Mark an item as checked out by a renter, if it is currently available. */
int inventory_check_out(GearItem inventory[], int item_count,
                        int id, const char renter[]) {
    int idx = inventory_find_index(inventory, item_count, id);
    if (idx < 0) {
        return 0;
    }
    if (inventory[idx].status != STATUS_AVAILABLE) {
        return 0;
    }

    inventory[idx].status = STATUS_CHECKED_OUT;
    strncpy(inventory[idx].renter, renter, MAX_RENTER - 1);
    inventory[idx].renter[MAX_RENTER - 1] = '\0';
    return 1;
}

/* Mark an item as available, clearing the renter. */
int inventory_return(GearItem inventory[], int item_count, int id) {
    int idx = inventory_find_index(inventory, item_count, id);
    if (idx < 0) {
        return 0;
    }
    if (inventory[idx].status != STATUS_CHECKED_OUT) {
        return 0;
    }

    inventory[idx].status = STATUS_AVAILABLE;
    strcpy(inventory[idx].renter, "none");
    return 1;
}

/*
 * Flip an item between Available and Maintenance. A checked-out item
 * must be returned first — we won't silently lose the renter.
 */
int inventory_toggle_maintenance(GearItem inventory[], int item_count, int id) {
    int idx = inventory_find_index(inventory, item_count, id);
    if (idx < 0) {
        return 0;
    }

    if (inventory[idx].status == STATUS_AVAILABLE) {
        inventory[idx].status = STATUS_MAINTENANCE;
        return 1;
    }
    if (inventory[idx].status == STATUS_MAINTENANCE) {
        inventory[idx].status = STATUS_AVAILABLE;
        return 2;
    }
    /* Currently checked out — caller must return it first. */
    return 0;
}

/*
 * Search by id (if id >= 0) and/or by name substring.
 * An empty name_query means "match any name".
 */
void inventory_search(const GearItem inventory[], int item_count,
                      const char name_query[], int id) {
    int matches = 0;

    printf("\n%-4s %-25s %-15s %-12s %-20s\n",
           "ID", "Name", "Category", "Status", "Renter");
    printf("---- ------------------------- --------------- ------------ --------------------\n");

    for (int i = 0; i < item_count; i++) {
        int id_match = (id >= 0 && inventory[i].id == id);
        int name_match = (name_query[0] != '\0' &&
                          strstr(inventory[i].name, name_query) != NULL);

        if (id_match || name_match) {
            printf("%-4d %-25s %-15s %-12s %-20s\n",
                   inventory[i].id,
                   inventory[i].name,
                   inventory[i].category,
                   status_to_string(inventory[i].status),
                   inventory[i].renter);
            matches++;
        }
    }

    if (matches == 0) {
        printf("No items matched your search.\n");
    }
    printf("\n");
}

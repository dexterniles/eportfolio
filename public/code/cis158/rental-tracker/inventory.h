/*
 * inventory.h
 * Data types and operations for the AV gear inventory.
 */

#ifndef INVENTORY_H
#define INVENTORY_H

/* Maximum length of a gear name or category string (including null terminator). */
#define MAX_NAME 50
/* Maximum length of a renter name string (including null terminator). */
#define MAX_RENTER 50
/* Maximum number of items the inventory can hold. */
#define MAX_ITEMS 100

/* The three possible states a piece of gear can be in. */
typedef enum {
    STATUS_AVAILABLE = 0,
    STATUS_CHECKED_OUT = 1,
    STATUS_MAINTENANCE = 2
} ItemStatus;

/* A single piece of AV gear tracked by the program. */
typedef struct {
    int id;                     /* unique numeric id */
    char name[MAX_NAME];        /* e.g. "Barco S3" */
    char category[MAX_NAME];    /* e.g. "Processor" */
    ItemStatus status;          /* available / checked out / maintenance */
    char renter[MAX_RENTER];    /* "none" when available */
} GearItem;

/*
 * Find the index of the item with the given id.
 * Returns the index in the inventory array, or -1 if not found.
 */
int inventory_find_index(const GearItem inventory[], int item_count, int id);

/*
 * Print every item in the inventory to stdout in a formatted table.
 */
void inventory_list_all(const GearItem inventory[], int item_count);

/*
 * Add a new item to the inventory.
 * The new item's id is assigned automatically (one greater than the current max).
 * Returns 1 on success, 0 if the inventory is full.
 */
int inventory_add(GearItem inventory[], int *item_count,
                  const char name[], const char category[]);

/*
 * Check out the item with the given id to the named renter.
 * Returns 1 on success, 0 if the item does not exist or is not available.
 */
int inventory_check_out(GearItem inventory[], int item_count,
                        int id, const char renter[]);

/*
 * Return the item with the given id (mark it available again).
 * Returns 1 on success, 0 if the item does not exist or was not checked out.
 */
int inventory_return(GearItem inventory[], int item_count, int id);

/*
 * Toggle an item between Available and Maintenance.
 * Returns:
 *   1 if the item is now in maintenance,
 *   2 if the item is now back to available,
 *   0 if not found or currently checked out.
 */
int inventory_toggle_maintenance(GearItem inventory[], int item_count, int id);

/*
 * Search the inventory for items whose name contains the given substring
 * (case-sensitive) OR whose id matches the given id.
 * Pass id < 0 to search by name only.
 * Prints all matches to stdout.
 */
void inventory_search(const GearItem inventory[], int item_count,
                      const char name_query[], int id);

/*
 * Convert an ItemStatus to a short human-readable string.
 */
const char *status_to_string(ItemStatus status);

#endif /* INVENTORY_H */

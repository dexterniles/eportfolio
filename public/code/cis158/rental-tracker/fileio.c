/*
 * fileio.c
 * Read and write the inventory in a simple pipe-delimited text format:
 *   id|name|category|status|renter
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "fileio.h"

/* Maximum length of a single line we'll read from the data file. */
#define LINE_BUFFER 256

/*
 * Parse one line from the data file into a GearItem.
 * Returns 1 on success, 0 on a malformed line.
 *
 * We use strtok with the "|" delimiter rather than sscanf because the
 * name and category fields may contain spaces, which sscanf's %s would
 * stop at.
 */
static int parse_line(char *line, GearItem *item) {
    char *token;
    char *endptr;

    /* id */
    token = strtok(line, "|");
    if (token == NULL) return 0;
    item->id = (int) strtol(token, &endptr, 10);
    if (*endptr != '\0') return 0;

    /* name */
    token = strtok(NULL, "|");
    if (token == NULL) return 0;
    strncpy(item->name, token, MAX_NAME - 1);
    item->name[MAX_NAME - 1] = '\0';

    /* category */
    token = strtok(NULL, "|");
    if (token == NULL) return 0;
    strncpy(item->category, token, MAX_NAME - 1);
    item->category[MAX_NAME - 1] = '\0';

    /* status */
    token = strtok(NULL, "|");
    if (token == NULL) return 0;
    long status_val = strtol(token, &endptr, 10);
    if (*endptr != '\0') return 0;
    if (status_val < 0 || status_val > 2) return 0;
    item->status = (ItemStatus) status_val;

    /* renter (last field — may have a trailing newline) */
    token = strtok(NULL, "|\n");
    if (token == NULL) return 0;
    strncpy(item->renter, token, MAX_RENTER - 1);
    item->renter[MAX_RENTER - 1] = '\0';

    return 1;
}

int fileio_load(const char *path, GearItem inventory[], int *item_count) {
    *item_count = 0;

    FILE *fp = fopen(path, "r");
    if (fp == NULL) {
        /* Missing file is fine — first run starts with an empty inventory. */
        return 0;
    }

    char line[LINE_BUFFER];
    while (fgets(line, sizeof(line), fp) != NULL) {
        /* Skip blank lines so trailing newlines in the file don't break us. */
        if (line[0] == '\n' || line[0] == '\0') {
            continue;
        }
        if (*item_count >= MAX_ITEMS) {
            /* Inventory is full — stop reading rather than overflow. */
            break;
        }
        if (!parse_line(line, &inventory[*item_count])) {
            fclose(fp);
            return -1;
        }
        (*item_count)++;
    }

    fclose(fp);
    return 1;
}

int fileio_save(const char *path, const GearItem inventory[], int item_count) {
    FILE *fp = fopen(path, "w");
    if (fp == NULL) {
        return 0;
    }

    for (int i = 0; i < item_count; i++) {
        fprintf(fp, "%d|%s|%s|%d|%s\n",
                inventory[i].id,
                inventory[i].name,
                inventory[i].category,
                (int) inventory[i].status,
                inventory[i].renter);
    }

    fclose(fp);
    return 1;
}

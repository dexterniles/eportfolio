/*
 * fileio.h
 * Loading and saving the inventory to a pipe-delimited text file.
 */

#ifndef FILEIO_H
#define FILEIO_H

#include "inventory.h"

/*
 * Load the inventory from the given file path.
 * Fills the inventory array and sets *item_count.
 * Returns:
 *   1 on success,
 *   0 if the file does not exist (this is fine on first run; item_count is set to 0),
 *  -1 if the file exists but a line could not be parsed.
 */
int fileio_load(const char *path, GearItem inventory[], int *item_count);

/*
 * Save the inventory to the given file path, overwriting any existing file.
 * Returns 1 on success, 0 if the file could not be opened for writing.
 */
int fileio_save(const char *path, const GearItem inventory[], int item_count);

#endif /* FILEIO_H */

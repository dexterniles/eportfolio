/* p14 uppercase: read words and print them in uppercase.

   Modes:
     (no args)              prompt the user for a word on stdin
     -w <word>              uppercase <word> directly
     -f <input>             uppercase each line of <input> to stdout
     -f <input> <output>    same, but write to <output> file (extra credit)
*/

#include <stdio.h>
#include <string.h>

#include "uppercase.h"

int main(int argc, char *argv[])
{
    /* Dispatch on argv[1]. -w expects exactly one trailing arg (the word).
       -f expects either one trailing arg (input path) or two (input, output). */
    if (argc == 1) {
        prompt_and_process(stdout);
        return 0;
    }

    if (strcmp(argv[1], "-w") == 0) {
        if (argc != 3) {
            fprintf(stderr, "Error: -w requires a word\n");
            return 1;
        }
        process_word(argv[2], stdout);
        return 0;
    }

    if (strcmp(argv[1], "-f") == 0) {
        if (argc < 3 || argc > 4) {
            fprintf(stderr, "Error: -f requires a filename\n");
            return 1;
        }

        if (argc == 3) {
            return process_file(argv[2], stdout);
        }

        /* argc == 4: extra credit, second path is the output file. */
        FILE *out = fopen(argv[3], "w");
        if (out == NULL) {
            fprintf(stderr, "Error: Unable to open output file '%s'\n", argv[3]);
            return 1;
        }
        int rc = process_file(argv[2], out);
        fclose(out);
        return rc;
    }

    fprintf(stderr, "Error: Unknown flag '%s'\n", argv[1]);
    return 1;
}

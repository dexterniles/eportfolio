#include <stdio.h>
#include <string.h>
#include <ctype.h>

#include "uppercase.h"

#define LINE_BUF 1024

/* toupper takes an int whose value must be representable as unsigned char
   (or EOF). Passing a plain char that happens to be negative is undefined
   behavior, so cast through unsigned char first. */
void to_upper_in_place(char *s)
{
    for (; *s; s++) {
        *s = (char)toupper((unsigned char)*s);
    }
}

void process_word(const char *word, FILE *out)
{
    char buf[LINE_BUF];
    strncpy(buf, word, LINE_BUF - 1);
    buf[LINE_BUF - 1] = '\0';
    to_upper_in_place(buf);
    fprintf(out, "%s\n", buf);
}

/* fgets keeps the trailing '\n' when the line fits in the buffer. We strip
   it before printing so the output isn't double-spaced. */
int process_file(const char *in_path, FILE *out)
{
    FILE *in = fopen(in_path, "r");
    if (in == NULL) {
        fprintf(stderr, "Error: Unable to open file '%s'\n", in_path);
        return 1;
    }

    char line[LINE_BUF];
    while (fgets(line, LINE_BUF, in) != NULL) {
        size_t n = strlen(line);
        if (n > 0 && line[n - 1] == '\n') {
            line[n - 1] = '\0';
        }
        to_upper_in_place(line);
        fprintf(out, "%s\n", line);
    }

    fclose(in);
    return 0;
}

/* Use fgets rather than scanf("%s", ...) so we can't overrun the buffer and
   so input containing only whitespace doesn't leave the prompt hanging. */
void prompt_and_process(FILE *out)
{
    char line[LINE_BUF];
    printf("Enter a word: ");
    fflush(stdout);

    if (fgets(line, LINE_BUF, stdin) == NULL) {
        return;
    }

    size_t n = strlen(line);
    if (n > 0 && line[n - 1] == '\n') {
        line[n - 1] = '\0';
    }
    to_upper_in_place(line);
    fprintf(out, "%s\n", line);
}

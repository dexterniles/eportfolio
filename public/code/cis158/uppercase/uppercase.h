#ifndef UPPERCASE_H
#define UPPERCASE_H

#include <stdio.h>

/* Uppercase every character of s in place. */
void to_upper_in_place(char *s);

/* Uppercase word and write it (followed by '\n') to out. */
void process_word(const char *word, FILE *out);

/* Read in_path line-by-line, uppercase each line, write to out.
   Returns 0 on success, 1 if the input file cannot be opened. */
int process_file(const char *in_path, FILE *out);

/* Prompt on stdout, read one line from stdin, uppercase it, write to out. */
void prompt_and_process(FILE *out);

#endif

/* Standard I/O library for printf/scanf. */
#include <stdio.h>
/* Math library for pow() and sqrt(). Requires linking with -lm. */
#include <math.h>

/* Compile-time feature flags. Defining SCIENTIFIC_MODE enables the
   advanced operations (power, square root) via #ifdef blocks below. */
#define BASIC_MODE
#define SCIENTIFIC_MODE

/* Basic arithmetic functions: each takes two doubles and returns a double. */
double add(double a, double b)      { return a + b; }
double subtract(double a, double b) { return a - b; }
double multiply(double a, double b) { return a * b; }

/* Division guards against a zero divisor, which would otherwise be
   undefined behavior for integers and produce inf/nan for doubles. */
double divide(double a, double b) {
    if (b == 0) {
        printf("Error: division by zero.\n");
        return 0;
    }
    return a / b;
}

#ifdef SCIENTIFIC_MODE
/* Returns base raised to exp using the standard library pow(). */
double power(double base, double exp) { return pow(base, exp); }

/* Square root is only defined for non-negative reals, so reject
   negatives before calling sqrt() to avoid a NaN result. */
double squareRoot(double a) {
    if (a < 0) {
        printf("Error: square root of negative number.\n");
        return 0;
    }
    return sqrt(a);
}
#endif

/* Prints the list of operations the user can choose from.
   The scientific options only appear when SCIENTIFIC_MODE is defined. */
void printMenu(void) {
    printf("\n--- Calculator Menu ---\n");
    printf("1. Add\n");
    printf("2. Subtract\n");
    printf("3. Multiply\n");
    printf("4. Divide\n");
#ifdef SCIENTIFIC_MODE
    printf("5. Power\n");
    printf("6. Square Root\n");
#endif
    printf("0. Exit\n");
    printf("Choice: ");
}

/* Program entry point. Runs an interactive REPL loop until the user
   enters 0 or input fails. */
int main(void) {
    /* Announce which build mode is active so the user knows which
       operations are available. */
#ifdef SCIENTIFIC_MODE
    printf("Calculator running in SCIENTIFIC_MODE\n");
#else
    printf("Calculator running in BASIC_MODE\n");
#endif

    /* choice holds the menu selection; a and b hold operands read from stdin. */
    int choice;
    double a, b;

    /* Main interaction loop: show menu, read choice, dispatch operation. */
    while (1) {
        printMenu();
        /* scanf returns the number of successfully matched items. If it
           isn't 1, the input was non-numeric or EOF was reached, so exit. */
        if (scanf("%d", &choice) != 1) break;
        /* 0 is the sentinel value for "quit". */
        if (choice == 0) break;

        /* Dispatch on the menu choice. Each case reads its operands,
           calls the matching function, and prints the result with %g
           (compact float format that drops trailing zeros). */
        switch (choice) {
            case 1:
                printf("Enter two numbers: ");
                scanf("%lf %lf", &a, &b);
                printf("Result: %g\n", add(a, b));
                break;
            case 2:
                printf("Enter two numbers: ");
                scanf("%lf %lf", &a, &b);
                printf("Result: %g\n", subtract(a, b));
                break;
            case 3:
                printf("Enter two numbers: ");
                scanf("%lf %lf", &a, &b);
                printf("Result: %g\n", multiply(a, b));
                break;
            case 4:
                printf("Enter two numbers: ");
                scanf("%lf %lf", &a, &b);
                printf("Result: %g\n", divide(a, b));
                break;
#ifdef SCIENTIFIC_MODE
            case 5:
                printf("Enter base and exponent: ");
                scanf("%lf %lf", &a, &b);
                printf("Result: %g\n", power(a, b));
                break;
            case 6:
                /* Square root is unary, so only one operand is read. */
                printf("Enter a number: ");
                scanf("%lf", &a);
                printf("Result: %g\n", squareRoot(a));
                break;
#endif
            default:
                /* Any number outside the menu range falls through here. */
                printf("Invalid choice.\n");
        }
    }

    /* Returning 0 from main signals successful program termination. */
    return 0;
}

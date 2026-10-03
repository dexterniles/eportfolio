#include <stdio.h>

/* Bit flags for each power using left shift */
#define FLIGHT       (1 << 0)  /* 00001 */
#define STRENGTH     (1 << 1)  /* 00010 */
#define INVISIBILITY (1 << 2)  /* 00100 */
#define TELEPATHY    (1 << 3)  /* 01000 */
#define HEALING      (1 << 4)  /* 10000 */

/* Set a power bit using bitwise OR */
void add_power(unsigned int *powers, unsigned int power) {
    *powers = *powers | power;
}

/* Clear a power bit using bitwise AND with complement */
void remove_power(unsigned int *powers, unsigned int power) {
    *powers = *powers & ~power;
}

/* Test if a power bit is set using bitwise AND */
int check_power(unsigned int powers, unsigned int power) {
    return (powers & power) != 0;
}

/* Iterate through each power flag and print active ones */
void display_powers(unsigned int powers) {
    printf("\nCurrent powers:\n");
    if (powers == 0) {
        printf("No Active Powers\n");
        return;
    }
    if (check_power(powers, FLIGHT))
        printf("  - FLIGHT\n");
    if (check_power(powers, STRENGTH))
        printf("  - STRENGTH\n");
    if (check_power(powers, INVISIBILITY))
        printf("  - INVISIBILITY\n");
    if (check_power(powers, TELEPATHY))
        printf("  - TELEPATHY\n");
    if (check_power(powers, HEALING))
        printf("  - HEALING\n");
}

/* Display main menu options */
void print_menu(void) {
    printf("\n1. Add a power\n");
    printf("2. Remove a power\n");
    printf("3. Check a power\n");
    printf("4. Display all powers\n");
    printf("5. Exit\n");
    printf("Choose an option: ");
}

/* Display power selection submenu */
void print_power_menu(void) {
    printf("Select a power (1: FLIGHT, 2: STRENGTH, 3: INVISIBILITY, ");
    printf("4: TELEPATHY, 5: HEALING): ");
}

/* Map menu choice to corresponding bit flag */
unsigned int get_power(int choice) {
    switch (choice) {
        case 1: return FLIGHT;
        case 2: return STRENGTH;
        case 3: return INVISIBILITY;
        case 4: return TELEPATHY;
        case 5: return HEALING;
        default: return 0;
    }
}

/* Map menu choice to power name string */
const char *get_power_name(int choice) {
    switch (choice) {
        case 1: return "FLIGHT";
        case 2: return "STRENGTH";
        case 3: return "INVISIBILITY";
        case 4: return "TELEPATHY";
        case 5: return "HEALING";
        default: return "UNKNOWN";
    }
}

int main(void) {
    unsigned int powers = 0; /* Bitmask storing all active powers */
    int option, power_choice;
    unsigned int power;

    printf("Welcome to the Superhero Power Tracker!\n");

    /* Main loop: display menu and process user input */
    do {
        print_menu();
        scanf("%d", &option);

        switch (option) {
            case 1:
                print_power_menu();
                scanf("%d", &power_choice);
                power = get_power(power_choice);
                if (power) {
                    add_power(&powers, power);
                    printf("Added %s power!\n", get_power_name(power_choice));
                } else {
                    printf("Invalid power selection.\n");
                }
                break;

            case 2:
                print_power_menu();
                scanf("%d", &power_choice);
                power = get_power(power_choice);
                if (power) {
                    remove_power(&powers, power);
                    printf("Removed %s power!\n", get_power_name(power_choice));
                } else {
                    printf("Invalid power selection.\n");
                }
                break;

            case 3:
                print_power_menu();
                scanf("%d", &power_choice);
                power = get_power(power_choice);
                if (power) {
                    if (check_power(powers, power))
                        printf("%s is ACTIVE!\n", get_power_name(power_choice));
                    else
                        printf("%s is NOT active.\n", get_power_name(power_choice));
                } else {
                    printf("Invalid power selection.\n");
                }
                break;

            case 4:
                display_powers(powers);
                break;

            case 5:
                printf("\nGoodbye! Thanks for using Superhero Power Tracker!\n");
                break;

            default:
                printf("Invalid option. Try again.\n");
                break;
        }
    } while (option != 5);

    return 0;
}

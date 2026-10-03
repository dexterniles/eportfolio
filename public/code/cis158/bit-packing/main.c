#include <stdio.h>
#include "bit_print.h"
#include "pack_bits.h"

int main(void)
{
    char choice;
    int again = 1;

    while (again) {
        printf("Choose an option:\n");
        printf("  b - bit print\n");
        printf("  p - pack function\n");
        printf("Enter choice: ");
        scanf(" %c", &choice);

        if (choice == 'b' || choice == 'B') {
            int num;
            printf("Enter a number: ");
            scanf("%d", &num);
            printf("Bit representation: ");
            bit_print(num);
            putchar('\n');
        }
        else if (choice == 'p' || choice == 'P') {
            char a, b, c, d;
            int packed;
            printf("Enter 4 characters: ");
            scanf(" %c %c %c %c", &a, &b, &c, &d);

            packed = pack(a, b, c, d);
            printf("Packed value: ");
            bit_print(packed);
            putchar('\n');

            printf("Unpacked: ");
            printf("%c", unpack(packed, 3));
            printf("%c", unpack(packed, 2));
            printf("%c", unpack(packed, 1));
            printf("%c", unpack(packed, 0));
            putchar('\n');
        }
        else {
            printf("Invalid choice.\n");
            continue;
        }

        printf("Try another feature? (y/n): ");
        scanf(" %c", &choice);
        if (choice != 'y' && choice != 'Y') {
            printf("Goodbye!\n");
	    again = 0;
        }
    }

    return 0;
}

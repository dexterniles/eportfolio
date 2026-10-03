/*
 * Combat System
 * CIS158 Assignment
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/* Character data used for both the player and the monster. */
struct Character
{
    int   hitpoints;    /* remaining health */
    float hitchance;    /* percent chance (0-100) to land an attack */
    int   maxhit;       /* maximum damage per successful attack */
    int   minhit;       /* minimum damage per successful attack */
};

/* Returns a random integer in the inclusive range [low, high]. */
int roll_range(int low, int high)
{
    return low + rand() % (high - low + 1);
}

/* Performs one attack and updates the defender's hitpoints. */
void take_turn(const char *attacker_name,
               const char *defender_name,
               struct Character *attacker,
               struct Character *defender)
{
    int roll = rand() % 100;

    printf("%s attacks %s... ", attacker_name, defender_name);

    if (roll < attacker->hitchance)
    {
        int damage = roll_range(attacker->minhit, attacker->maxhit);
        defender->hitpoints -= damage;
        printf("HIT for %d damage! (%s HP: %d)\n",
               damage, defender_name, defender->hitpoints);
    }
    else
    {
        printf("missed.\n");
    }
}

int main(void)
{
    srand((unsigned) time(NULL));

    struct Character player  = { 20, 30.0f, 10, 2 };
    struct Character monster = { 15, 25.0f,  8, 1 };

    int round = 1;

    printf("=== Combat Begins ===\n");
    printf("Player  HP: %d  Monster HP: %d\n\n",
           player.hitpoints, monster.hitpoints);

    while (player.hitpoints > 0 && monster.hitpoints > 0)
    {
        printf("--- Round %d ---\n", round);

        take_turn("Player", "Monster", &player, &monster);

        if (monster.hitpoints > 0)
        {
            take_turn("Monster", "Player", &monster, &player);
        }

        printf("\n");
        round++;
    }

    printf("=== Combat Over ===\n");
    if (player.hitpoints > 0)
    {
        printf("The player wins with %d HP remaining!\n", player.hitpoints);
    }
    else
    {
        printf("The monster wins with %d HP remaining!\n", monster.hitpoints);
    }

    return 0;
}

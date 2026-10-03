---
title: Turn-Based Combat Simulator
course: cis158
section: c-projects
date: 2026-04-12
summary: "A player-versus-monster battle where each character is a struct, and random rolls decide every hit, miss, and damage amount."
software: C · gcc
cover: ./images/combat-simulator.png
coverAlt: "Terminal window showing rounds of a turn-based fight between a player and a monster"
code:
  dir: /code/cis158/combat-simulator
  files: [combat.c]
order: 12
---

From the unit on structs. A player and a monster trade attacks round by round until one runs out of hitpoints.

## Sample run
One real battle. The random generator is seeded from the clock, so every run plays out differently:

```text
$ gcc -std=c99 -Wall -o combat combat.c
$ ./combat
=== Combat Begins ===
Player  HP: 20  Monster HP: 15

--- Round 1 ---
Player attacks Monster... missed.
Monster attacks Player... HIT for 1 damage! (Player HP: 19)

--- Round 2 ---
Player attacks Monster... missed.
Monster attacks Player... missed.

--- Round 3 ---
Player attacks Monster... missed.
Monster attacks Player... HIT for 4 damage! (Player HP: 15)

--- Round 4 ---
Player attacks Monster... HIT for 6 damage! (Monster HP: 9)
Monster attacks Player... missed.

--- Round 5 ---
Player attacks Monster... HIT for 10 damage! (Monster HP: -1)

=== Combat Over ===
The player wins with 15 HP remaining!
```

## How it works
- **One struct for both fighters.** `struct Character` holds hitpoints, hit chance, and a minimum and maximum hit, so the player and the monster are just two instances with different stats.
- **Passing structs by pointer.** `take_turn` receives the attacker and defender as `struct Character *`, so it can subtract damage from the defender directly with `defender->hitpoints`.
- **Random rolls.** `srand(time(NULL))` seeds the generator once. Each attack rolls 0–99 against the hit chance, and `roll_range` picks damage between the min and max hit.
- **Game loop.** The `while` loop runs while both fighters are alive, and the monster only swings back if it survived the player's attack.

# Makefile for the AV Gear Rental Tracker

CC      = gcc
CFLAGS  = -std=c99 -Wall -Wextra -pedantic
TARGET  = rental_tracker
OBJS    = main.o inventory.o fileio.o

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJS)

main.o: main.c inventory.h fileio.h
	$(CC) $(CFLAGS) -c main.c

inventory.o: inventory.c inventory.h
	$(CC) $(CFLAGS) -c inventory.c

fileio.o: fileio.c fileio.h inventory.h
	$(CC) $(CFLAGS) -c fileio.c

clean:
	rm -f $(TARGET) $(OBJS)

.PHONY: all clean

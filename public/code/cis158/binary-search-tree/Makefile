CC = gcc
CFLAGS = -std=c99 -Wall

main: main.o bst.o
	$(CC) $(CFLAGS) -o main main.o bst.o

main.o: main.c bst.h
	$(CC) $(CFLAGS) -c main.c

bst.o: bst.c bst.h
	$(CC) $(CFLAGS) -c bst.c

clean:
	rm -f main *.o

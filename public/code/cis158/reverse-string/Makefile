CC = gcc
CFLAGS = -std=c99 -Wall

main: main.o stack.o
	$(CC) $(CFLAGS) -o main main.o stack.o

main.o: main.c stack.h
	$(CC) $(CFLAGS) -c main.c

stack.o: stack.c stack.h
	$(CC) $(CFLAGS) -c stack.c

clean:
	rm -f main *.o

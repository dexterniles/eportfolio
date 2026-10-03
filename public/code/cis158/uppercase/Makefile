CC = gcc
CFLAGS = -std=c99 -Wall

uppercase: main.o uppercase.o
	$(CC) $(CFLAGS) -o uppercase main.o uppercase.o

main.o: main.c uppercase.h
	$(CC) $(CFLAGS) -c main.c

uppercase.o: uppercase.c uppercase.h
	$(CC) $(CFLAGS) -c uppercase.c

clean:
	rm -f *.o uppercase uppercase.exe

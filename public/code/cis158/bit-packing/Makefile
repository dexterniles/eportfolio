CC = gcc
CFLAGS = -Wall -std=c99 -I.
LDFLAGS =
OBJFILES = main.o bit_print.o pack_bits.o
TARGET = bp158

all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJFILES) $(LDFLAGS)

clean:
	rm -f $(OBJFILES) $(TARGET) *~

#include <stdio.h>

/* Header Declaration */
int sum (int, int);

int main (void) {
  int total;

  total = sum(2, 3);
  printf ("Total is %d\n", total);

  return 0;
}

int sum (int a, int b) {
  return a + b;
}

/* Total is 5 */

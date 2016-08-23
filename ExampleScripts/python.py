myList = [1,2,3,4,5,6]
taxRate = 0.7

def calculate_tax(rate, items):
  total = sum(items);
  total *= rate;
  return total;

answer = calculate_tax(0.8, myList)

print('Answer is', answer);

# ('Answer is', 16.8)

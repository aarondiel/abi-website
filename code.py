from random import choice

symbols = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

shit = ''
for i in range(22):
    shit += choice(symbols)

print(shit)

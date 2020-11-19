import random

characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
csv = ''

for student in range(100):
    csv += ''.join([random.choice(characters) for _ in range(8)]) + '\n'

with open('./ids.csv', 'w') as f:
    f.write(csv)

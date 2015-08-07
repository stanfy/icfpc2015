#!/usr/bin/env python
"""Draw board.

Expect input from stdin:

    $ cat problem_3.json | ./visualizer.py

If filename is given as argument, read that file:

    $ ./visualizer.py problem_3.json

"""

import json
import fileinput
from collections import defaultdict

def render(board):
    w, h = board['width'], board['height']
    field = defaultdict(lambda: defaultdict(bool))
    for cell in board['filled']:
        field[cell['x']][cell['y']] = True

    lines = []
    for row in range(w):
        line = ["*" if field[row][col] else "."
                for col in range(h)]
        if row % 2:
            line = ['']  + line
        lines.append(' '.join(line))
    return '\n'.join(lines)


if __name__ == '__main__':
    board = json.loads('\n'.join(fileinput.input()))
    print(render(board))



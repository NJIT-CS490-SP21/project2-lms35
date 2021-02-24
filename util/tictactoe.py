import itertools
from typing import List, Optional


def transpose(board) -> List[List]:
    return list(map(list, itertools.zip_longest(*board, fillvalue=None)))


def check_rows(board: List[List]) -> Optional[str]:
    for row in board:
        if len(set(row)) == 1:
            return row[0]
    return None


def check_diagonals(board) -> Optional[str]:
    if len(set([board[i][i] for i in range(len(board))])) == 1:
        return board[0][0]
    if len(set([board[i][len(board) - i - 1] for i in range(len(board))])) == 1:
        return board[0][len(board) - 1]
    return None


def check_win(board) -> Optional[str]:
    for trans_board in [board, transpose(board)]:
        result = check_rows(trans_board)
        if result is not None:
            return result
    return check_diagonals(board)










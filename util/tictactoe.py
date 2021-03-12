"""
Tic Tac Toe game logic
"""
import itertools
from typing import List, Optional


def transpose(board) -> List[List]:
    """
    Util to transpose rows and columns
    :param board:
    :return:
    """
    return list(map(list, itertools.zip_longest(*board, fillvalue=None)))


def check_rows(board: List[List]) -> Optional[str]:
    """
    Check rows for win condition
    :param board:
    :return:
    """
    for row in board:
        if len(set(row)) == 1:
            return row[0]
    return None


def check_diagonals(board) -> Optional[str]:
    """
    Check diagonals for win condition
    :param board:
    :return:
    """
    if len({[board[i][i] for i in range(len(board))]}) == 1:
        return board[0][0]
    if len({[board[i][len(board) - i - 1]
                for i in range(len(board))]}) == 1:
        return board[0][len(board) - 1]
    return None


def check_win(board) -> Optional[str]:
    """
    Check the board for a win
    :param board:
    :return:
    """
    for trans_board in [board, transpose(board)]:
        result = check_rows(trans_board)
        if result is not None:
            return result
    return check_diagonals(board)


def count_moves(board) -> int:
    """
    Count the number of moves on the board
    :param board:
    :return:
    """
    count = 0
    for row in board:
        for square in row:
            count += int(square is not None)
    return count

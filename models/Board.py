from typing import List, Optional

from util.tictactoe import check_win


class Board:
    __board: List[List]

    def __init__(self) -> None:
        super().__init__()
        self.reset()

    def reset(self) -> None:
        self.__board = [[None for i in range(3)] for j in range(3)]

    def check_win(self) -> Optional[str]:
        return check_win(self.__board)

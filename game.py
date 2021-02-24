from typing import List
from typing import Optional

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

    def get_square(self, i, j) -> Optional[str]:
        return self.__board[i][j]

    def set_square(self, i, j, value: str) -> None:
        self.__board[i][j] = value

    def get_all_squares(self) -> List[List]:
        return self.__board


class Player:
    __username: str
    __player_letter = 'X'  # X by default

    def __init__(self, username: str, player_letter: str) -> None:
        super().__init__()
        self.__username = username
        self.__player_letter = player_letter

    def get_player_letter(self) -> str:
        return self.__player_letter


class Spectator:
    __username = ""

    def __init__(self, username: str) -> None:
        super().__init__()
        self.__username = username

    def get_username(self) -> str:
        return self.__username


class Game:
    __players = {}
    __spectators = []
    __status = 0  # 0 -> waiting for players, 1 -> running, 2-> ended

    def __init__(self) -> None:
        super().__init__()
        self.__board = Board()
        self.reset()

    def reset(self) -> None:
        self.__players = {
            'X': None,
            'O': None
        }
        self.__spectators = []
        self.__board.reset()

    def get_status(self) -> int:
        return self.__status

    def set_status(self, status: int) -> None:
        self.__status = status

    def get_player_count(self) -> int:
        count = 0
        if self.__players['X']:
            count += 1
        if self.__players['O']:
            count += 1
        return count

    def get_spectator_count(self) -> int:
        return len(self.__spectators)

    def get_board(self) -> Board:
        return self.__board

    def __get_player(self, player: str) -> Optional[Player]:
        return self.__players[player]

    def __set_player(self, player: str, model: Player) -> None:
        self.__players[player] = model

    def get_x_player(self) -> Optional[Player]:
        return self.__get_player('X')

    def set_x_player(self, player: Player) -> None:
        self.__set_player('X', player)

    def get_o_player(self) -> Optional[Player]:
        return self.__get_player('O')

    def set_o_player(self, player: Player) -> None:
        self.__set_player('O', player)

    def add_spectator(self, spectator: Spectator) -> None:
        self.__spectators.append(spectator)

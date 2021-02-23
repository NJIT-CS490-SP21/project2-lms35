from models import Board


class Game:
    __players = []
    __spectators = []

    def __init__(self) -> None:
        super().__init__()
        self.__board = Board()
        self.reset()

    def reset(self) -> None:
        self.__players = []
        self.__spectators = []
        self.__board.reset()

    def get_player_count(self) -> int:
        return len(self.__players)

    def get_spectator_count(self) -> int:
        return len(self.__spectators)

    def get_board(self) -> Board:
        return self.__board

from models import Spectator


class Player(Spectator):
    __player_letter = 'X'  # X by default

    def __init__(self, username: str, player_letter: str) -> None:
        super().__init__(username)
        self.__player_letter = player_letter

    def get_player_letter(self) -> str:
        return self.__player_letter

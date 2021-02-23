class Spectator:
    __username = ""

    def __init__(self, username: str) -> None:
        super().__init__()
        self.__username = username

    def get_username(self) -> str:
        return self.__username

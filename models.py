"""
SQLAlchemy model definitions
"""
import datetime
import enum
import uuid

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Player(db.Model):
    """
    Player model for DB storage
    """
    username = db.Column(db.String(80), primary_key=True, nullable=False)
    wins = db.Column(db.Integer, nullable=False, default=0)
    losses = db.Column(db.Integer, nullable=False, default=0)
    score = db.Column(db.Integer, nullable=False, default=100)

    def __repr__(self):
        return '<Player %r>' % self.username

    def to_json(self):
        """
        Get a json serializable version of the object
        :return:
        """
        return {
            'username': self.username,
            'wins': self.wins,
            'losses': self.losses,
            'score': self.score
        }


class GameStatus(enum.Enum):
    """
    Game status enum
    """
    UNDEFINED = 0
    WAITING_FOR_PLAYERS = 1
    RUNNING = 2
    FINISHED = 3


def game_status_to_str(value):
    """
    Get a string serializable version of the game status
    :return:
    """
    if value == GameStatus.RUNNING:
        return 'running'
    if value == GameStatus.WAITING_FOR_PLAYERS:
        return 'waiting_for_players'
    if value == GameStatus.FINISHED:
        return 'finished'
    return 'undefined'


class Game(db.Model):
    """
    Game model for DB storage
    """
    id = db.Column(db.String(36), primary_key=True,
                   nullable=False)  # UUIDv4 game id
    status = db.Column(db.Enum(GameStatus),
                       nullable=False,
                       default=GameStatus.UNDEFINED)  # enum status for game
    player_x = db.Column(db.String(80))  # player o's username
    player_o = db.Column(db.String(80))  # player o's username
    winner = db.Column(
        db.String(80))  # winner's username, null until there is one
    squares = db.Column(db.ARRAY(db.CHAR),
                        nullable=False,
                        default=[
                            [None, None, None],
                            [None, None, None],
                            [None, None, None],
                        ])  # 3x3 square
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow
                             )  # create date to order newest ones first

    def __repr__(self):
        return '<Game %r>' % self.id

    def to_json(self):
        """
        Get a json serializable version of the object
        :return:
        """
        return {
            'id': self.id,
            'status': game_status_to_str(self.status),
            'player_x': self.player_x,
            'player_o': self.player_o,
            'winner': self.winner,
            'squares': self.squares
        }


def get_leaderboard() -> list:
    """
    Helper function to get leaderboard from database and process it
    :return:
    """
    return list(
        map(lambda p: p.to_json(),
            Player.query.order_by(Player.score.desc()).all()))


def get_games() -> list:
    """
    Get list of games from the database and return as a list of dictionaries
    :return:
    """
    return list(
        map(lambda g: g.to_json(),
            Game.query.order_by(Game.created_date.desc()).all()))


def create_game(player_x_username: str) -> dict:
    """
    Create a game and persist it in the database
    :return:
    """

    # create game model
    game = Game(
        id=str(uuid.uuid4()),
        status=GameStatus.WAITING_FOR_PLAYERS,
        player_x=player_x_username,
    )

    # save in database
    db.session.add(game)
    db.session.commit()

    return game.to_json()


def set_game_player_o(game_id, username) -> dict:
    """
    Sets the O-player of a game
    :param game_id:
    :param username:
    :return:
    """
    Game.query.filter_by(id=game_id).update(
        dict(player_o=username, status=GameStatus.RUNNING))
    db.session.commit()
    return Game.query.filter_by(id=game_id).first().to_json()


def set_game_square(game_id: str, i: int, j: int, player: str) -> dict:
    """
    Set the tile of a game to a player
    :param game_id:
    :param i:
    :param j:
    :param player:
    :return:
    """
    game = Game.query.filter_by(id=game_id).first()
    game.squares[i][j] = player
    Game.query.filter_by(id=game_id).update(dict(squares=game.squares))
    db.session.commit()
    return game.to_json()


def set_game_winner(game_id: str, winner: str) -> dict:
    """
    Set the winner of a game
    :param game_id:
    :param winner:
    :return:
    """
    game = Game.query.filter_by(id=game_id).first()  # get game from database

    winner_username = (game.player_x if winner == 'x' else game.player_o)
    loser_username = (game.player_o if winner == 'x' else game.player_x)

    game.winner = winner_username
    game.status = GameStatus.FINISHED
    db.session.commit()

    winner = Player.query.filter_by(
        username=winner_username).first()  # get winner from database
    winner.wins += 1
    winner.score += 1
    db.session.commit()

    loser = Player.query.filter_by(
        username=loser_username).first()  # get loser from database
    loser.losses += 1
    loser.score -= 1
    db.session.commit()

    return game.to_json()


def set_game_tie(game_id: str) -> dict:
    """
    Set a game to tie status
    :param game_id:
    :return:
    """
    game = Game.query.filter_by(id=game_id).first()  # get game from database
    game.status = GameStatus.FINISHED  # set status to finished
    db.session.commit()
    return game.to_json()

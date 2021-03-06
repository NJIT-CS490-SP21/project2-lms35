import datetime
import enum
import uuid

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Player(db.Model):
    username = db.Column(db.String(80), primary_key=True, nullable=False)
    wins = db.Column(db.Integer, nullable=False, default=0)
    losses = db.Column(db.Integer, nullable=False, default=0)
    score = db.Column(db.Integer, nullable=False, default=100)

    def __repr__(self):
        return '<Player %r>' % self.username

    def toJSON(self):
        return {
            'username': self.username,
            'wins': self.wins,
            'losses': self.losses,
            'score': self.score
        }


class GameStatus(enum.Enum):
    undefined = 0
    waiting_for_players = 1
    running = 2
    finished = 3

    def to_str(value):
        if value == GameStatus.running:
            return 'running'
        elif value == GameStatus.waiting_for_players:
            return 'waiting_for_players'
        elif value == GameStatus.finished:
            return 'finished'
        else:
            return 'undefined'


class Game(db.Model):
    id = db.Column(db.String(36), primary_key=True, nullable=False)  # UUIDv4 game id
    status = db.Column(db.Enum(GameStatus), nullable=False,
                       default=GameStatus.undefined)  # enum status for game
    player_x = db.Column(db.String(80))  # player o's username
    player_o = db.Column(db.String(80))  # player o's username
    winner = db.Column(db.String(80))  # winner's username, null until there is one
    squares = db.Column(db.ARRAY(db.CHAR),
                        nullable=False,
                        default=[[None, None, None],
                                 [None, None, None],
                                 [None, None, None], ])  # 3x3 square
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)  # create date to order newest ones first

    def __repr__(self):
        return '<Game %r>' % self.id

    def toJSON(self):
        return {
            'id': self.id,
            'status': GameStatus.to_str(self.status),
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
    return list(map(lambda p: p.toJSON(), Player.query.order_by(Player.score.desc()).all()))


def get_games() -> list:
    """
    Get list of games from the database and return as a list of dictionaries
    :return:
    """
    return list(map(lambda g: g.toJSON(), Game.query.order_by(Game.created_date.desc()).all()))


def create_game(player_x_username: str) -> dict:
    """
    Create a game and persist it in the database
    :return:
    """

    # create game model
    game = Game(
        id=str(uuid.uuid4()),
        status=GameStatus.waiting_for_players,
        player_x=player_x_username,
    )

    # save in database
    db.session.add(game)
    db.session.commit()

    return game.toJSON()


def set_game_player_o(game_id, username) -> dict:
    Game.query.filter_by(id=game_id).update(dict(
        player_o=username,
        status=GameStatus.running
    ))
    db.session.commit()
    return Game.query.filter_by(id=game_id).first().toJSON()


def set_game_square(game_id: str, i: int, j: int, player: str) -> dict:
    game = Game.query.filter_by(id=game_id).first()
    game.squares[i][j] = player
    Game.query.filter_by(id=game_id).update(dict(squares=game.squares))
    db.session.commit()
    return game.toJSON()


def set_game_winner(game_id: str, winner: str) -> dict:
    game = Game.query.filter_by(id=game_id).first()  # get game from database

    winner_username = (game.player_x if winner == 'x' else game.player_o)
    loser_username = (game.player_o if winner == 'x' else game.player_x)

    game.winner = winner_username
    game.status = GameStatus.finished
    db.session.commit()

    winner = Player.query.filter_by(username=winner_username).first()  # get winner from database
    winner.wins += 1
    winner.score += 1
    db.session.commit()

    loser = Player.query.filter_by(username=loser_username).first()  # get loser from database
    loser.losses += 1
    loser.score -= 1
    db.session.commit()

    return game.toJSON()


def set_game_tie(game_id: str) -> dict:
    game = Game.query.filter_by(id=game_id).first()  # get game from database
    game.status = GameStatus.finished  # set status to finished
    db.session.commit()
    return game.toJSON()

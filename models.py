import enum

from db import db


class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
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
    status = db.Column(db.Enum(GameStatus), nullable=False, default=GameStatus.undefined)
    player_x = db.Column(db.String(80))
    player_o = db.Column(db.String(80))
    winner = db.Column(db.String(80))
    squares = db.Column(db.ARRAY(db.CHAR), nullable=False, default=[[None, None, None],
                                                                    [None, None, None],
                                                                    [None, None, None], ])

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

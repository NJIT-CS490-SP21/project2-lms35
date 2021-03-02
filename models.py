from sqlalchemy import func

from db import db
import enum


class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    wins = db.Column(db.Integer, nullable=False, default=0)
    losses = db.Column(db.Integer, nullable=False, default=0)
    score = db.Column(db.Integer, nullable=False, default=100)

    def __repr__(self):
        return '<Player %r>' % self.username


class GameStatus(enum.Enum):
    undefined = 0
    waiting_for_players = 1
    running = 2
    finished = 3


class Game(db.Model):
    id = db.Column(db.String(36), primary_key=True, nullable=False)  # UUIDv4 game id
    status = db.Column(db.Enum(GameStatus), nullable=False, default=GameStatus.undefined)
    player_x = db.Column(db.String(80))
    player_o = db.Column(db.String(80))
    winner = db.Column(db.String(80))

    def __repr__(self):
        return '<Game %r>' % self.id
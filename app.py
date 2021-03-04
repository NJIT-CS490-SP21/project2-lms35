import os
import uuid
from html import escape

from dotenv import load_dotenv
from flask import Flask, send_from_directory, json, session, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room

import models
from db import db
from game import Game

# load .env for testing
load_dotenv()

# app setup with secret key for session
app = Flask(__name__, static_folder='./build/static')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret!')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# init db
db.init_app(app)
with app.app_context():
    db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)
# setup the game
game = Game()
game.reset()


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


# route to handle login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return handle_login()
    else:
        return get_login()


# TODO: Handle logout
# route to handle logout
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return {'ok': True}


# create a new session or restart a session
def handle_login():
    username = escape(request.form.get("username", str, None))
    if not username:
        return {"error": "bad_request"}, 400
    session['username'] = username
    session['uuid'] = game.get_uuid()

    # check if player already exists
    player = models.Player.query.filter_by(username=username).first()
    if not player:
        # new player, add them
        player = models.Player(username=username)
        db.session.add(player)
        db.session.commit()

        # notify all leaderboard listeners
        socketio.emit('leaderboard', get_leaderboard(), broadcast=True, include_self=False, namespace='/',
                      skip_sid=True)

    return player.toJSON()

    '''
    if game.get_player_count() == 2:
        game.add_spectator(Spectator(username))
        session['type'] = 'spectator'
    elif game.get_x_player() is None:
        game.set_x_player(Player(username, 'X'))
        session['type'] = 'player'
        session['player'] = 'X'
    else:
        game.set_o_player(Player(username, 'O'))
        session['type'] = 'player'
        session['player'] = 'O'
        game.set_status(1)
        socketio.emit('game', get_game(), broadcast=True, include_self=False, namespace='/', skip_sid=True)
    '''
    return {k: v for k, v in session.items() if k in ('username', 'type', 'player')}, 201


# get current login session
def get_login():
    if 'username' in session and 'uuid' in session and session['uuid'] == game.get_uuid():
        return {"username": session['username']}, 200
    else:
        return {"error": "unauthorized"}, 401


# get leaderboard
@app.route('/leaderboard', methods=['GET'])
def route_leaderboard():
    return {'players': get_leaderboard()}


def get_leaderboard():
    return list(map(lambda p: p.toJSON(), models.Player.query.order_by(models.Player.score).all()))


# get current game state
@app.route('/game', methods=['GET'])
def route_game_old():
    return get_game_bak()


@app.route('/games', methods=['GET', 'POST'])
def route_games():
    if request.method == 'POST':
        return create_game(session['username'])
    else:
        return {'games': get_games()}


def get_games():
    """
    Get list of games from the database and return as a list of dictionaries
    :return:
    """
    return list(map(lambda g: g.toJSON(), models.Game.query.all()))


def create_game(player_x_username: str):
    """
    Create a game and persist it in the database
    :return:
    """

    # create game model
    game = models.Game(
        id=str(uuid.uuid4()),
        status=models.GameStatus.waiting_for_players,
        player_x=player_x_username,
    )

    # save in database
    db.session.add(game)
    db.session.commit()

    # alert clients that a new game has been added
    socketio.emit('games', game.toJSON(), broadcast=True, include_self=False, namespace='/',
                  skip_sid=True)

    return game.toJSON()


@app.route('/games/<game_id>', methods=['GET', 'PUT'])
def route_game(game_id):
    if request.method == 'PUT':  # inferring this to mean join to play
        models.Game.query.filter_by(id=game_id).update(dict(
            player_o=session['username'],
            # status=models.GameStatus.running
        ))
        db.session.commit()
        return {'player_o': session['username']}
    else:
        game = get_game(game_id)
        if not game:
            return {'error': 'not_found'}, 404
        return {'game': game.toJSON()}


def get_game(id):
    return models.Game.query.filter_by(id=id).first()


def get_game_bak():
    rows = game.get_board().get_all_squares()
    board = []
    for row in rows:
        for square in row:
            board.append(square)

    return {
        'uuid': game.get_uuid(),
        'status': game.get_status(),
        'board': board,
        'winner': game.get_winner()
    }


@socketio.on('connect')
def on_connect():
    if 'type' in session and session['type'] == 'player' and game.get_status() == 0 and game.get_player_count() == 2:
        game.set_status(2)
        socketio.emit('game', get_game_bak(), broadcast=True, include_self=False)


@socketio.on('disconnect')
def on_disconnect():
    if 'type' in session and session['type'] == 'player' and game.get_status() == 1 and game.get_player_count() == 2:
        # game.set_status(0)
        socketio.emit('game', get_game_bak(), broadcast=True, include_self=False)


@socketio.on('claim')
def on_claim(data):
    game.get_board().set_square(data['i'] // 3, data['i'] % 3, data['p'])
    socketio.emit('claim', data, broadcast=True, include_self=False)
    winner = game.get_board().check_win()
    if winner:
        game.set_status(3)
        game.set_winner(winner)
        socketio.emit('game', get_game_bak(), broadcast=True, include_self=True)


@socketio.on('reset')
def on_reset():
    game.reset()
    game.set_status(1)
    socketio.emit('game', get_game_bak(), broadcast=True, include_self=True)


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)


socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)

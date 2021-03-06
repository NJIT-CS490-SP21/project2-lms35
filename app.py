import os
from html import escape

from dotenv import load_dotenv
from flask import Flask, send_from_directory, json, session, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, send

import models
from db import db
# load .env for testing
from util import tictactoe

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

    # check if player already exists
    player = models.Player.query.filter_by(username=username).first()
    if not player:
        # new player, add them
        player = models.Player(username=username)
        db.session.add(player)
        db.session.commit()

        # notify all leaderboard listeners
        socketio.emit('leaderboard', models.get_leaderboard(), broadcast=True, include_self=False, namespace='/',
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
    if 'username' in session:
        return {"username": session['username']}, 200
    else:
        return {"error": "unauthorized"}, 401


# get leaderboard
@app.route('/leaderboard', methods=['GET'])
def route_leaderboard():
    return {'players': models.get_leaderboard()}


@app.route('/games', methods=['GET', 'POST'])
def route_games():
    if request.method == 'POST':
        game = models.create_game(session['username'])  # create the game in the db
        socketio.emit('games', game, broadcast=True, include_self=False, namespace='/',
                      skip_sid=True)  # alert clients that a new game has been added
        return game
    else:
        return {'games': models.get_games()}


@app.route('/games/<game_id>', methods=['GET', 'PUT'])
def route_game(game_id):
    if request.method == 'PUT':  # inferring this to mean join to play
        game = models.set_game_player_o(game_id, session['username'])  # set player o on the game
        socketio.emit('game', game, room=game['id'])  # tell the players of the game that it has started
        # socketio.emit('games', game.toJSON(), broadcast=True, include_self=False, namespace='/', skip_sid=True) # tell everyone to update their games list
        return {'player_o': session['username']}
    else:
        game = get_game(game_id)
        if not game:
            return {'error': 'not_found'}, 404
        return {'game': game.toJSON()}


def get_game(id):
    """
    Helper function to simply getting games by id
    :param id:
    :return:
    """
    return models.Game.query.filter_by(id=id).first()


@socketio.on('claim')
def on_claim(data):
    game_id = data['channel']
    game = models.set_game_square(game_id, data['i'], data['j'], ('x' if data['u'] == 1 else 'o'))
    socketio.emit('claim', data, room=game_id)
    winner = tictactoe.check_win(game['squares'])
    if winner:
        game = models.set_game_winner(game_id, (game['player_x'] if winner == 'x' else game['player_o']))
        socketio.emit('game', game, broadcast=True, include_self=True)


@socketio.on('subscribe')
def on_subscribe(game_id):
    username = session['username']
    room = game_id
    join_room(room)
    send(username + ' has entered the room.', room=room)


@socketio.on('unsubscribe')
def on_unsubscribe(game_id):
    username = session['username']
    room = game_id
    leave_room(room)
    send(username + ' has left the room.', room=room)


socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)

import os
from html import escape

from flask import Flask, send_from_directory, json, session, request, make_response, Response, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS

from game import Spectator, Game, Player

# app setup with secret key for session
app = Flask(__name__, static_folder='./build/static')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret!')
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


# create a new session or restart a session
def handle_login():
    username = escape(request.form.get("username", str, None))
    if not username:
        return {"error": "bad_request"}, 400
    session['username'] = username
    session['uuid'] = game.get_uuid()

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

    return {k: v for k, v in session.items() if k in ('username', 'type', 'player')}, 201


# get current login session
def get_login():
    if 'username' in session and 'uuid' in session and session['uuid'] == game.get_uuid():
        return {"username": session['username']}, 200
    else:
        return {"error": "unauthorized"}, 401


# get current game state
@app.route('/game', methods=['GET'])
def route_game():
    return get_game()


def get_game():
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
        game.set_status(1)
        socketio.emit('game', get_game(), broadcast=True, include_self=False)


@socketio.on('disconnect')
def on_disconnect():
    if 'type' in session and session['type'] == 'player' and game.get_status() == 1 and game.get_player_count() == 2:
        # game.set_status(0)
        socketio.emit('game', get_game(), broadcast=True, include_self=False)


@socketio.on('claim')
def on_claim(data):
    game.get_board().set_square(data['i'] // 3, data['i'] % 3, data['p'])
    socketio.emit('claim', data, broadcast=True, include_self=False)
    winner = game.get_board().check_win()
    if winner:
        game.set_status(2)
        game.set_winner(winner)
        socketio.emit('game', get_game(), broadcast=True, include_self=True)


@socketio.on('reset')
def on_reset():
    game.reset()
    game.set_status(1)
    socketio.emit('game', get_game(), broadcast=True, include_self=True)


socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)

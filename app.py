"""
Main flask app to handle tic-tac-toe routes and socket events
Luca Santarella
"""
import os
from html import escape

from flask import request, send_from_directory, session
from flask_socketio import join_room, leave_room

import factories
import models
from util import tictactoe

app, cors, socketio, db = factories.create_app()


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    """
    Default route to serve static assets
    :param filename:
    :return:
    """
    return send_from_directory('./build', filename)


# route to handle login
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle login route
    :return:
    """
    if request.method == 'POST':
        return handle_login()

    return get_login()


# route to handle logout
@app.route('/logout', methods=['GET'])
def logout():
    """
    Handle logout route
    :return:
    """
    session.clear()
    return {'ok': True}


# create a new session or restart a session
def handle_login():
    """
    Function to handle login and construct session parameters
    :return:
    """
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
        socketio.emit('leaderboard',
                      models.get_leaderboard(),
                      broadcast=True,
                      include_self=False,
                      namespace='/',
                      skip_sid=True)

    return player.to_json(), 201


# get current login session
def get_login():
    """
    Get login from current session
    :return:
    """
    if 'username' in session:
        return {"username": session['username']}, 200
    return {"error": "unauthorized"}, 401


# get leaderboard
@app.route('/leaderboard', methods=['GET'])
def route_leaderboard():
    """
    Handle leaderboard route
    :return:
    """
    return {'players': models.get_leaderboard()}


@app.route('/games', methods=['GET', 'POST'])
def route_games():
    """
    Handle games list route
    :return:
    """
    if request.method == 'POST':
        game = models.create_game(
            session['username'])  # create the game in the db
        socketio.emit(
            'games',
            game,
            broadcast=True,
            include_self=False,
            namespace='/',
            skip_sid=True)  # alert clients that a new game has been added
        return game
    return {'games': models.get_games()}


@app.route('/games/<game_id>', methods=['GET', 'PUT'])
def route_game(game_id):
    """
    Handle get game route
    :param game_id:
    :return:
    """
    if request.method == 'PUT':  # inferring this to mean join to play
        game = models.set_game_player_o(
            game_id, session['username'])  # set player o on the game
        socketio.emit('game', game, room=game['id']
                      )  # tell the players of the game that it has started
        socketio.emit(
            'games',
            game,
            broadcast=True,
            include_self=False,
            namespace='/',
            skip_sid=True)  # tell everyone to update their games list
        return {'game': game}

    game = get_game(game_id)
    if not game:
        return {'error': 'not_found'}, 404
    return {'game': game.to_json()}


def get_game(game_id):
    """
    Helper function to simply getting games by id
    :param game_id:
    :return:
    """
    return models.Game.query.filter_by(id=game_id).first()


@socketio.on('claim')
def on_claim(data):
    """
    Handle square claim socket event for the game
    :param data:
    :return:
    """
    game_id = data['channel']
    game = models.set_game_square(game_id, data['i'], data['j'],
                                  ('x' if data['u'] == 1 else 'o'))
    socketio.emit('claim', data, room=game_id)
    winner = tictactoe.check_win(game['squares'])
    moves = tictactoe.count_moves(game['squares'])
    if winner:
        game = models.set_game_winner(
            game_id, winner)  # set the game's winner and update scores
        socketio.emit(
            'leaderboard',
            broadcast=True,
            include_self=False,
            namespace='/',
            skip_sid=True)  # tell everyone to update their leaderboards
        socketio.emit('games', game, broadcast=True, include_self=True)
        socketio.emit('game', game, room=game_id)
    elif moves == 9:
        game = models.set_game_tie(game_id)  # set the game to a tie
        socketio.emit(
            'games', game, broadcast=True,
            include_self=True)  # notify everyone that game is finished
        socketio.emit('game', game,
                      room=game_id)  # notify players that the game has ended


@socketio.on('subscribe')
def on_subscribe(game_id):
    """
    Handle socket-io room subscription event
    :param game_id:
    :return:
    """
    join_room(game_id)


@socketio.on('unsubscribe')
def on_unsubscribe(game_id):
    """
    Handle socket-io room unsubscription event
    :param game_id:
    :return:
    """
    leave_room(game_id)


socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)

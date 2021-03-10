# Project 2

### Luca Santarella

## Requirements

1. `npm install`
2. `pip install -r requirements.txt`

## Setup

1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
2. Install requirements as above
3. Copy `.env.sample` to `.env` and populate with an appropriate database url

## Run Application

1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku

*Don't do the Heroku step for assignments, you only need to deploy for Project 2*

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Known problems

1. The application uses cookie sessions (not database sessions), but the Socket-Io connection runs on page load. Once
   the user logs in, Socket-Io in Flask must become aware of the session, so the frontend disconnects and reconnects the
   socket to fix this. If I had more time, I would use database sessions this way the Socket-Io thread in Flask could
   query the database directly and not have to worry about session-syncing with the main Flask thread.

2. The UI lacks any sort of fancy or user-friendly styling. The buttons and text are all the same size. Given more time
   I would write some much better styles and maybe use Boostrap or the like.

## Technical Issues That Were Overcome

1. Moving the socket io connection to the application class and passing it as a property was difficult,
   but I overcame this by planning out the frontend very methodically before programming it. This allowed me to 
   start with the Socket-Io class at a high level without needing to refactor afterwards.
   
2. Managing the database connection between the Socket-Io thread in Flask and the main Flask thread was difficult
   and also required a lot of trial and error. SqlAlchemy does alot behind the scenes and the type-hinting was weak.
   I overcame this issue by using the Flask "factorization" pattern of creating the application and abstracting the 
   database connection away from the application.
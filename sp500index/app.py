from crypt import methods
from flask import Flask

from databot import Bot

app = Flask(__name__)
bot = Bot()


@app.route("/api/data", methods=["GET"])
def get_data():
    if bot.isLoaded():
        return bot.data
    else:
        return "Please Wait!"

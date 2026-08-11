from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def wizard():
    return render_template(
        "main.html",
        page_title = "PostgresSQL Tuning Wizard"

    )




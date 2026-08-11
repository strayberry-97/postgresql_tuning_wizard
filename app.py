from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def wizard():
    return render_template(
        "main.html",
        page_title = "PostgreSQL Tuning Wizard"
    )

if __name__ == "__main__":
    app.run(port=8000, debug=True)



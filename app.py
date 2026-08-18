from flask import Flask, render_template, request, jsonify

from analyzer.analyze_plan import analyze_plan
from analyzer.connection import establish_connection
from analyzer.main import get_query_plan

app = Flask(__name__)

@app.route("/")
def wizard():
    return render_template(
        "main.html",
        page_title = "PostgreSQL Tuning Wizard"
    )

@app.route('/api/data/', methods=['POST'])
def handle_json():
    data = request.get_json()

    db_params = {
        "dbname": data.get('databaseName'),
        "user": data.get('username'),
        "password": data.get('password'),
        "host": data.get('host'),
        "port": data.get('port'),
    }

    if establish_connection(db_params) is not None:
        return jsonify({
            "status" : "connected"
        }), 200
    return jsonify({
        "status": "failed"
    }), 400

@app.route("/api/analyze/", methods=['POST'])
def analyze_query():
    data = request.get_json()

    db_params = {
        "dbname": data.get('databaseName'),
        "user": data.get('username'),
        "password": data.get('password'),
        "host": data.get('host'),
        "port": data.get('port'),
    }
    plan = get_query_plan(db_params, data.get("query"))
    print(plan)
    results = analyze_plan(plan)
    return jsonify(results)

if __name__ == "__main__":
    app.run(port=8000, debug=True)



from flask import Flask, request, jsonify
from flask_cors import CORS
from db.functions_db import insert_work, get_works, update_work_status, delete_work

app = Flask(__name__)
CORS(app)


@app.route('/home', methods=['POST'])
def home():
    data = request.json
    description = data.get('description')

    insert_work(description)
    
    return jsonify({"message": "Work added successfully"}), 200


@app.route('/works', methods=['GET'])
def works():
    works_data = get_works()
    tasks = [{"description": work[0], "dateAdded": work[1], "finished": work[2]} for work in works_data]
    
    return jsonify(tasks), 200


@app.route('/work/<string:description>/complete', methods=['POST'])
def complete_work(description):
    update_work_status(description)
    
    return jsonify({"message": "Work marked as complete"}), 200


@app.route('/work/<string:description>/delete', methods=['DELETE'])
def delete_work_route(description):
    delete_work(description)

    return jsonify({"message": "Work deleted successfully"}), 200


if __name__ == '__main__':
    app.run(debug=False)
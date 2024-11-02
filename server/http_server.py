from flask import Flask, request, jsonify
import csv
import os

app = Flask(__name__)

PORT = 8000
ID_PACS_CSV_PATH = 'data/id_pacs.csv'
id_pacs_data = []

def load_id_pacs_data():
    global id_pacs_data
    with open(ID_PACS_CSV_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        id_pacs_data = [row for row in reader]

@app.route('/api/query', methods=['POST'])
def query_patient_ids():
    data = request.get_json()
    query_string = data.get('patientId', '')
    patient_ids = [row['ic_pac'] for row in id_pacs_data if query_string in row['ic_pac']]
    return jsonify(patient_ids)

@app.route('/api/hello', methods=['GET'])
def say_hello():
    return 'hello milan'

@app.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

if __name__ == '__main__':
    os.chdir(os.curdir)  # or set to your specific path
    load_id_pacs_data()
    app.run(port=PORT, debug=True)
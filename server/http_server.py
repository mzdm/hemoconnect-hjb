from flask import Flask, request, jsonify
import csv
import os

app = Flask(__name__)

PORT = 8000
ID_PACS_CSV_PATH = 'data/id_pacs.csv'
PATIENT_AMB_CSV_PATH = 'data/patient_amb.csv'
id_pacs_data = []
patient_amb_data = []

def preload_data():
    global id_pacs_data
    global patient_amb_data
    with open(ID_PACS_CSV_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        id_pacs_data = [row for row in reader]

    with open(PATIENT_AMB_CSV_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        patient_amb_data = [row for row in reader]

@app.route('/api/query', methods=['POST'])
def query_patient_ids():
    data = request.get_json()
    query_string = data.get('patientId', '')
    patient_ids = [row['ic_pac'] for row in id_pacs_data if row['ic_pac'].startswith(query_string)]
    return jsonify(patient_ids)

@app.route('/api/query/<patientId>', methods=['POST'])
def query_patient_details(patientId):
    patient_details = [
        {
            'ic_pac': row['ic_pac'],
            'ic_amb_zad': row['ic_amb_zad'],
            'i_dg_kod': row['i_dg_kod'],
            'i_text_dg': row['i_text_dg']
        }
        for row in patient_amb_data if row['ic_pac'] == patientId
    ]
    if not patient_details:
        return jsonify({'error': 'Patient not found'}), 404
    return jsonify(patient_details)

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
    preload_data()
    app.run(port=PORT, debug=True)
import csv
import os
from flask import Flask, request, jsonify
from openai import OpenAI

from db import DBHandler  # Now using the iris-based DBHandler
from models.form_schema import FormSchema, FormSchemaWithPatientMetadata, PatientMetadata
from parser.clean import ExportedCSV
from parser.openai_parser import process_report, initialize_client
from parser.report_types import KeyValueWithMeta
from search import create_form_embeddings, search

app = Flask(__name__)

PORT = 8000
ID_PACS_CSV_PATH = 'data/id_pacs.csv'
PATIENT_AMB_CSV_PATH = 'data/patient_amb.csv'
AMB_CLEANED_FILE_PATH = 'data/amb_cleaned.csv'
id_pacs_data = []
patient_amb_data = []
amb_cleaned_data: ExportedCSV
db_handler = DBHandler()
db_handler.connect()

openai_client: OpenAI = None

def preload_data():
    global id_pacs_data
    global patient_amb_data
    global amb_cleaned_data
    with open(ID_PACS_CSV_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        id_pacs_data = [row for row in reader]

    with open(PATIENT_AMB_CSV_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        patient_amb_data = [row for row in reader]

    with open(AMB_CLEANED_FILE_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        amb_cleaned_data = ExportedCSV(list(reader), reader.fieldnames)

    # Initialize database connection and run migrations
    db_handler.connect()
    db_handler.migrate()

def find_patient_by_patient_metadata(patient_metadata: PatientMetadata):
    for row in amb_cleaned_data:
        if row['ic_amb_zad'].strip() == patient_metadata.ic_amb_zad:
            if row['ic_pac'].strip() == patient_metadata.ic_pac:
                    if row['i_dg_kod'].strip() == patient_metadata.i_dg_kod:
                        return row[list(row.keys())[-1]] # return the last column
    return None

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

@app.route('/api/query/submit-form', methods=['POST'])
def submit_form():
    data = request.get_json()
    try:
        request_data = FormSchemaWithPatientMetadata(**data)
        form = request_data.formSchema
        patientMetadata = request_data.patientMetadata
        find_row = find_patient_by_patient_metadata(patientMetadata)
        create_form_embeddings(db_handler, form.dict(), str(form.uuid))
        parsed_with_metadata: list[KeyValueWithMeta] = process_report(openai_client, find_row, form)
        values = []
        for data in parsed_with_metadata:
            result = search(db_handler, data.dict(), str(form.uuid))
            result_data = data.dict()
            result_data["confidence"] = result[0][1]
            result_data["title"] = result[0][0]
            values.append(result_data)
        return jsonify(values), 201
    except KeyError as e:
        return jsonify({'error': f'Missing field: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    try:
        openai_client = initialize_client()
        preload_data()
        app.run(port=PORT, debug=True)
    finally:
        db_handler.close()
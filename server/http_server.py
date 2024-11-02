import csv
import http.server
import json
import socketserver
import os

PORT = 8000

ID_PACS_CSV_PATH = 'data/id_pacs.csv'
id_pacs_data = []

def load_id_pacs_data():
    global id_pacs_data
    with open(ID_PACS_CSV_PATH, mode='r', encoding='windows-1250') as file:
        reader = csv.DictReader(file, delimiter=';')
        id_pacs_data = [row for row in reader]

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def search_patient_ids(self, query):
        return [row['ic_pac'] for row in id_pacs_data if query in row['ic_pac']]

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    # def do_GET(self):
    #     if self.path == '/api/hello':
    #         self.send_response(200)
    #         self.send_header('Content-type', 'text/plain')
    #         self.end_headers()
    #         self.wfile.write(b'hello milan')
    #     else:
    #         super().do_GET()

    def do_POST(self):
        if self.path == '/api/query':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            query_string = json.loads(post_data.decode('utf-8')).get('patientId', '')

            # Implement your search logic here
            patient_ids = self.search_patient_ids(query_string)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            # self.end_headers()
            self.wfile.write(json.dumps(patient_ids).encode('utf-8'))
        # else:
        #     super().do_POST()


# os.chdir('/path/to/your/files')
os.chdir(os.curdir)
load_id_pacs_data()
handler_object = MyHttpRequestHandler
with socketserver.TCPServer(("", PORT), handler_object) as httpd:
    print(f"Serving at port {PORT}")
    print("Server is running. Press Ctrl+C to stop the server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("Server stopped.")
    httpd.server_close()
    print("Server closed.")

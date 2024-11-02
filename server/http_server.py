import http.server
import json
import socketserver
import os

PORT = 8000

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def search_patient_ids(self, query):
        # Dummy list
        all_patient_ids = ['123', '456', '789']
        return [pid for pid in all_patient_ids if query in pid]

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        if self.path == '/api/hello':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'hello milan')
        elif self.path == '/api/queryPatientId':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            query_string = json.loads(post_data.decode('utf-8')).get('query', '')

            # Implement your search logic here
            patient_ids = self.search_patient_ids(query_string)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(patient_ids).encode('utf-8'))
        else:
            super().do_GET()


# os.chdir('/path/to/your/files')
os.chdir(os.curdir)
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

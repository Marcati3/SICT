import http.server, socketserver, os, sys
d = r"C:\Users\intln\Claude\Projects\Business-SICT\SIC-Dashboards\sales"
os.chdir(d)
print(f"Serving from: {os.getcwd()}", flush=True)
print(f"Files: {os.listdir('.')}", flush=True)
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8765), handler) as httpd:
    print(f"Serving at http://localhost:8765", flush=True)
    httpd.serve_forever()

#!/usr/bin/env python3
import http.server
import socketserver
import os

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent any caching
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
    
    def send_response(self, code, message=None):
        # Never send 304, always send full response
        if code == 304:
            code = 200
        super().send_response(code, message)

PORT = 5000
Handler = NoCacheHTTPRequestHandler

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Server running at http://0.0.0.0:{PORT}/ with no-cache headers")
    httpd.serve_forever()

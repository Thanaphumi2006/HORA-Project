"""
HORA — Local App Launcher
Run this file to start HORA in your browser.
Requires Python 3 (https://python.org)
"""

import os
import sys
import socket
import threading
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
HOST = "localhost"


def find_free_port(start=8080):
    for port in range(start, start + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex((HOST, port)) != 0:
                return port
    return start


class QuietHandler(SimpleHTTPRequestHandler):
    """Suppress request logs for a cleaner terminal output."""
    def log_message(self, format, *args):
        pass


def open_browser(port):
    url = f"http://{HOST}:{port}/index.html"
    print(f"\n  HORA is running at: {url}")
    print("  Press Ctrl+C to stop the server.\n")
    webbrowser.open(url)


def main():
    # Change to the directory where this script lives
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    port = find_free_port(PORT)

    server = HTTPServer((HOST, port), QuietHandler)

    # Open browser after a short delay so the server is ready
    timer = threading.Timer(0.5, open_browser, args=(port,))
    timer.start()

    print("\n  ╔══════════════════════════════╗")
    print("  ║        HORA  Launcher        ║")
    print("  ╚══════════════════════════════╝")
    print(f"\n  Starting server on port {port}...")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        timer.cancel()
        print("\n\n  Server stopped. Goodbye!\n")
        server.shutdown()
        sys.exit(0)


if __name__ == "__main__":
    main()

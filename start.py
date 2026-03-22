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
from functools import partial

PORT = 8080
HOST = "localhost"


def find_free_port(start=8080):
    for port in range(start, start + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex((HOST, port)) != 0:
                return port
    return start


def make_handler(directory):
    """Create a handler that always serves from the given directory."""
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)

        def log_message(self, format, *args):
            pass  # Suppress noisy request logs

    return Handler


def open_browser(port):
    url = f"http://{HOST}:{port}/index.html"
    print(f"  App running at: {url}")
    print("  Press Ctrl+C in this window to stop.\n")
    webbrowser.open(url)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Verify index.html exists so we catch bad extractions early
    if not os.path.isfile(os.path.join(script_dir, "index.html")):
        print("\n  ERROR: index.html not found.")
        print(f"  Make sure all files are in: {script_dir}")
        print("  If you downloaded a ZIP, extract ALL files into one folder.\n")
        input("  Press Enter to exit...")
        sys.exit(1)

    port = find_free_port(PORT)
    handler = make_handler(script_dir)
    server = HTTPServer((HOST, port), handler)

    print("\n  ╔══════════════════════════════╗")
    print("  ║        HORA  Launcher        ║")
    print("  ╚══════════════════════════════╝")
    print(f"\n  Serving files from: {script_dir}")
    print(f"  Starting on port {port}...\n")

    timer = threading.Timer(0.8, open_browser, args=(port,))
    timer.start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        timer.cancel()
        print("\n  Server stopped. Goodbye!\n")
        server.shutdown()
        sys.exit(0)


if __name__ == "__main__":
    main()

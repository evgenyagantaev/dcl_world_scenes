import os
import json
from datetime import datetime
import asyncio
import websockets
import ssl
import pathlib
from dotenv import load_dotenv

# Load environment variables from the .env file (if exists)
load_dotenv()

class GuestBook:
    def __init__(self, data_folder: str):
        self.data_folder = data_folder
        self.entries_file = os.path.join(data_folder, "guestbook_entries.json")
        os.makedirs(data_folder, exist_ok=True)
        
        # Initialize entries from file or create empty list
        self.entries = self._load_entries()
    
    def _load_entries(self):
        if os.path.exists(self.entries_file):
            try:
                with open(self.entries_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print("Error loading entries, starting with empty guestbook")
                return []
        return []
    
    def _save_entries(self):
        with open(self.entries_file, "w", encoding="utf-8") as f:
            json.dump(self.entries, f, ensure_ascii=False, indent=2)
            f.flush()
            os.fsync(f.fileno())
    
    def get_entries(self, count=None):
        """Return all entries or the most recent 'count' entries"""
        if count is None:
            return self.entries
        return self.entries[-count:]
    
    def add_entry(self, name, message):
        """Add a new entry to the guest book"""
        entry = {
            "id": len(self.entries) + 1,
            "name": name,
            "message": message,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.entries.append(entry)
        self._save_entries()
        return entry

class GuestBookServer:
    def __init__(self, data_folder: str):
        self.data_folder = data_folder
        os.makedirs(self.data_folder, exist_ok=True)
        
        # Initialize guest book
        self.guest_book = GuestBook(data_folder)
    
    async def process_message(self, message: str):
        try:
            # Parse the incoming JSON message
            data = json.loads(message)
            command = data.get("command")
            
            if command == "get_entries":
                # Get entries, optionally limit by count
                count = data.get("count", None)
                entries = self.guest_book.get_entries(count)
                return json.dumps({
                    "status": "success",
                    "entries": entries
                }, ensure_ascii=False)
            
            elif command == "add_entry":
                # Add new entry
                name = data.get("name", "Anonymous")
                message_text = data.get("message", "")
                
                if not message_text:
                    return json.dumps({
                        "status": "error",
                        "message": "Message content cannot be empty"
                    })
                
                entry = self.guest_book.add_entry(name, message_text)
                return json.dumps({
                    "status": "success",
                    "entry": entry
                }, ensure_ascii=False)
            
            else:
                return json.dumps({
                    "status": "error",
                    "message": f"Unknown command: {command}"
                })
        
        except json.JSONDecodeError:
            return json.dumps({
                "status": "error",
                "message": "Invalid JSON format"
            })
        except Exception as e:
            return json.dumps({
                "status": "error",
                "message": f"Server error: {str(e)}"
            })

async def websocket_handler(websocket, server):
    try:
        async for message in websocket:
            # Log incoming message from client
            print(f"Incoming message: {message}")
            
            try:
                response = await server.process_message(message)
                # Log outgoing response message
                print(f"Outgoing message: {response}")
                await websocket.send(response)
            except Exception as e:
                error_message = json.dumps({
                    "status": "error",
                    "message": f"Error: {str(e)}"
                })
                # Log outgoing error message
                print(f"Outgoing message: {error_message}")
                await websocket.send(error_message)
    except websockets.exceptions.ConnectionClosed:
        pass

async def main():
    # Initialize the GuestBookServer instance
    data_folder = "guestbook_data"  # Folder to store guest book data
    server = GuestBookServer(data_folder)

    # Create SSL context with TLS server protocol
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(
        pathlib.Path("cert.pem"),
        keyfile=pathlib.Path("key.pem")
    )
    
    # Start WebSocket server with SSL
    async with websockets.serve(
            lambda ws: websocket_handler(ws, server),
            "0.0.0.0",
            37135,
            ssl=ssl_context
        ):
        print("GuestBook WebSocket server started on wss://0.0.0.0:37135")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main()) 
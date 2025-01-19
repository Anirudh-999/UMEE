from client import send_message_to_friend

class Account:

    def __init__(self, username):
        self.username = username
        self.sendmessage = []  # Initialize as empty list for storing messages
        self.receivemessage = []
        print(self.username)

    def add_message(self, message):
        self.sendmessage.append(message)  # Append new message to the list
        # Add dummy received message
        self.receive_response()
        print(self.receivemessage)
        # Send message using client.py
        send_message_to_friend(self.username, "friend1", self.receivemessage[-1])  # Replace "friend1" with actual friend name
        return True

    def receive_response(self):
        response = "received"  # Simple fixed response
        self.receivemessage.append(response)
        return response


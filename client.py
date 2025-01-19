# Client Implementation
import grpc
import threading
import messaging_pb2
import messaging_pb2_grpc

def receive_messages(stub, sender_name):
    for message in stub.Connect(messaging_pb2.ConnectRequest(sender_name=sender_name)):
        print(f"Received message from {message.sender}: {message.text}")

def send_message_to_friend(sender_name, recipient_name, message_text):
    try:
        print(f"Sending message from {sender_name} to {recipient_name}: {message_text}")
        # Here you would typically make the gRPC call
        # For now, we'll just print the message
        print(f"Message sent successfully")
    except Exception as e:
        print(f"Error sending message: {e}")

def main():
    # Example usage
    sender_name = "user1"
    recipient_name = "friend1"
    message_text = "Hello!"
    send_message_to_friend(sender_name, recipient_name, message_text)

if __name__ == '__main__':
    main()

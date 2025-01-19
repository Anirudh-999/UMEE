# Server Implementation
import grpc
from concurrent import futures
import messaging_pb2
import messaging_pb2_grpc

class MessagingService(messaging_pb2_grpc.MessagingServiceServicer):
    def __init__(self):
        self.clients = {}  # {sender_name: message_queue}

    def Connect(self, request, context):
        sender_name = request.sender_name
        if sender_name not in self.clients:
            self.clients[sender_name] = []
        print(f"{sender_name} connected.")

        while True:
            if context.is_active():
                if self.clients[sender_name]:
                    message = self.clients[sender_name].pop(0)
                    yield message

    def SendMessage(self, request, context):
        recipient = request.recipient
        sender = request.sender
        text = request.text

        if recipient in self.clients:
            message = messaging_pb2.Message(sender=sender, text=text)
            self.clients[recipient].append(message)
            print(f"Message from {sender} to {recipient}: {text}")
        else:
            print(f"Recipient {recipient} not connected.")
        return messaging_pb2.Empty()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    messaging_pb2_grpc.add_MessagingServiceServicer_to_server(MessagingService(), server)
    server.add_insecure_port('[::]:4041')
    print("gRPC Server started on port 4041.")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()

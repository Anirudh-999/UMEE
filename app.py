from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from account import Account
from collections import defaultdict
from queue import Queue

app = Flask(__name__)
app.secret_key = 'your-secret-key'

# Store user accounts
user_accounts = {}  # Dictionary to store Account objects

@app.route('/api/login', methods=['POST'])
def handle_login():
    data = request.json
    username = data.get('username')
    
    if username not in user_accounts:
        # Create new account if it doesn't exist
        user_accounts[username] = Account(username)
    
    session['username'] = username
    return jsonify({"status": "success"})

@app.route('/api/send', methods=['POST'])
def send_message():
    if 'username' not in session:
        return jsonify({"error": "Not logged in"}), 401
    
    data = request.json
    message = data.get('message', '')
    username = session['username']
    
    if username in user_accounts:
        # Use add_message method to append the message
        user_accounts[username].add_message(message)
        return jsonify({
            "status": "Message sent", 
            "content": message,
            "messages": user_accounts[username].sendmessage  # Return all messages
        })
    
    return jsonify({"error": "User not found"}), 404

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/friends')
def friends():
    return render_template('friends.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/explore')
def explore():
    return render_template('explore.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)

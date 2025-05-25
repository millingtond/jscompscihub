# conceptual_backend.py
# Requires Flask and Werkzeug: pip install Flask Werkzeug

import os
import random
from flask import Flask, request, jsonify, session # Added session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# IMPORTANT: Set a secret key for session management in a real app!
# You'd typically load this from an environment variable.
app.secret_key = os.urandom(24)

# --- Database Simulation (Replace with actual database interaction) ---
# In a real app, this data would be stored in a database (e.g., PostgreSQL, MySQL, MongoDB)
# Passwords should ALWAYS be stored hashed.
users_db = {
    "teacher@mgs.com": {
        "hashed_password": generate_password_hash("teacher_pass"), # Example password
        "role": "teacher",
        "classes": ["CS101"] # Example class managed by this teacher
    },
    "sunny_dolphin": {
        "hashed_password": generate_password_hash("student_pass1"), # Example password
        "role": "student",
        "class": "CS101"
    },
     "clever_badger": {
        "hashed_password": generate_password_hash("student_pass2"), # Example password
        "role": "student",
        "class": "CS101"
    }
}

classes_db = {
    "CS101": {
        "teacher": "teacher@mgs.com",
        "students": ["sunny_dolphin", "clever_badger"]
    }
}

# Simple word lists for username generation
adjectives = ["sunny", "clever", "brave", "quick", "happy", "bright", "gentle", "lucky", "proud", "calm"]
nouns = ["dolphin", "badger", "eagle", "tiger", "river", "mountain", "forest", "ocean", "meadow", "comet"]
# --- End Database Simulation ---

# --- Helper Functions ---
def generate_unique_username():
    """Generates a unique two-word username."""
    while True:
        adj = random.choice(adjectives)
        noun = random.choice(nouns)
        username = f"{adj}_{noun}"
        # Check if username already exists in our simulated DB
        if username not in users_db:
            return username

def generate_random_password(length=8):
    """Generates a random password."""
    # In a real app, ensure the password meets complexity requirements
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return "".join(random.choice(chars) for _ in range(length))

# --- API Endpoints ---

@app.route('/api/login', methods=['POST'])
def login():
    """Handles user login attempts."""
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"success": False, "message": "Missing username or password"}), 400

    username_or_email = data['username']
    password = data['password']

    user_data = users_db.get(username_or_email)

    if user_data and check_password_hash(user_data['hashed_password'], password):
        # Login successful
        # Store user info in session (simple session management)
        session['user_id'] = username_or_email
        session['role'] = user_data['role']
        print(f"Login successful for {username_or_email}, role: {user_data['role']}") # Server log
        return jsonify({
            "success": True,
            "message": "Login successful",
            "role": user_data['role']
        }), 200
    else:
        # Login failed
        print(f"Login failed for {username_or_email}") # Server log
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logs the user out by clearing the session."""
    session.pop('user_id', None)
    session.pop('role', None)
    return jsonify({"success": True, "message": "Logged out successfully"}), 200


@app.route('/api/teacher/create-class', methods=['POST'])
def create_class():
    """Allows authenticated teachers to create a new class."""
    # Check if user is logged in and is a teacher
    if 'user_id' not in session or session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    teacher_email = session['user_id']
    data = request.get_json()
    if not data or 'class_name' not in data:
        return jsonify({"success": False, "message": "Missing class name"}), 400

    class_name = data['class_name']

    # Basic validation (e.g., check if class name already exists)
    if class_name in classes_db:
         return jsonify({"success": False, "message": f"Class '{class_name}' already exists"}), 409

    # Add class to simulated DB
    classes_db[class_name] = {
        "teacher": teacher_email,
        "students": []
    }
    # Add class to teacher's list
    if 'classes' not in users_db[teacher_email]:
        users_db[teacher_email]['classes'] = []
    users_db[teacher_email]['classes'].append(class_name)

    print(f"Teacher {teacher_email} created class: {class_name}") # Server log
    return jsonify({"success": True, "message": f"Class '{class_name}' created successfully"}), 201


@app.route('/api/teacher/generate-students', methods=['POST'])
def generate_students():
    """Generates student accounts for a specific class."""
    # Check if user is logged in and is a teacher
    if 'user_id' not in session or session.get('role') != 'teacher':
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    teacher_email = session['user_id']
    data = request.get_json()
    if not data or 'class_name' not in data or 'num_students' not in data:
        return jsonify({"success": False, "message": "Missing class name or number of students"}), 400

    class_name = data['class_name']
    try:
        num_students = int(data['num_students'])
        if num_students <= 0 or num_students > 100: # Add reasonable limits
             raise ValueError("Invalid number of students")
    except ValueError:
        return jsonify({"success": False, "message": "Invalid number of students"}), 400

    # Check if the class exists and belongs to this teacher
    if class_name not in classes_db or classes_db[class_name]['teacher'] != teacher_email:
         return jsonify({"success": False, "message": f"Class '{class_name}' not found or not managed by you"}), 404

    generated_credentials = []
    for _ in range(num_students):
        student_username = generate_unique_username()
        student_password = generate_random_password()
        hashed_password = generate_password_hash(student_password)

        # Add student to simulated DB
        users_db[student_username] = {
            "hashed_password": hashed_password,
            "role": "student",
            "class": class_name
        }
        classes_db[class_name]['students'].append(student_username)

        # Store credentials to return to the teacher (DO NOT store plain passwords long-term)
        generated_credentials.append({
            "username": student_username,
            "password": student_password # Only return plain password upon creation
        })
        print(f"Generated student: {student_username} for class {class_name}") # Server log


    return jsonify({
        "success": True,
        "message": f"Generated {num_students} student accounts for class '{class_name}'",
        "credentials": generated_credentials
    }), 201


# Basic route to check login status (useful for frontend)
@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({
            "isLoggedIn": True,
            "userId": session['user_id'],
            "role": session.get('role', 'unknown')
        }), 200
    else:
        return jsonify({"isLoggedIn": False}), 200

# --- Run the App (for local testing) ---
if __name__ == '__main__':
    # Note: In production, use a proper WSGI server like Gunicorn or Waitress
    app.run(debug=True, port=5000) # Runs on http://127.0.0.1:5000

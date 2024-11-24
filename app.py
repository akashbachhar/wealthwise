import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import requests
from dotenv import load_dotenv
import os

if os.getenv("RENDER") is None:  # Load .env only in local development
    load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app)

# API Details
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")
USER_ID = os.getenv("USER_ID")
AGENT_ID = os.getenv("AGENT_ID")
SESSION_ID = os.getenv("SESSION_ID")
HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY
}


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    # Extract form data
    age = request.form.get('age')
    risk_tolerance = request.form.get('risk-tolerance')
    financial_goals = request.form.get('financial-goals')
    timeline = request.form.get('timeline')
    initial_investment = request.form.get('initial-investment')
    financial_standing = request.form.get('financial-standing')
    specific_stocks = request.form.get('specific-stocks')

    # Build custom AI prompt
    prompt = f"""
    I am a {age}-year-old individual with a risk tolerance classified as {risk_tolerance}.
    My financial goal is {financial_goals}, and I plan for a {timeline.replace('-', ' to ')} investment timeline.
    I have an initial investment amount of {initial_investment} INR.
    My current financial standing includes: {financial_standing}.
    Specific preferences or stocks I would like to include: {specific_stocks}.

    Can you create an investment strategy for me, considering current market trends?

    Extract and format the following investment recommendation into a structured JSON format. 
    No special formatting is required like ###,##,/n etc. Json should be in plain text. 
    Ensure the JSON contains:
    - Portfolio Allocation (percentages for equities, bonds, mutual funds, real estate, cash, and gold).
    - Specific recommendations (list of equities, bonds, mutual funds, real estate, and gold options, each with relevant details like CAGR, sector, or maturity).
    - Key market trends (summarized in bullet points).
    - Actionable steps (summarized as an array of steps).
    """

    # API Payload
    payload = {
        "user_id": USER_ID,
        "agent_id": AGENT_ID,
        "session_id": SESSION_ID,
        "message": prompt.strip()
    }

    try:
        # Make API Request
        response = requests.post(API_URL, headers=HEADERS, json=payload, verify=False)
        if response.status_code == 200:
            response_data = response.json()
            response_data["risk_tolerance"] = risk_tolerance
            response_data["financial_goals"] = financial_goals
            response_data["timeline"] = timeline
            response_data["initial_investment"] = initial_investment
            return jsonify(response_data)
        else:
            return jsonify({"error": "API request failed", "details": response.text}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "API request failed", "details": str(e)}), 500


@app.route('/result-page')
def result_page():
    return render_template('portfolio.html')


@socketio.on('send_message')
def handle_message(data):
    user_message = data.get("message", "")
    payload = {
        "user_id": USER_ID,
        "agent_id": AGENT_ID,
        "session_id": SESSION_ID,
        "message": user_message.strip()
    }

    try:
        # Make API Request
        response = requests.post(API_URL, headers=HEADERS, json=payload, verify=False)
        if response.status_code == 200:
            response_data = response.json()
            ai_message = response_data.get("response", "Sorry, no response.")
            emit('receive_message', {'message': ai_message, 'sender': 'ai'})
        else:
            emit('receive_message', {'message': 'API request failed.', 'sender': 'error'})
    except requests.exceptions.RequestException as e:
        emit('receive_message', {'message': str(e), 'sender': 'error'})


if __name__ == '__main__':
    socketio.run(app)

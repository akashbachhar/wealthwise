# WealthWise - Personalized Portfolio Strategy App

WealthWise is a Lyzr-based AI agent designed to help users strategize their investment portfolios. It provides interactive charts, dynamic recommendations, and chat support to enhance the financial planning experience.

## Tech Stack

**Client:** HTML, CSS, JavaScript

**Server:** Python, Flask, SocketIO

**API:** Lyzr, Perplexity 

  
## Run Locally

Create a new directory 
```bash
  mkdir wealthwise
```

Create a virtual environment

```bash
  sudo apt-get install python3-venv
  python3 -m venv env
```
Clone the project

```bash
  git clone https://github.com/akashbachhar/wealthwise.git
```

Activate the virtual environment

**Linux/Mac:**

```bash
  source env/bin/activate
```

**Windows:**

```bash
  .\Scripts\activate
```

Install the requirements

```bash
  cd wealthwise
  pip install -r requirements.txt
```

Create a .env file in the root directory with the following content:

```bash
  API_URL = your_secret_key
  API_KEY = your_secret_key
  USER_ID = your_secret_key
  AGENT_ID = your_secret_key
  SESSION_ID = your_secret_key
```

Run the Development Server 

```bash
  python app.py
```
Head to server http://127.0.0.1:5000

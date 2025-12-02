# Vidi.AI

A web-based chat interface to interact with Vidhi.ai **FastAPI backend** and a **React frontend**. Basically, this is a RAG-tuned AI model that can answer all questions regarding The Indian Constitution. This project supports **streaming responses** from Ollama and can be hosted on a personal Windows machine, accessible publicly.

---

## **Features**

- Stream responses from Ollama in real-time.
- Modern chat UI built with React.
- Fully CORS-enabled for frontend-backend communication.
- Can be deployed on a public IP without ngrok.
- Simple setup for Windows with FastAPI and Python.

---

## **Project Structure**

```
.
├── ollama_api.py          # FastAPI backend serving Ollama API & React frontend
├── frontend/              # React frontend
│   ├── public/
│   ├── src/
│   └── build/            # Production build after `npm run build`
├── requirements.txt      # Python dependencies
└── README.md
```

---

## **Prerequisites**

- **Windows machine** with Ollama installed and running locally.
- **Python 3.10+**
- **Node.js & npm** (for React frontend)
- **Internet access** if hosting publicly.

---

## **Setup**

### 1. Backend Setup

1. Create a Python virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\activate
```

2. Install dependencies:

```powershell
pip install fastapi uvicorn requests aiofiles
```

3. Make sure Ollama is running locally (default port `11434`).

---

### 2. React Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Build the frontend for production:

```bash
npm run build
```

> This generates the `frontend/build/` folder served by FastAPI.

---

### 3. Serve React via FastAPI

Modify your FastAPI app to serve the frontend:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend")
```

---

### 4. Run FastAPI Backend

Run FastAPI on port `8888`:

```powershell
uvicorn ollama_api:app --host 0.0.0.0 --port 8888 --reload
```

---

### 5. Firewall & Router Configuration

1. **Open Windows Firewall**:

   - Allow inbound TCP traffic on port `8888`.

2. **Router Port Forwarding**:

   - Forward **external port 8888** to your PC's local IP (e.g., `192.168.1.5`).

3. Access your frontend:

```
http://<PUBLIC_IP>:8888/
```

---

### 6. Update React API URLs

In `frontend/src/api/ollama.js`:

```javascript
const API_BASE = "http://<PUBLIC_IP>:8888"; // replace with your public IP
```

- Rebuild React:

```bash
npm run build
```

- Now the frontend communicates with the backend over your public IP.

---

## **Usage**

1. Visit your public URL:

```
http://<PUBLIC_IP>:8888/
```

2. Type a message and send it.
3. Responses are streamed in real-time from the Ollama model (`llama2-uncensored` by default).

---

## **Security Considerations**

- Anyone with access to the public IP can send requests to your backend.
- Recommended: Add **API key authentication** for `/generate_stream`.
- Use HTTPS (via Nginx/Caddy) if exposing to the internet.
- Keep Windows firewall and router passwords secure.

---

## **Dependencies**

**Python:**

- fastapi
- uvicorn
- requests
- aiofiles

**React:**

- react
- react-dom
- react-scripts

---

## **Optional Enhancements**

- Add multiple Ollama models in the frontend.
- Implement streaming updates in React (character-by-character).
- Add user authentication and API keys.
- Use Docker for easier deployment.
- Enable HTTPS via reverse proxy (recommended for public servers).

---

## **License**

Open-source project for personal or educational use.

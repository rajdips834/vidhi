from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests
import json
import os

from rag_pipeline import RAGPipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_HOST = "http://127.0.0.1:11434"

# Init RAG pipeline
rag = RAGPipeline()

# If first time, load dataset into Chroma
if not os.path.exists("./chroma_db"):
    os.makedirs("./chroma_db", exist_ok=True)
    rag.load_dataset("constitution_qa.jsonl")

# Path to frontend
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "ollama-chat", "dist")
FRONTEND_DIR = os.path.abspath(FRONTEND_DIR)

if os.path.exists(FRONTEND_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

@app.get("/")
async def serve_react():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "React build not found. Run `npm run build` in ollama-chat folder."}

@app.post("/generate_stream")
async def generate_stream(request: Request):
    body = await request.json()
    user_query = body.get("prompt", "")

    if not user_query.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        # Step 1: Get context from RAG
        retrieved = rag.retrieve(user_query, k=3)
        context = "\n".join(retrieved)

        system_prompt = f"""You are a legal assistant specialized in the Constitution of India.
Use the following retrieved context to answer the user's query:

Context:
{context}

Question:
{user_query}
If the question is not related to the Constitution of India, politely inform the user that you can only answer questions related to the Constitution of India.

Answer in a clear and legally accurate way. If the answer is not in the context, refer to external sources but only if the question is regarding legal matters .

"""

        # Step 2: Call Ollama API
        payload = {"model": "qwen3:latest", "prompt": system_prompt, "stream": True}
        resp = requests.post(f"{OLLAMA_HOST}/api/generate", json=payload, stream=True)

        def event_stream():
            buffer = b""
            for chunk in resp.iter_content(chunk_size=1024):
                if chunk:
                    buffer += chunk
                    lines = buffer.split(b"\n")
                    for line in lines[:-1]:
                        try:
                            data = json.loads(line.decode("utf-8"))
                            text = data.get("response")
                            if text:
                                yield text
                        except:
                            pass
                    buffer = lines[-1]

        return StreamingResponse(event_stream(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

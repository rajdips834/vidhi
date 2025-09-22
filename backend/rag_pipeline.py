import json
import os
from sentence_transformers import SentenceTransformer
import chromadb

class RAGPipeline:
    def __init__(self, db_path: str = "./chroma_db"):
        # Embedding model
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")

        # Persistent Chroma DB
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection("constitution")

    def load_dataset(self, dataset_path: str):
        """Load dataset and insert into ChromaDB (only once)."""
        if not os.path.exists(dataset_path):
            raise FileNotFoundError(f"{dataset_path} not found")

        with open(dataset_path, "r", encoding="utf-8") as f:
            data = [json.loads(line) for line in f]

        for i, d in enumerate(data):
            self.collection.add(
                ids=[str(i)],
                documents=[d["answer"]],
                metadatas=[{"question": d["question"]}],
                embeddings=self.embedder.encode([d["answer"]]).tolist(),
            )
        print(f"Loaded {len(data)} entries into ChromaDB.")

    def retrieve(self, query: str, k: int = 3):
        """Retrieve top-k documents for query."""
        results = self.collection.query(query_texts=[query], n_results=k)

        documents = []
        if results and "documents" in results:
            documents = results["documents"][0]

        return documents

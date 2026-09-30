import json
import math
import re
from collections import Counter
from pathlib import Path

TOKEN_RE = re.compile(r"[a-zA-Z0-9+#.-]+")


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_RE.findall(text)]


def build_documents(data: dict) -> list[dict[str, str]]:
    docs = []
    identity = data.get("identity", {})
    docs.append({
        "id": "identity",
        "title": "Identity and education",
        "text": (
            f"Name: {identity.get('name', '')}. "
            f"Education: {identity.get('education', '')}. "
            f"Current year: {identity.get('year', '')}. "
            f"Current focus: {', '.join(identity.get('current_focus', []))}."
        ),
    })

    skills = data.get("skills", {})
    levels = "; ".join(
        f"{name}: {level}" for name, level in skills.get("levels", {}).items()
    )
    docs.append({
        "id": "skills",
        "title": "Skills and learning",
        "text": (
            f"Strongest skill: {', '.join(skills.get('strongest', []))}. "
            f"Skill levels: {levels}. "
            f"Currently learning: {', '.join(skills.get('learning', []))}. "
            f"Future direction: {skills.get('future_direction', '')}."
        ),
    })

    for index, project in enumerate(data.get("projects", []), start=1):
        technologies = ", ".join(project.get("technologies", []))
        aliases = ", ".join(project.get("aliases", []))
        docs.append({
            "id": f"project-{index}",
            "title": project.get("name", f"Project {index}"),
            "text": (
                f"Project: {project.get('name', '')}. "
                f"Also known as: {aliases}. "
                f"Description: {project.get('description', '')}. "
                f"Technologies: {technologies}."
            ),
        })

    portfolio = data.get("portfolio", {})
    docs.append({
        "id": "portfolio",
        "title": "Portfolio and public links",
        "text": (
            f"Personal website and live portfolio: {portfolio.get('website', '')}. "
            f"GitHub repository: {portfolio.get('repository', '')}. "
            f"Portfolio features: {', '.join(portfolio.get('features', []))}."
        ),
    })

    interests = data.get("interests", {})
    docs.append({
        "id": "interests",
        "title": "Interests and working style",
        "text": (
            f"Outside technology, Aryan enjoys: {', '.join(interests.get('outside_technology', []))}. "
            f"Working style: {interests.get('working_style', '')}. "
            f"Motivation: {interests.get('motivation', '')}."
        ),
    })

    contact = data.get("contact", {})
    docs.append({
        "id": "contact",
        "title": "Contact links",
        "text": (
            f"Public email: {contact.get('email', '')}. "
            f"LinkedIn: {contact.get('linkedin', '')}. "
            f"GitHub profile: {contact.get('github', '')}. "
            f"Instagram: {contact.get('instagram', '')}."
        ),
    })

    personality = data.get("personality", {})
    docs.append({
        "id": "grounding",
        "title": "Personal agent grounding",
        "text": (
            f"Preferred tone: {personality.get('tone', '')}. "
            f"Grounding rule: {personality.get('grounding_rule', '')}"
        ),
    })
    return docs


class LocalHybridRetriever:
    def __init__(self, documents: list[dict[str, str]]):
        self.documents = documents
        self.tokenized = [tokenize(document["text"]) for document in documents]
        self.doc_frequency = Counter()
        for tokens in self.tokenized:
            self.doc_frequency.update(set(tokens))
        self.document_count = max(len(documents), 1)
        self.tfidf_vectors = [self._vector(tokens) for tokens in self.tokenized]
        self.norms = [self._norm(vector) for vector in self.tfidf_vectors]

    def _idf(self, token: str) -> float:
        return math.log(
            (1 + self.document_count) / (1 + self.doc_frequency.get(token, 0))
        ) + 1.0

    def _vector(self, tokens: list[str]) -> dict[str, float]:
        counts = Counter(tokens)
        total = max(len(tokens), 1)
        return {
            token: (count / total) * self._idf(token)
            for token, count in counts.items()
        }

    @staticmethod
    def _norm(vector: dict[str, float]) -> float:
        return math.sqrt(sum(value * value for value in vector.values()))

    @staticmethod
    def _cosine(a: dict[str, float], b: dict[str, float], b_norm: float) -> float:
        a_norm = math.sqrt(sum(value * value for value in a.values()))
        if not a_norm or not b_norm:
            return 0.0
        dot = sum(value * b.get(token, 0.0) for token, value in a.items())
        return dot / (a_norm * b_norm)

    def search(self, query: str, top_k: int = 3) -> list[dict]:
        query_tokens = tokenize(query)
        if not query_tokens:
            return []
        query_vector = self._vector(query_tokens)
        query_set = set(query_tokens)
        phrase = " ".join(query_tokens)
        results = []
        for index, document in enumerate(self.documents):
            doc_tokens = self.tokenized[index]
            doc_set = set(doc_tokens)
            lexical = len(query_set & doc_set) / max(len(query_set), 1)
            cosine = self._cosine(
                query_vector, self.tfidf_vectors[index], self.norms[index]
            )
            exact_phrase = 1.0 if phrase and phrase in document["text"].lower() else 0.0
            score = (0.55 * cosine) + (0.35 * lexical) + (0.10 * exact_phrase)
            if score > 0:
                results.append({
                    "score": round(score, 4),
                    "id": document["id"],
                    "title": document["title"],
                    "text": document["text"],
                })
        return sorted(results, key=lambda item: item["score"], reverse=True)[:top_k]

    def context(self, query: str, top_k: int = 3) -> tuple[str, list[dict]]:
        results = self.search(query, top_k=top_k)
        context = "\n\n".join(
            f"[{item['title']}] {item['text']}" for item in results
        )
        return context, results


def load_retriever(path: Path) -> LocalHybridRetriever:
    with open(path, "r", encoding="utf-8") as file:
        return LocalHybridRetriever(build_documents(json.load(file)))

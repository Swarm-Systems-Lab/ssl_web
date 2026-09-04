"""Creates a Markdown file in content/ from the "Add a post" workflow form."""

import json
import os
import re
import sys
import unicodedata
from datetime import date


def slugify(text: str, words: int = 8) -> str:
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    parts = [p for p in re.split(r"[^a-zA-Z0-9]+", ascii_text.lower()) if p]
    return "-".join(parts[:words]) or "post"


kind = os.environ["KIND"]
title = os.environ["TITLE"].strip()
summary = os.environ["SUMMARY"].strip()
body = os.environ["BODY"].replace("\\n", "\n").strip()
when = os.environ.get("DATE", "").strip() or date.today().isoformat()

if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", when):
    sys.exit(f"Date must look like YYYY-MM-DD, got {when!r}")

if kind == "news":
    path = f"content/news/{when}-{slugify(title)}.md"
    front = f"title: {json.dumps(title, ensure_ascii=False)}\ndate: {when}\n"
else:
    path = f"content/research/{slugify(title)}.md"
    front = f"title: {json.dumps(title, ensure_ascii=False)}\norder: 50\n"

if os.path.exists(path):
    sys.exit(f"{path} already exists — pick a different title or date.")

front += f"summary: {json.dumps(summary, ensure_ascii=False)}\n"
with open(path, "w", encoding="utf-8") as handle:
    handle.write(f"---\n{front}---\n\n{body}\n")

print(f"path={path}")

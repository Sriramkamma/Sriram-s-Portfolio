import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const EMBEDDING_MODEL = "nvidia/nemotron-3-embed-1b:free";

const KNOWLEDGE_DIR = path.join(
  process.cwd(),
  "api",
  "knowledge"
);

const files = [
  "profile.md",
  "experience.md",
  "skills.md",
  "education.md",
  "certifications.md",
  "projects.md",
];

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing.");
}

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is missing.");
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_SECRET_KEY is missing.");
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY
);

function createChunks(text, source) {
  const sections = text
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.map((content) => ({
    content,
    source,
  }));
}

async function loadKnowledge() {
  const chunks = [];

  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const text = await fs.readFile(filePath, "utf8");

    chunks.push(...createChunks(text, file));
  }

  return chunks;
}

async function createEmbeddings(texts) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/embeddings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: texts,
        encoding_format: "float",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter embedding error:", data);
    throw new Error(
      `Embedding request failed with status ${response.status}`
    );
  }

  return data.data;
}

async function main() {
  console.log("Loading knowledge base...");

  const chunks = await loadKnowledge();

  console.log(`Found ${chunks.length} knowledge chunks.`);

  if (chunks.length === 0) {
    throw new Error("No knowledge chunks found.");
  }

  console.log("Creating embeddings...");

  const embeddingResults = await createEmbeddings(
    chunks.map((chunk) => chunk.content)
  );

  console.log(
    `Received ${embeddingResults.length} embeddings.`
  );

  const rows = chunks.map((chunk, index) => ({
    content: chunk.content,
    source: chunk.source,
    embedding: embeddingResults[index].embedding,
  }));

  console.log("Clearing existing documents...");

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .not("id", "is", null);

  if (deleteError) {
    throw deleteError;
  }

  console.log("Saving documents to Supabase...");

  const { error: insertError } = await supabase
    .from("documents")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }

  console.log("=================================");
  console.log("Knowledge base indexed successfully.");
  console.log(`Documents inserted: ${rows.length}`);
  console.log("=================================");
}

main().catch((error) => {
  console.error("Indexing failed:");
  console.error(error);
  process.exit(1);
});
from db import DBHandler
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv
from db import FORMS_TABLE
from models.form_schema import FormField, FormSchema, Keyword, SelectValue
from parser.report_types import KeyValueWithMeta


load_dotenv()
client = OpenAI()
# Function to create embeddings
def create_embedding(text):
  text = text.replace("\n", " ")
  return client.embeddings.create(input = [text], model="text-embedding-3-large").data[0].embedding

def join_dict_value(dictvalues: list[Keyword | SelectValue]) -> str:
    return ', '.join([keyword["value"] for keyword in dictvalues])

def create_description(row):
    title = row["title"]
    keywords = join_dict_value(row["keywords"])
    return f"{title},{keywords}"


def create_form_embeddings(db: DBHandler, form_schema: FormSchema, form_id: str):
    fields = db.cursor.execute("SELECT COUNT(*) FROM Forms.ClinicalForm WHERE form_id = ?", [form_id])
    count = db.cursor.fetchone()[0]
    if count > 0:
      print("Form already exists")
      return
    print("Form does not exist, creating embeddings")
    result = []
    for field in form_schema["formFields"]:
       for keyword in field["keywords"]:
          result.append({
              "title": field["title"],
              "embedding": create_embedding(f"{keyword['value']}")
          })

    sql = f"INSERT INTO {FORMS_TABLE} (title, field_vector, form_id) VALUES (?, TO_VECTOR(?), ?)"
    params = [(row['title'], str(row['embedding']),form_id) for row in result]
    db.cursor.executemany(sql, params)


def search(db: DBHandler, field: KeyValueWithMeta, form_id: str):
    # Create a description string
    description = f"{field['original_tag']}"

    field_embedding = create_embedding(description)

    sql = f"""
      SELECT TOP ? title, VECTOR_COSINE(field_vector, TO_VECTOR(?)) as score
      FROM {FORMS_TABLE}
      WHERE form_id = ?
      ORDER BY score DESC
    """
    db.cursor.execute(sql, [1, str(field_embedding), form_id])
    return db.cursor.fetchall()

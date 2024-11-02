from db import DBHandler
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv
from db import FORMS_TABLE

load_dotenv()
client = OpenAI()
# Function to create embeddings
def create_embedding(text):
  text = text.replace("\n", " ")
  return client.embeddings.create(input = [text], model="text-embedding-3-large").data[0].embedding


def create_form_embeddings(db: DBHandler, form_schema, form_id):
    df = pd.DataFrame(form_schema["formFields"])
    df['description'] = df.apply(
      lambda row: f"Title of the field: {row['title']}\nUnit: {row['unit']}\nType: {row['type']}\nKeywords: {', '.join(row['keywords'])}\n", 
      axis=1
    )

    df['embedding'] = df['description'].apply(create_embedding)

    sql = f"INSERT INTO {FORMS_TABLE} (title, field_vector, unit, type, keywords, form_id) VALUES (?, TO_VECTOR(?), ?, ?, ?, ?)"
    params = [(row['title'], str(row['embedding']), row['unit'], row['type'], ','.join(row['keywords']), form_id) for index, row in df.iterrows()]

    db.cursor.executemany(sql, params)

def search(db: DBHandler, field, form_id: str):
    # Create a description string
    description = f"Title of the field: {field['key']}\nUnit: {field['unit']}\nType: {field['type']}\nKeywords: {field['original_tag']}\n"

    field_embedding = create_embedding(description)

    sql = f"""
      SELECT TOP ? title, unit, type, keywords, VECTOR_DOT_PRODUCT(field_vector, TO_VECTOR(?)) as score
      FROM {FORMS_TABLE}
      WHERE form_id = ?
      ORDER BY score DESC
    """

    return db.cursor.execute(sql, [1, str(field_embedding), form_id]).fetchall()

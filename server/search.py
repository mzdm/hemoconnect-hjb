from db import DBHandler
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv
from db import FORMS_TABLE
from models.form_schema import FormField, FormSchema, Keyword, SelectValue


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
    unit = row["unit"]
    type = row["type"]
    keywords = join_dict_value(row["keywords"])
    select_values = join_dict_value(row["selectValues"])
    return f"""
              Title: {title}
              Unit: {unit}
              Type: {type}
              Keywords: {keywords}
              {"Select values"+select_values if len(select_values) > 0 else ''}
            """


def create_form_embeddings(db: DBHandler, form_schema: FormSchema, form_id: str):
    # SQL injection go BRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    existing_fields = db.cursor.execute("SELECT * FROM Forms.ClinicalForm WHERE form_id = 'a5ff4954-9faa-41b8-badb-756428a8a672';")
    print("existing fields", existing_fields)
    if True:
      print("nothing found")
      return
    
    df = pd.DataFrame(form_schema["formFields"])

    df['description'] = df.apply(create_description,axis=1)
    df['embedding'] = df['description'].apply(create_embedding)

    sql = f"INSERT INTO {FORMS_TABLE} (title, field_vector, unit, type, keywords, form_id) VALUES (?, TO_VECTOR(?), ?, ?, ?, ?)"
    params = [(row['title'], str(row['embedding']), row['unit'], row['type'], ', '.join([keyword["value"] for keyword in row['keywords']]), form_id) for index, row in df.iterrows()]
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

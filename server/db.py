import iris
import os

FORMS_TABLE = 'Forms.ClinicalForm'

class DBHandler:
    def __init__(self):
        self.conn: iris.IRISConnection = None
        self.cursor = None

    def connect(self):
        try:
            username = 'hackjakbrno'
            password = 'heslohovnokleslo'
            hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
            port = '1972' 
            namespace = 'USER'
            CONNECTION_STRING = f"{hostname}:{port}/{namespace}"
            self.conn = iris.connect(CONNECTION_STRING, username, password)
            self.cursor = self.conn.cursor()
        except Exception as e:
            print(f"Failed to connect to IRIS: {e}")
            raise

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()

    def migrate(self):
        """Create necessary tables if they don't exist"""
        try:
            self.cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {FORMS_TABLE} (
                  title VARCHAR(255),
                  field_vector VECTOR(DOUBLE, 3072),
                  unit VARCHAR(255),
                  type VARCHAR(255),
                  keywords VARCHAR(1023),
                  form_id VARCHAR(255)
                )
            """)
            self.conn.commit()
        except Exception as e:
            print(f"Migration failed: {e}")
            self.conn.rollback()
            raise

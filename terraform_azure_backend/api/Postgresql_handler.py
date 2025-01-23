import psycopg2
from psycopg2 import OperationalError, sql 
from datetime import datetime

class PostgresqlHandler:

    def __init__(self):
        self.conn = self.create_connection()

    def create_connection(self):
        try:
            conn = psycopg2.connect(
                host = 'terraform-generated-resource-groups.postgres.database.azure.com',
                user = 'Terraform_Azure_ADMIN',
                password = '@zurePassword',
                port = '5432',
                database = 'postgres',
                sslmode='require'  # Required for Azure
            )
            return conn
        except OperationalError as e:
            print(f"Connection error: {e}")
            return None

    def create_table(self, conn = None):
        if conn == None:
            conn = self.conn

        create_table_query = """
        CREATE TABLE IF NOT EXISTS records (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            enviroment VARCHAR(100) NOT NULL,
            source VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        """
        try:
            cursor = self.conn.cursor()
            cursor.execute(create_table_query)
            conn.commit()
            print("Table created successfully!")
        except Exception as e:
            print(f"Error creating table: {e}")

    def insert_sample_data(self, data = None, conn = None):
        if conn == None:
            conn = self.conn

        insert_query = """
        INSERT INTO records (name, enviroment, source, email)
        VALUES (%s, %s, %s, %s)
        """
        if data == None:
            return {"status": "error", "message": "No data provided"}
        else:
            data = [tuple(data[i] for i in data)]

        try:
            cursor = conn.cursor()
            cursor.executemany(insert_query, data)
            conn.commit()
            print(f"Inserted {cursor.rowcount} records successfully!")
            return {"status": "success", "message": f"Inserted {cursor.rowcount} records successfully!"}
        except Exception as e:
            print(f"Error inserting data: {e}")

    def fetch_data(self, conn = None):
        if conn == None:
            conn = self.conn

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, enviroment, source, email, timestamp FROM records")
            records = cursor.fetchall()
            print("\nCurrent records:")

            ans = []
            for row in records:
                ans.append({
                    "name": row[1],
                    "environment": row[2],
                    "source": row[3],
                    "owner": row[4]
                })
            print(ans)
            return ans
        except Exception as e:
            print(f"Error fetching data: {e}")

    def truncate_table(self, conn = None, table_name='records'):
        if conn == None:
            conn = self.conn
        try:
            cursor = conn.cursor()
            # Use RESTART IDENTITY to reset auto-increment counters
            cursor.execute(sql.SQL("TRUNCATE TABLE {} RESTART IDENTITY").format(
                sql.Identifier(table_name))
            )
            conn.commit()
            print(f"Table '{table_name}' truncated successfully")
            
        except Exception as e:
            print(f"Error truncating table: {e}")
            conn.rollback()
        finally:
            if 'cursor' in locals():
                cursor.close()


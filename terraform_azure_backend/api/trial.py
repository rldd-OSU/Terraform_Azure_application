# to clear the table
from Postgresql_handler import PostgresqlHandler
database_handler = PostgresqlHandler()
print(database_handler.fetch_data())
# database_handler.truncate_table()
# print(database_handler.fetch_data())
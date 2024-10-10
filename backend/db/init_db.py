import sqlite3

def connect():
    try:
        conn = sqlite3.connect('db/to-do-Database.db')
        print("Connection successful")
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None
    
def create_tables(conn):
    if conn is None:
        print("No connection to the database.")
        return

    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS work (
            description TEXT PRIMARY KEY,
            dateAdded DATE NOT NULL,
            finished INTEGER NOT NULL DEFAULT 1
        );   
    ''')

def view_tables():
    conn = sqlite3.connect('to-do-Database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", tables)
    conn.close()

if __name__ == '__main__':
    connection = connect()
    create_tables(connection)
    view_tables()
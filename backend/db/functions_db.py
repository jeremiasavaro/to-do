import sqlite3
from datetime import datetime

def connect():
    try:
        conn = sqlite3.connect('db/to-do-Database.db')
        
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None
    

def insert_work(description):
    conn = connect()
    cursor = conn.cursor()

    today = datetime.today().date()

    cursor.execute("""INSERT INTO work(description, dateAdded, finished) VALUES(?,?,?)""",
                   (description, today, 1))
    
    conn.commit()
    conn.close()

def get_works():
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""SELECT * FROM work ORDER BY dateAdded DESC""")
    works_data = cursor.fetchall()
    
    conn.close()

    return works_data


def update_work_status(description):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""SELECT finished FROM work WHERE description = ?""", (description,))
    current_status = cursor.fetchone()

    if current_status is not None:
        new_status = 1 if current_status[0] == 0 else 0
        cursor.execute("""UPDATE work SET finished = ? WHERE description = ?""", (new_status, description))

    conn.commit()
    conn.close()

def delete_work(description):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM work WHERE description = ?", (description,))
    
    conn.commit()
    conn.close()

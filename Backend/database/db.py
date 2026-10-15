import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join("database", "healthcare.db")


def init_db():
    os.makedirs("database", exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_input TEXT,
            rule_primary TEXT,
            rule_secondary TEXT,
            rule_tertiary TEXT,
            ml_prediction TEXT,
            ml_confidence REAL,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_prediction(user_input, rule_primary, rule_secondary,
                    rule_tertiary, ml_prediction, ml_confidence):

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO predictions (
            user_input,
            rule_primary,
            rule_secondary,
            rule_tertiary,
            ml_prediction,
            ml_confidence,
            timestamp
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_input,
        rule_primary,
        rule_secondary,
        rule_tertiary,
        ml_prediction,
        ml_confidence,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()
    conn.close()

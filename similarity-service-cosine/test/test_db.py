from pytest_postgresql import factories
from pathlib import Path

new_postgresql = factories.postgresql_proc()
database = factories.postgresql("new_postgresql", dbname="massbank3", load=[Path("2024.06-testdb.sql")])


def test_postgres_docker(database):
    """Run test."""
    cur = database.cursor()
    #cur.execute("CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
    #database.commit()
    cur.close()

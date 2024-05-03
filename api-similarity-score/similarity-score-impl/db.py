import psycopg

from matchms import set_matchms_logger_level, Spectrum
import numpy as np

# TODO: Move either consts or postgresql url to env file
DB_PORT = 5432
DB_USER = "massbank3"
DB_PASSWORD = "massbank3password"
DB_NAME = "massbank3"
DB_HOST = "localhost"

spectra = []

# Load all (non-deprecated) spectra from the database for faster lookup
def load_spectra():
    global spectra
    
    spectra = []

    # Prevent matchms from complaining about spectra not having a precursor_mz
    set_matchms_logger_level("ERROR")

    with psycopg.connect(f"postgresql://{DB_NAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}") as conn:
        with conn.cursor() as cur:
            cur.execute("select document->'accession', document->'peak' from massbank where document->>'deprecated' is null;")

            for spectrum in cur:
                id = spectrum[0]
                peak = spectrum[1]["peak"]

                mz = peak["mz"]
                intensities = peak["rel"]

                spectra += [Spectrum(mz=np.array(mz).astype(float), intensities=np.array(intensities).astype(float), metadata={"id": id})]

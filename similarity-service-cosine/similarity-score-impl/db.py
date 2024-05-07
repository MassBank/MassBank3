import os
import psycopg
from matchms import set_matchms_logger_level, Spectrum
import numpy as np

DB_PORT = os.environ.get('DB_PORT', 5432)
DB_USER = os.environ.get('DB_USER', "massbank3")
DB_PASSWORD = os.environ.get('DB_PASSWORD', "massbank3password")
DB_HOST = os.environ.get('DB_HOST', "localhost")
DB_NAME = os.environ.get('DB_NAME', "massbank3")
spectra = []


# Load all (non-deprecated) spectra from the database for faster lookup
def load_spectra():
    global spectra

    spectra = []

    # Prevent matchms from complaining about spectra not having a precursor_mz
    set_matchms_logger_level("ERROR")

    with psycopg.connect(f"postgresql://{DB_NAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}") as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select document->'accession', document->'peak' from massbank where document->>'deprecated' is null;")

            for spectrum in cur:
                accession = spectrum[0]
                peak = spectrum[1]["peak"]

                mz = peak["mz"]
                intensities = peak["rel"]

                #metadata key "accession" gets silently converted to spectrum_id, so we can use spectrum_id right away
                spectra += [Spectrum(mz=np.array(mz).astype(float), intensities=np.array(intensities).astype(float),
                                     metadata={'spectrum_id': accession})]

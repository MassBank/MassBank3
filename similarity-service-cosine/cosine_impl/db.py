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
                "SELECT massbank.accession as accession, peak.mz as mz, peak.intensity as intensity, peak.relative_intensity as rel FROM massbank JOIN spectrum ON massbank.id = spectrum.massbank_id JOIN peak ON spectrum.id = peak.spectrum_id ORDER BY massbank.id, peak.mz;"
            )

            entries = {}
            for res in cur:
                accession = res[0]
                if accession in entries:
                    entries[accession]["mz"].append(res[1])
                    entries[accession]["intensity"].append(res[2])
                    entries[accession]["rel"].append(res[3])
                else:
                    entries[accession] = {"mz": [res[1]], "intensity": [res[2]], "rel": [res[3]]}

            for accession in entries:
                    mz = []
                    intensities = []
                    for key in entries[accession]:
                        prop = entries[accession][key]
                        if key == "mz":
                            mz = prop
                        elif key == "rel":
                            intensities = prop
                         
                    if len(mz) > 0 and len(intensities) > 0 and len(mz) == len(intensities):    
                        #metadata key "accession" gets silently converted to spectrum_id, so we can use spectrum_id right away
                        spectra.append(Spectrum(mz=np.array(mz).astype(float), intensities=np.array(intensities).astype(float),
                                        metadata={'spectrum_id': accession}))
    
    print(f"\nLoaded {len(spectra)} spectra from the database")
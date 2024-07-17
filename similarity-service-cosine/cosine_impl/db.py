from matchms import set_matchms_logger_level, Spectrum
import numpy as np
from datetime import datetime
import logging


class ReferenceSpectra:
    """This class loads all reference spectra from the database"""
    timestamp = datetime.fromisoformat('2010-01-01')
    spectra = []

    def __init__(self, connection):
        """initialize the class with a database connection"""
        self.connection = connection

    def load_spectra(self):
        """load all spectra from the database if the metadata indicates newer data and stores them"""
        with self.connection.cursor() as cur:
            cur.execute("select * from metadata;")
            timestamp = cur.fetchone()[2]
        logging.info("Database timestamp: %s", timestamp)
        logging.info("In-memory timestamp: %s", ReferenceSpectra.timestamp)
        timestamp_diff = timestamp - ReferenceSpectra.timestamp
        if timestamp_diff.total_seconds() > 0:
            logging.info("Database timestamp is %s newer. Reloading...", timestamp_diff)

            # Prevent matchms from complaining about spectra not having a precursor_mz
            set_matchms_logger_level("ERROR")

            with self.connection.cursor() as cur:
                cur.execute(
                    "SELECT massbank.accession as accession, peak.mz as mz, peak.intensity as intensity, "
                    "peak.relative_intensity as rel FROM massbank JOIN spectrum ON massbank.id = spectrum.massbank_id "
                    "JOIN peak ON spectrum.id = peak.spectrum_id ORDER BY massbank.id, peak.mz;"
                )

                entries = {}
                ReferenceSpectra.spectra = []

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

                    if 0 < len(mz) == len(intensities):
                        # metadata key "accession" gets silently converted to spectrum_id, so we can use spectrum_id
                        # right away
                        ReferenceSpectra.spectra.append(
                            Spectrum(mz=np.array(mz).astype(float), intensities=np.array(intensities).astype(float),
                                     metadata={'spectrum_id': accession}))
                    else:
                        logging.warning("Empty spectrum or error in spectrum")

                logging.info("Loaded %s spectra from the database.", len(ReferenceSpectra.spectra))
                ReferenceSpectra.timestamp = timestamp


# import os
# import psycopg
#
# if __name__ == '__main__':
#     DB_PORT = os.environ.get('DB_PORT', 5432)
#     DB_USER = os.environ.get('DB_USER', "massbank3")
#     DB_PASSWORD = os.environ.get('DB_PASSWORD', "massbank3password")
#     DB_HOST = os.environ.get('DB_HOST', "localhost")
#     DB_NAME = os.environ.get('DB_NAME', "massbank3")
#
#     logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
#     myspec = ReferenceSpectra(psycopg.connect(f"postgresql://{DB_NAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"))
#     print(len(ReferenceSpectra.spectra))
#     myspec.load_spectra
#     print(len(ReferenceSpectra.spectra))
#     myspec.load_spectra
#     print(len(ReferenceSpectra.spectra))

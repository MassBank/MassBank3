import logging
import os
from datetime import datetime

import connexion
import numpy
import psycopg
from psycopg_pool import ConnectionPool
from flask import jsonify
from matchms import calculate_scores, set_matchms_logger_level, Spectrum
from matchms.filtering import normalize_intensities
from matchms.similarity import CosineGreedy

from openapi_server.models import SimilarityScore
from openapi_server.models.similarity_calculation import SimilarityCalculation  # noqa: E501
from openapi_server.models.similarity_score_list import SimilarityScoreList  # noqa: E501

# Environment variables for database connection
DB_PORT = os.environ.get('DB_PORT', 5432)
DB_USER = os.environ.get('DB_USER', "massbank3")
DB_PASSWORD = os.environ.get('DB_PASSWORD', "massbank3password")
DB_HOST = os.environ.get('DB_HOST', "localhost")
DB_NAME = os.environ.get('DB_NAME', "massbank3")

# Global variables for in-memory data
timestamp = datetime.fromisoformat('2010-01-01')
spectra = []

# Initialize the connection pool globally
pool = ConnectionPool(conninfo=f"postgresql://{DB_NAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}", open=False)


def load_spectra():  # noqa: E501
    """load all spectra from the database if the metadata indicates newer data and stores them"""
    global timestamp, spectra
    pool.open()
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM metadata;")
            dbtimestamp = cur.fetchone()[2]
        logging.info("Database timestamp: %s", dbtimestamp)
        logging.info("In-memory timestamp: %s", timestamp)
        timestamp_diff = dbtimestamp - timestamp
        if timestamp_diff.total_seconds() > 0:
            logging.info("Database timestamp is %s newer. Reloading...", timestamp_diff)

            # Prevent matchms from complaining about spectra not having a precursor_mz
            set_matchms_logger_level("ERROR")

            with conn.cursor() as cur:
                cur = conn.cursor()
                cur.execute(
                    "SELECT massbank.accession, peak.mz, peak.intensity "
                    "FROM massbank "
                    "JOIN spectrum ON massbank.id = spectrum.massbank_id "
                    "JOIN peak ON spectrum.id = peak.spectrum_id "
                    "ORDER BY massbank.id, peak.mz;"
                )

                entries = {}
                spectra = []

                for res in cur:
                    accession, mz, intensity = res
                    if accession not in entries:
                        entries[accession] = {"mz": [], "intensity": []}
                    entries[accession]["mz"].append(mz)
                    entries[accession]["intensity"].append(intensity)

                for accession, data in entries.items():
                    spectra.append(
                        normalize_intensities(Spectrum(mz=numpy.array(data["mz"]).astype(float),
                                                       intensities=numpy.array(data["intensity"]).astype(float),
                                                       metadata={'spectrum_id': accession})))

                logging.info("Loaded %s spectra from the database.", len(spectra))
                timestamp = dbtimestamp


def similarity_post(similarity_calculation):  # noqa: E501
    """Create a new similarity calculation.

     # noqa: E501

    :param similarity_calculation: a similarity job
    :type similarity_calculation: dict | bytes

    :rtype: Union[SimilarityScoreList, Tuple[SimilarityScoreList, int], Tuple[SimilarityScoreList, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        request = SimilarityCalculation.from_dict(similarity_calculation)

        try:
            load_spectra()
        except psycopg.DatabaseError as e:
            return connexion.problem(
                title="Database Error",
                detail=str(e),
                status=500,
            )

        mz, intensities = zip(*[(peak.mz, peak.intensity) for peak in request.peak_list])

        try:
            query = normalize_intensities(Spectrum(mz=numpy.array(mz), intensities=numpy.array(intensities)))
        except AssertionError as e:
            return connexion.problem(
                title="AssertionError",
                detail=str(e),
                status=400,
            )

        references = spectra
        if request.reference_spectra_list:
            references = [s for s in references if s.metadata['spectrum_id'] in request.reference_spectra_list]

        scores = calculate_scores(references, [query], CosineGreedy())
        matches = scores.scores_by_query(query, 'CosineGreedy_score', sort=True)
        match_list = SimilarityScoreList(
            [SimilarityScore(match[0].metadata['spectrum_id'], match[1][0]) for match in matches])

        return match_list


def version_get():  # noqa: E501
    """Get the version string of the implementation.

     # noqa: E501


    :rtype: Union[str, Tuple[str, int], Tuple[str, int, Dict[str, str]]
    """
    return 'cosine similarity 1.0.0'


def handle_psycopg_database_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

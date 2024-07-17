import connexion
import numpy as np
from connexion import problem
from flask import jsonify, Flask
from matchms import Spectrum, calculate_scores
from matchms.similarity import CosineGreedy

from cosine_impl.db import ReferenceSpectra
from openapi_server.models import SimilarityScore
from openapi_server.models.similarity_calculation import SimilarityCalculation  # noqa: E501
from openapi_server.models.similarity_score_list import SimilarityScoreList  # noqa: E501

import os
import psycopg

DB_PORT = os.environ.get('DB_PORT', 5432)
DB_USER = os.environ.get('DB_USER', "massbank3")
DB_PASSWORD = os.environ.get('DB_PASSWORD', "massbank3password")
DB_HOST = os.environ.get('DB_HOST', "localhost")
DB_NAME = os.environ.get('DB_NAME', "massbank3")

app = Flask(__name__)

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
            reference_spectra = ReferenceSpectra(
                psycopg.connect(f"postgresql://{DB_NAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"))
            reference_spectra.load_spectra()
        except psycopg.DatabaseError as e:
            return problem(
                title="Database Error",
                detail=str(e),
                status=500,
            )

        mz = []
        intensities = []

        for peak in request.peak_list:
            mz.append(peak.mz)
            intensities.append(peak.intensity)

        query = Spectrum(mz=np.array(mz), intensities=np.array(intensities))

        if len(request.reference_spectra_list) > 0:
            def filter_fn(spectrum):
                return spectrum.metadata['spectrum_id'] in request.reference_spectra_list

            references = list(filter(filter_fn, ReferenceSpectra.spectra))

            scores = calculate_scores(references, [query], CosineGreedy())
        else:
            scores = calculate_scores(ReferenceSpectra.spectra, [query], CosineGreedy())
        matches = scores.scores_by_query(query, 'CosineGreedy_score', sort=True)
        match_list = SimilarityScoreList([])

        for match in matches:
            match_list.similarity_score_list.append(SimilarityScore(match[0].metadata['spectrum_id'], match[1][0]))

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

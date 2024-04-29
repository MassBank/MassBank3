import connexion
from typing import Dict
from typing import Tuple
from typing import Union

from openapi_server.models.similarity_post_request import SimilarityPostRequest  # noqa: E501
from openapi_server.models.similarity_score_list_inner import SimilarityScoreListInner  # noqa: E501
from openapi_server import util


def similarity_post(similarity_post_request):  # noqa: E501
    """Create a new similarity calculation.

     # noqa: E501

    :param similarity_post_request: a similarity job
    :type similarity_post_request: dict | bytes

    :rtype: Union[List[SimilarityScoreListInner], Tuple[List[SimilarityScoreListInner], int], Tuple[List[SimilarityScoreListInner], int, Dict[str, str]]
    """
    if connexion.request.is_json:
        similarity_post_request = SimilarityPostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def version_get():  # noqa: E501
    """Get the version string of the implementation.

     # noqa: E501


    :rtype: Union[str, Tuple[str, int], Tuple[str, int, Dict[str, str]]
    """
    return 'do some magic magic!'

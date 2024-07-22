import unittest

from flask import json

from openapi_server.models import Peak
from openapi_server.models.error import Error  # noqa: E501
from openapi_server.models.similarity_calculation import SimilarityCalculation  # noqa: E501
from openapi_server.models.similarity_score_list import SimilarityScoreList  # noqa: E501
from openapi_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_similarity_post(self):
        """Test case for similarity_post

        Create a new similarity calculation.
        """
        similarity_calculation = SimilarityCalculation(peak_list=[Peak(mz=147.063, intensity=121.684),
                                                                  Peak(mz=303.050, intensity=10000.000),
                                                                  Peak(mz=449.108, intensity=657.368),
                                                                  Peak(mz=465.102, intensity=5884.210),
                                                                  Peak(mz=611.161, intensity=6700.000)],
                                                       reference_spectra_list=["MSBNK-IPB_Halle-PB001341",
                                                                               "MSBNK-IPB_Halle-PB001342",
                                                                               "MSBNK-IPB_Halle-PB001343",
                                                                               "MSBNK-IPB_Halle-PB006202",
                                                                               "MSBNK-IPB_Halle-PB006203"])

        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/similarity',
            method='POST',
            headers=headers,
            data=json.dumps(similarity_calculation),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))
        assert equal(response.json, SimilarityScoreList)
        print(response.json)

    def test_version_get(self):
        """Test case for version_get

        Get the version string of the implementation.
        """
        headers = {
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/version',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))
        assert response.json == 'cosine similarity 1.0.0'


if __name__ == '__main__':
    unittest.main()

import unittest

from flask import json

from openapi_server.models import Peak, SimilarityCalculation
from openapi_server.test import BaseTestCase


class TestCosineImplController(BaseTestCase):

    def test_similarity_post_with_reference_spectra_list(self):
        """Test case for similarity_post with a reference spectra list
        """
        similarity_calculation = SimilarityCalculation(
            peak_list=[
                Peak(mz=147.063, intensity=121.684),
                Peak(mz=303.050, intensity=10000.000),
                Peak(mz=449.108, intensity=657.368),
                Peak(mz=465.102, intensity=5884.210),
                Peak(mz=611.161, intensity=6700.000)],
            reference_spectra_list=[
                "MSBNK-IPB_Halle-PB001341",
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
        self.assertEqual(
            first=response.json,
            second={'similarity_score_list': [
                {'accession': 'MSBNK-IPB_Halle-PB001341', 'similarity_score': 1.0},
                {'accession': 'MSBNK-IPB_Halle-PB001342', 'similarity_score': 0.9996960636910108},
                {'accession': 'MSBNK-IPB_Halle-PB006202', 'similarity_score': 0.7805885716182652},
                {'accession': 'MSBNK-IPB_Halle-PB001343', 'similarity_score': 0.7453663370426841},
                {'accession': 'MSBNK-IPB_Halle-PB006203', 'similarity_score': 0.7451928995770817}
            ]})

    def test_similarity_post_with_empty_reference_spectra_list(self):
        """Test case for similarity_post with an empty reference spectra list
        """
        similarity_calculation = SimilarityCalculation(
            peak_list=[
                Peak(mz=147.063, intensity=121.684),
                Peak(mz=303.050, intensity=10000.000),
                Peak(mz=449.108, intensity=657.368),
                Peak(mz=465.102, intensity=5884.210),
                Peak(mz=611.161, intensity=6700.000)],
            reference_spectra_list=[])
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
        self.assertEqual(
            first=response.json['similarity_score_list'][0:5],
            second=[
                {'accession': 'MSBNK-IPB_Halle-PB001341', 'similarity_score': 1.0},
                {'accession': 'MSBNK-IPB_Halle-PB001342', 'similarity_score': 0.9996960636910108},
                {'accession': 'MSBNK-IPB_Halle-PB006201', 'similarity_score': 0.8746590264678654},
                {'accession': 'MSBNK-IPB_Halle-PB006202', 'similarity_score': 0.7805885716182652},
                {'accession': 'MSBNK-IPB_Halle-PB001343', 'similarity_score': 0.7453663370426841}])
        self.assertTrue(len(response.json['similarity_score_list']) > 5)

    def test_similarity_post_with_no_reference_spectra_list(self):
        """Test case for similarity_post with no reference spectra list
        """
        similarity_calculation = SimilarityCalculation(
            peak_list=[
                Peak(mz=147.063, intensity=121.684),
                Peak(mz=303.050, intensity=10000.000),
                Peak(mz=449.108, intensity=657.368),
                Peak(mz=465.102, intensity=5884.210),
                Peak(mz=611.161, intensity=6700.000)])
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
        self.assertEqual(
            first=response.json['similarity_score_list'][0:5],
            second=[
                {'accession': 'MSBNK-IPB_Halle-PB001341', 'similarity_score': 1.0},
                {'accession': 'MSBNK-IPB_Halle-PB001342', 'similarity_score': 0.9996960636910108},
                {'accession': 'MSBNK-IPB_Halle-PB006201', 'similarity_score': 0.8746590264678654},
                {'accession': 'MSBNK-IPB_Halle-PB006202', 'similarity_score': 0.7805885716182652},
                {'accession': 'MSBNK-IPB_Halle-PB001343', 'similarity_score': 0.7453663370426841}])
        self.assertTrue(len(response.json['similarity_score_list']) > 5)

    def test_version_get(self):
        """Test case for version_get
        """
        headers = {
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/version',
            method='GET',
            headers=headers)
        self.assert200(response, 'Response body is : ' + response.data.decode('utf-8'))
        self.assertEqual(response.json, 'cosine similarity 1.0.0')


if __name__ == '__main__':
    unittest.main()

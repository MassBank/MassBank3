import connexion

from openapi_server import encoder
from waitress import serve

app = connexion.App(__name__, specification_dir='..')
app.app.json_encoder = encoder.JSONEncoder
app.add_api('openapi.yaml',
            arguments={'title': 'Similarity score api for MassBank3'},
            pythonic_params=True)


def serve_app():
    serve(app, listen='*:8080')

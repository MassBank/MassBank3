#!/usr/bin/env python3

import connexion

from openapi_server import encoder
import db


def main():
    print("Loading spectra... ", end='', flush=True)
    db.load_spectra()
    print("Finished")

    app = connexion.App(__name__, specification_dir='..')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('openapi.yaml',
                arguments={'title': 'Similarity score api for MassBank3'},
                pythonic_params=True)

    app.run(port=8080)


if __name__ == '__main__':
    main()

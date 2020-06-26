import json
import os


def load_json_payload(filename):
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), filename), 'rt') as file:
        return json.load(file)

import json


class Consent(object):
    def __init__(self) -> None:
        self._register_id = None
        self._practitioner_id = None
        self._register_type = None
        self._state = None

    def parse_from_payload(self, payload):
        self._register_id = payload.register_id
        self._register_type = payload.register_type
        self._practitioner_id = payload.practitioner_id
        self._state = payload.state

    def parse_from_json(self, jsonString):
        register = json.loads(jsonString)
        self._register_id = register['register_id']
        self._practitioner_id = register['practitioner_id']
        self._register_type = register['register_type']
        self._state = register['state']

    def serialize_to_json(self):
        return json.dumps({
            'register_id': self._register_id,
            'practitioner_id': self._practitioner_id,
            'register_type': self._register_type,
            'state': self._state
        })

    @property
    def register_id(self):
        return self._register_id

    @property
    def practitioner_id(self):
        return self._practitioner_id

    @property
    def register_type(self):
        return self._register_type

    @property
    def state(self):
        return self._state
    
    @state.setter
    def state(self, value):
        self._state = value

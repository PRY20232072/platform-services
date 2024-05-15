import json


class Consent(object):
    def __init__(self) -> None:
        self._patient_id = None
        self._practitioner_id = None
        self._state = None

    def parse_from_payload(self, payload):
        self._patient_id = payload.patient_id
        self._practitioner_id = payload.practitioner_id
        self._state = payload.state

    def parse_from_json(self, jsonString):
        register = json.loads(jsonString)
        self._patient_id = register['patient_id']
        self._practitioner_id = register['practitioner_id']
        self._state = register['state']

    def serialize_to_json(self):
        return json.dumps({
            'patient_id': self._patient_id,
            'practitioner_id': self._practitioner_id,
            'state': self._state
        })

    @property
    def patient_id(self):
        return self._patient_id

    @property
    def practitioner_id(self):
        return self._practitioner_id

    @property
    def state(self):
        return self._state
    
    @state.setter
    def state(self, value):
        self._state = value

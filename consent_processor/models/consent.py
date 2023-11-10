import json

class Consent(object): 
    def __init__(self) -> None:
        pass

    def parse_from_payload(self, payload):
        self._patient_id = payload.patient_id
        self._practitioner_id = payload.practitioner_id

    def parse_from_json(self, jsonString):
        patient = json.loads(jsonString)
        self._patient_id = patient['patient_id']
        self._practitioner_id = patient['practitioner_id']

    def serialize_to_json(self):
        return json.dumps({
            'patient_id': self._patient_id,
            'practitioner_id': self._practitioner_id
        })
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def practitioner_id(self):
        return self._practitioner_id


import json

class Consent(object): 
    def __init__(self) -> None:
        pass

    def parse_from_payload(self, payload):
        self._patient_id = payload.patient_id
        self._professional_id = payload.professional_id

    def parse_from_json(self, jsonString):
        patient = json.loads(jsonString)
        self._patient_id = patient['patient_id']
        self._professional_id = patient['professional_id']

    def serialize_to_json(self):
        return json.dumps({
            'patient_id': self._patient_id,
            'professional_id': self._professional_id
        })
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def professional_id(self):
        return self._professional_id


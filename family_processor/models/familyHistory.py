import json

class FamilyHistory(object): 
    def __init__(self) -> None:
        self._familyHistory_id = None
        self._patient_id = None
        self._ipfs_hash = None

    def parse_from_payload(self, payload):
        if payload.familyHistory_id:
            self._familyHistory_id = payload.familyHistory_id

        if payload.patient_id:
            self._patient_id = payload.patient_id

        if payload.ipfs_hash:
            self._ipfs_hash = payload.ipfs_hash

    def parse_from_json(self, jsonString):
        familyHistory = json.loads(jsonString)

        if familyHistory['familyHistory_id']:
            self._familyHistory_id = familyHistory['familyHistory_id']

        if familyHistory['patient_id']:
            self._patient_id = familyHistory['patient_id']

        if familyHistory['ipfs_hash']:
            self._ipfs_hash = familyHistory['ipfs_hash']

    def serialize_to_json(self):
        return json.dumps({
            'familyHistory_id': self._familyHistory_id,
            'patient_id': self._patient_id,
            'ipfs_hash': self._ipfs_hash
        })
    
    @property
    def familyHistory_id(self):
        return self._familyHistory_id
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash


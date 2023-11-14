import json

class Allergy(object): 
    def __init__(self) -> None:
        self._allergy_id = None
        self._patient_id = None
        self._ipfs_hash = None

    def parse_from_payload(self, payload):
        if payload.allergy_id:
            self._allergy_id = payload.allergy_id

        if payload.patient_id:
            self._patient_id = payload.patient_id

        if payload.ipfs_hash:
            self._ipfs_hash = payload.ipfs_hash

    def parse_from_json(self, jsonString):
        allergy = json.loads(jsonString)

        if allergy['allergy_id']:
            self._allergy_id = allergy['allergy_id']

        if allergy['patient_id']:
            self._patient_id = allergy['patient_id']

        if allergy['ipfs_hash']:
            self._ipfs_hash = allergy['ipfs_hash']

    def serialize_to_json(self):
        return json.dumps({
            'allergy_id': self._allergy_id,
            'patient_id': self._patient_id,
            'ipfs_hash': self._ipfs_hash
        })
    
    @property
    def allergy_id(self):
        return self._allergy_id
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash


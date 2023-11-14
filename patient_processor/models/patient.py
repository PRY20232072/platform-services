import json

class Patient(object): 
    def __init__(self) -> None:
        self._patient_id = None
        self._ipfs_hash = None
        self._permissions = None

    def parse_from_payload(self, payload):
        self._patient_id = payload.patient_id
        self._ipfs_hash = payload.ipfs_hash
        self._permissions = payload.permissions

    def parse_from_json(self, jsonString):
        patient = json.loads(jsonString)
        self._patient_id = patient['patient_id']
        self._ipfs_hash = patient['ipfs_hash']
        self._permissions = patient['permissions']

    def serialize_to_json(self):
        return json.dumps({
            'patient_id': self._patient_id,
            'ipfs_hash': self._ipfs_hash,
            'permissions': self._permissions
        })
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash

    @property
    def permissions(self):
        return self._permissions
    
    @permissions.setter
    def permissions(self, permissions):
        self._permissions = permissions
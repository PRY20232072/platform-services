import json

class Practitioner(object): 
    def __init__(self) -> None:
        self._practitioner_id = None
        self._ipfs_hash = None
        self._permissions = None

    def parse_from_payload(self, payload):
        self._practitioner_id = payload.practitioner_id
        self._ipfs_hash = payload.ipfs_hash
        self._permissions = payload.permissions

    def parse_from_json(self, jsonString):
        practitioner = json.loads(jsonString)
        self._practitioner_id = practitioner['practitioner_id']
        self._ipfs_hash = practitioner['ipfs_hash']
        self._permissions = practitioner['permissions']

    def serialize_to_json(self):
        return json.dumps({
            'practitioner_id': self._practitioner_id,
            'ipfs_hash': self._ipfs_hash,
            'permissions': self._permissions
        })
    
    @property
    def practitioner_id(self):
        return self._practitioner_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash

    @property
    def permissions(self):
        return self._permissions
    
    @permissions.setter
    def permissions(self, permissions):
        self._permissions = permissions

import json

class Practitioner(object): 
    def __init__(self) -> None:
        pass

    def parse_from_payload(self, payload):
        self._practitioner_id = payload.practitioner_id
        self._ipfs_hash = payload.ipfs_hash

    def parse_from_json(self, jsonString):
        practitioner = json.loads(jsonString)
        self._practitioner_id = practitioner['practitioner_id']
        self._ipfs_hash = practitioner['ipfs_hash']

    def serialize_to_json(self):
        return json.dumps({
            'practitioner_id': self._practitioner_id,
            'ipfs_hash': self._ipfs_hash
        })
    
    @property
    def practitioner_id(self):
        return self._practitioner_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash


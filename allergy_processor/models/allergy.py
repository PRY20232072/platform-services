import json

class Allergy(object): 
    def __init__(self) -> None:
        pass

    def parse_from_payload(self, payload):
        self._allergy_id = payload.allergy_id
        self._ipfs_hash = payload.ipfs_hash

    def parse_from_json(self, jsonString):
        allergy = json.loads(jsonString)
        self._allergy_id = allergy['allergy_id']
        self._ipfs_hash = allergy['ipfs_hash']

    def serialize_to_json(self):
        return json.dumps({
            'allergy_id': self._allergy_id,
            'ipfs_hash': self._ipfs_hash
        })
    
    @property
    def allergy_id(self):
        return self._allergy_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash


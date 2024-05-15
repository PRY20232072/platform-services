import json

class Attention(object): 
    def __init__(self) -> None:
        self._attention_id = None
        self._patient_id = None
        self._ipfs_hash = None

    def parse_from_payload(self, payload):
        if payload.attention_id:
            self._attention_id = payload.attention_id

        if payload.patient_id:
            self._patient_id = payload.patient_id

        if payload.ipfs_hash:
            self._ipfs_hash = payload.ipfs_hash

    def parse_from_json(self, jsonString):
        attention = json.loads(jsonString)

        if attention['attention_id']:
            self._attention_id = attention['attention_id']

        if attention['patient_id']:
            self._patient_id = attention['patient_id']

        if attention['ipfs_hash']:
            self._ipfs_hash = attention['ipfs_hash']

    def serialize_to_json(self):
        return json.dumps({
            'attention_id': self._attention_id,
            'patient_id': self._patient_id,
            'ipfs_hash': self._ipfs_hash
        })
    
    @property
    def attention_id(self):
        return self._attention_id
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash


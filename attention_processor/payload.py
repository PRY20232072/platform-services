
import json

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from models.enums import AttentionTransactionAction

class AttentionPayload(object):
    def __init__(self, payload):
        try:
            payload = json.loads(payload.decode())
        except ValueError:
            raise InvalidTransaction("Invalid payload serialization")
        
        if not payload:
            raise InvalidTransaction("Payload is required")
        
        if payload['action'] not in AttentionTransactionAction.__members__:
            raise InvalidTransaction("Invalid Attention Transaction Action: {}".format(payload['action']))
        
        self._action = payload['action']

        if not payload['attention_id']:
            raise InvalidTransaction("Attention ID is required")
        
        self._attention_id = payload['attention_id']

        if not payload['patient_id']:
            raise InvalidTransaction("Patient ID is required")
        
        self._patient_id = payload['patient_id']

        self._ipfs_hash = None

        if self._action != AttentionTransactionAction.DELETE.name:
            if not payload['ipfs_hash']:
                raise InvalidTransaction("IPFS Hash is required")
            
            self._ipfs_hash = payload['ipfs_hash']

    @property
    def attention_id(self):
        return self._attention_id
    
    @property
    def patient_id(self):
        return self._patient_id
    
    @property
    def ipfs_hash(self):
        return self._ipfs_hash
    
    @property
    def is_create(self):
        return self._action == AttentionTransactionAction.CREATE.name
    
    @property
    def is_update(self):
        return self._action == AttentionTransactionAction.UPDATE.name
    
    @property
    def is_delete(self):
        return self._action == AttentionTransactionAction.DELETE.name


import json

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from models.enums import ConsentTransactionAction

class ConsentPayload(object):
    def __init__(self, payload):
        try:
            payload = json.loads(payload.decode())
        except ValueError:
            raise InvalidTransaction("Invalid payload serialization")
        
        if not payload:
            raise InvalidTransaction("Payload is required")
        
        if payload['action'] not in ConsentTransactionAction.__members__:
            raise InvalidTransaction("Invalid Patient Transaction Action: {}".format(payload['action']))
        
        self._action = payload['action']

        if not payload['patient_id']:
            raise InvalidTransaction("Patient Id is required")
        
        self._patient_id = payload['patient_id']

        if not payload['professional_id']:
            raise InvalidTransaction("Professional Id Hash is required")
        
        self._professional_id = payload['professional_id']

    @property
    def patient_id(self):
        return self._patient_id

    @property
    def professional_id(self):
        return self._professional_id
    
    @property
    def is_create(self):
        return self._action == ConsentTransactionAction.CREATE.name
    
    @property
    def is_revoke(self):
        return self._action == ConsentTransactionAction.REVOKE.name
    

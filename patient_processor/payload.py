
import json

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from models.enums import PatientTransactionAction


class PatientPayload(object):
    def __init__(self, payload):
        try:
            payload = json.loads(payload.decode())
        except ValueError:
            raise InvalidTransaction("Invalid payload serialization")

        if not payload:
            raise InvalidTransaction("Payload is required")

        if payload['action'] not in PatientTransactionAction.__members__:
            raise InvalidTransaction(
                "Invalid Patient Transaction Action: {}".format(payload['action']))
        self._action = payload['action']

        if not payload['patient_id']:
            raise InvalidTransaction("Patient Id is required")
        self._patient_id = payload['patient_id']

        self._permissions = None
        if self._action == PatientTransactionAction.CREATE.name:
            if not payload['permissions']:
                raise InvalidTransaction("Permissions is required")
            self._permissions = payload['permissions']

        self._ipfs_hash = None
        if self._action != PatientTransactionAction.DELETE.name:
            if not payload['ipfs_hash']:
                raise InvalidTransaction("IPFS Hash is required")
            self._ipfs_hash = payload['ipfs_hash']

    @property
    def patient_id(self):
        return self._patient_id

    @property
    def ipfs_hash(self):
        return self._ipfs_hash
    
    @property
    def permissions(self):
        return self._permissions

    @property
    def is_create(self):
        return self._action == PatientTransactionAction.CREATE.name

    @property
    def is_update(self):
        return self._action == PatientTransactionAction.UPDATE.name

    @property
    def is_delete(self):
        return self._action == PatientTransactionAction.DELETE.name

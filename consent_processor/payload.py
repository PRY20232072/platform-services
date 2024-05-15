
import json

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from models.enums import ConsentTransactionAction, ConsentStatus


class ConsentPayload(object):
    def __init__(self, payload):
        try:
            payload = json.loads(payload.decode())
        except ValueError:
            raise InvalidTransaction("Invalid payload serialization")

        if not payload:
            raise InvalidTransaction("Payload is required")

        if payload['action'] not in ConsentTransactionAction.__members__:
            raise InvalidTransaction(
                "Invalid Transaction Action: {}".format(payload['action']))
        self._action = payload['action']

        if not payload['patient_id']:
            raise InvalidTransaction("Patient Id is required")
        self._patient_id = payload['patient_id']

        if not payload['practitioner_id']:
            raise InvalidTransaction("Practitioner Id Hash is required")
        self._practitioner_id = payload['practitioner_id']

        self._state = None

        if self._action == ConsentTransactionAction.CREATE.name:
            self._state = ConsentStatus.PENDING.name

    @property
    def patient_id(self):
        return self._patient_id

    @property
    def practitioner_id(self):
        return self._practitioner_id
    
    @property
    def state(self):
        return self._state

    @property
    def is_create(self):
        return self._action == ConsentTransactionAction.CREATE.name

    @property
    def is_approve(self):
        return self._action == ConsentTransactionAction.APPROVE.name
    
    @property
    def is_revoke(self):
        return self._action == ConsentTransactionAction.REVOKE.name


import json

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from models.enums import ConsentTransactionAction, ConsentStatus, ConsentRegisterType


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

        if not payload['register_id']:
            raise InvalidTransaction("Register Id is required")
        self._register_id = payload['register_id']

        if not payload['practitioner_id']:
            raise InvalidTransaction("Practitioner Id Hash is required")
        self._practitioner_id = payload['practitioner_id']

        self._register_type = None
        self._state = None
        if self._action == ConsentTransactionAction.CREATE_REQUEST.name:
            if not payload['register_type']:
                raise InvalidTransaction("Register Type is required")
            if payload['register_type'] not in ConsentRegisterType.__members__:
                raise InvalidTransaction(
                    "Invalid Register Type: {}".format(payload['register_type']))
            self._register_type = payload['register_type']

            self._state = ConsentStatus.PENDING.name
            # if not payload['state']:
            #     raise InvalidTransaction("State is required")
            # if payload['state'] not in ConsentState.__members__:
            #     raise InvalidTransaction(
            #         "Invalid State: {}".format(payload['state']))
            # self._state = payload['state']

    @property
    def register_id(self):
        return self._register_id

    @property
    def practitioner_id(self):
        return self._practitioner_id
    
    @property
    def register_type(self):
        return self._register_type
    
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

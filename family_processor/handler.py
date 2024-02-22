from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

from payload import FamilyHistoryPayload
from helpers import helper
from state import FamilyHistoryState


class FamilyTransactionHandler(TransactionHandler):
    def __init__(self):
        pass

    @property
    def family_name(self):
        return helper.TP_NAME

    @property
    def family_versions(self):
        return [helper.TP_FAMILY_VERSION]

    @property
    def namespaces(self):
        return [helper.get_namespace_prefix()]

    def apply(self, transaction, context):
        print(f"Payload: {transaction.payload.decode()}")

        familyHistory_payload = FamilyHistoryPayload(transaction.payload)
        familyHistory_state = FamilyHistoryState(context)

        if familyHistory_payload.is_create:
            familyHistory_state.save_familyHistory(familyHistory_payload)
        elif familyHistory_payload.is_update:
            familyHistory_state.update_familyHistory(familyHistory_payload)
        elif familyHistory_payload.is_delete:
            familyHistory_state.delete_familyHistory(familyHistory_payload)
        else:
            raise InvalidTransaction(
                'Unhandled action: {}'.format(familyHistory_payload.action))

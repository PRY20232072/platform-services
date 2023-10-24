from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

from payload import AllergyPayload
from helpers import helper
from state import AllergyState


class AllergyTransactionHandler(TransactionHandler):
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

        allergy_payload = AllergyPayload(transaction.payload)
        allergy_state = AllergyState(context)

        if allergy_payload.is_create:
            allergy_state.save_allergy(allergy_payload)
        elif allergy_payload.is_update:
            allergy_state.update_allergy(allergy_payload)
        elif allergy_payload.is_delete:
            allergy_state.delete_allergy(allergy_payload)
        else:
            raise InvalidTransaction(
                'Unhandled action: {}'.format(allergy_payload.action))

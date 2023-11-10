from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

from payload import PractitionerPayload
from helpers import helper
from state import PractitionerState


class PractitionerTransactionHandler(TransactionHandler):
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

        practitioner_payload = PractitionerPayload(transaction.payload)
        practitioner_state = PractitionerState(context)

        if practitioner_payload.is_create:
            practitioner_state.save_practitioner(practitioner_payload)
        elif practitioner_payload.is_update:
            practitioner_state.update_practitioner(practitioner_payload)
        elif practitioner_payload.is_delete:
            practitioner_state.delete_practitioner(practitioner_payload)
        else:
            raise InvalidTransaction(
                'Unhandled action: {}'.format(practitioner_payload.action))

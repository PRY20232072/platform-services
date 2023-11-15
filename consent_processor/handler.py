from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

from payload import ConsentPayload
from helpers import helper
from state import ConsentState


class ConsentTransactionHandler(TransactionHandler):
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

        consent_payload = ConsentPayload(transaction.payload)
        consent_state = ConsentState(context)

        if consent_payload.is_create:
            consent_state.create_consent(consent_payload)
        elif consent_payload.is_approve:
            consent_state.approve_consent(consent_payload)
        elif consent_payload.is_revoke:
            consent_state.revoke_consent(consent_payload)
        else:
            raise InvalidTransaction(
                'Unhandled action: {}'.format(consent_payload.action))

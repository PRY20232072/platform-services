from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

from payload import AttentionPayload
from helpers import helper
from state import AttentionState


class AttentionTransactionHandler(TransactionHandler):
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

        attention_payload = AttentionPayload(transaction.payload)
        attention_state = AttentionState(context)

        if attention_payload.is_create:
            attention_state.save_attention(attention_payload)
        elif attention_payload.is_update:
            attention_state.update_attention(attention_payload)
        elif attention_payload.is_delete:
            attention_state.delete_attention(attention_payload)
        else:
            raise InvalidTransaction(
                'Unhandled action: {}'.format(attention_payload.action))

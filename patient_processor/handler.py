from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

from payload import PatientPayload
from helpers import helper
from state import PatientState


class PatientTransactionHandler(TransactionHandler):
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

        patient_payload = PatientPayload(transaction.payload)
        patient_state = PatientState(context)

        if patient_payload.is_create:
            patient_state.save_patient(patient_payload)
        elif patient_payload.is_update:
            patient_state.update_patient(patient_payload)
        elif patient_payload.is_delete:
            patient_state.delete_patient(patient_payload)
        else:
            raise InvalidTransaction(
                'Unhandled action: {}'.format(patient_payload.action))

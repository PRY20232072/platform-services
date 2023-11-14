from models.consent import Consent
from helpers import helper


class ConsentState:
    def __init__(self, context):
        self._context = context

    def save_patient(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            patient_id=consent.patient_id, practitioner_id=consent.practitioner_id)
        if consentRegistry is None:
            print(
                f"save_consent: {consent.patient_id} - {consent.practitioner_id}")
            state_data = consent.serialize_to_json().encode()
            patient_practitioner_address = helper.make_address_patient_practitioner(
                consent.patient_id, consent.practitioner_id)
            practitioner_patient_address = helper.make_address_practitioner_patient(
                consent.practitioner_id, consent.patient_id)
            self._context.set_state(
                {patient_practitioner_address: state_data, practitioner_patient_address: state_data}, timeout=3)

    def revoke_consent(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            patient_id=consent.patient_id, practitioner_id=consent.practitioner_id)
        if consentRegistry is not None:
            print(
                f"delete_consent: {consent.patient_id} - {consent.practitioner_id}")
            patient_practitioner_address = helper.make_address_patient_practitioner(
                consent.patient_id, consent.practitioner_id)
            practitioner_patient_address = helper.make_address_practitioner_patient(
                consent.practitioner_id, consent.patient_id)
            self._context.delete_state(
                [patient_practitioner_address, practitioner_patient_address], timeout=3)

    def _load_registry(self, patient_id, practitioner_id):
        print(f"get_patient: {patient_id} - {practitioner_id}")
        address = helper.make_address_patient_practitioner(
            patient_id, practitioner_id)
        state_entries = self._context.get_state([address], timeout=3)
        print(f"state_entries: {state_entries}")
        if state_entries:
            try:
                consent = Consent()
                consent.parse_from_json(state_entries[0].data.decode())
                return consent
            except ValueError:
                return None
        else:
            return None

from models.consent import Consent
from helpers import helper


class ConsentState:
    def __init__(self, context):
        self._context = context

    def save_patient(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            patient_id=consent.patient_id, professional_id=consent.professional_id)
        if consentRegistry is None:
            print(
                f"save_consent: {consent.patient_id} - {consent.professional_id}")
            state_data = consent.serialize_to_json().encode()
            patient_professional_address = helper.make_address_patient_professional(
                consent.patient_id, consent.professional_id)
            professional_patient_address = helper.make_address_professional_patient(
                consent.professional_id, consent.patient_id)
            self._context.set_state(
                {patient_professional_address: state_data, professional_patient_address: state_data}, timeout=3)

    def revoke_consent(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            patient_id=consent.patient_id, professional_id=consent.professional_id)
        if consentRegistry is not None:
            print(
                f"delete_consent: {consent.patient_id} - {consent.professional_id}")
            patient_professional_address = helper.make_address_patient_professional(
                consent.patient_id, consent.professional_id)
            professional_patient_address = helper.make_address_professional_patient(
                consent.professional_id, consent.patient_id)
            self._context.delete_state(
                [patient_professional_address, professional_patient_address], timeout=3)

    def _load_registry(self, patient_id, professional_id):
        print(f"get_patient: {patient_id} - {professional_id}")
        address = helper.make_address_patient_professional(
            patient_id, professional_id)
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

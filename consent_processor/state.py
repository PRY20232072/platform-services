from models.consent import Consent
from models.enums import ConsentStatus
from helpers import helper


class ConsentState:
    def __init__(self, context):
        self._context = context

    def create_consent(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            register_id=consent.register_id, practitioner_id=consent.practitioner_id)
        if consentRegistry is None:
            print(
                f"save_consent: {consent.register_id} - {consent.practitioner_id}")
            state_data = consent.serialize_to_json().encode()
            register_practitioner_address = helper.make_address_register_practitioner(
                consent.register_id, consent.practitioner_id)
            practitioner_register_address = helper.make_address_practitioner_register(
                consent.practitioner_id, consent.register_id)
            self._context.set_state(
                {register_practitioner_address: state_data, practitioner_register_address: state_data}, timeout=3)

    def approve_consent(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            register_id=consent.register_id, practitioner_id=consent.practitioner_id)
        if consentRegistry is not None:
            print(
                f"save_consent: {consent.register_id} - {consent.practitioner_id}")

            consent.state = ConsentStatus.ACTIVE.name
            consent.register_type = consentRegistry.register_type

            state_data = consent.serialize_to_json().encode()
            register_practitioner_address = helper.make_address_register_practitioner(
                consent.register_id, consent.practitioner_id)
            practitioner_register_address = helper.make_address_practitioner_register(
                consent.practitioner_id, consent.register_id)
            self._context.set_state(
                {register_practitioner_address: state_data, practitioner_register_address: state_data}, timeout=3)

    def revoke_consent(self, consentPayload):
        consent = Consent()
        consent.parse_from_payload(consentPayload)
        consentRegistry = self._load_registry(
            register_id=consent.register_id, practitioner_id=consent.practitioner_id)
        if consentRegistry is not None:
            print(
                f"delete_consent: {consent.register_id} - {consent.practitioner_id}")
            register_practitioner_address = helper.make_address_register_practitioner(
                consent.register_id, consent.practitioner_id)
            practitioner_register_address = helper.make_address_practitioner_register(
                consent.practitioner_id, consent.register_id)
            self._context.delete_state(
                [register_practitioner_address, practitioner_register_address], timeout=3)

    def _load_registry(self, register_id, practitioner_id):
        print(f"get_register: {register_id} - {practitioner_id}")
        address = helper.make_address_register_practitioner(
            register_id, practitioner_id)
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

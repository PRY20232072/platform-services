from models.practitioner import Practitioner
from helpers import helper


class PractitionerState:
    def __init__(self, context):
        self._context = context

    def save_practitioner(self, practitionerPayload):
        practitioner = Practitioner()
        practitioner.parse_from_payload(practitionerPayload)
        practitionerRegistry = self._load_registry(practitioner.practitioner_id)
        if practitionerRegistry is None:
            print(f"save_practitioner: {practitioner.practitioner_id}")
            address = helper.make_address(practitioner.practitioner_id)
            state_data = practitioner.serialize_to_json().encode()
            self._context.set_state({address: state_data}, timeout=3)

    def update_practitioner(self, practitionerPayload):
        practitioner = Practitioner()
        practitioner.parse_from_payload(practitionerPayload)
        practitionerRegistry = self._load_registry(practitioner.practitioner_id)
        if practitionerRegistry is not None:
            print(f"update_practitioner: {practitioner.practitioner_id}")
            address = helper.make_address(practitioner.practitioner_id)
            state_data = practitioner.serialize_to_json().encode()
            self._context.set_state({address: state_data}, timeout=3)

    def delete_practitioner(self, practitionerPayload):
        practitioner = Practitioner()
        practitioner.parse_from_payload(practitionerPayload)
        practitionerRegistry = self._load_registry(practitioner.practitioner_id)
        if practitionerRegistry is not None:
            print(f"delete_practitioner: {practitioner.practitioner_id}")
            address = helper.make_address(practitioner.practitioner_id)
            self._context.delete_state([address], timeout=3)

    def _load_registry(self, identifier):
        print(f"get_practitioner: {identifier}")
        address = helper.make_address(identifier)
        state_entries = self._context.get_state([address], timeout=3)
        print(f"state_entries: {state_entries}")
        if state_entries:
            try:
                practitioner = Practitioner()
                practitioner.parse_from_json(state_entries[0].data.decode())
                return practitioner
            except ValueError:
                return None
        else:
            return None

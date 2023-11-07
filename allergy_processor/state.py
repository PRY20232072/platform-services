from models.allergy import Allergy
from helpers import helper


class AllergyState:
    def __init__(self, context):
        self._context = context

    def save_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(allergy.allergy_id)
        # print(f"allergyRegistry found: {allergyRegistry}")
        if allergyRegistry is None:
            print(f"save_allergy: {allergy.allergy_id}")
            address = helper.make_address(allergy.allergy_id)
            state_data = allergy.serialize_to_json().encode()
            self._context.set_state({address: state_data}, timeout=3)

    def update_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(allergy.allergy_id)
        # print(f"allergyRegistry found: {allergyRegistry}")
        if allergyRegistry is not None:
            print(f"update_allergy: {allergy.allergy_id}")
            address = helper.make_address(allergy.allergy_id)
            state_data = allergy.serialize_to_json().encode()
            self._context.set_state({address: state_data}, timeout=3)

    def delete_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(allergy.allergy_id)
        # print(f"allergyRegistry found: {allergyRegistry}")
        if allergyRegistry is not None:
            print(f"delete_allergy: {allergy.allergy_id}")
            address = helper.make_address(allergy.allergy_id)
            self._context.delete_state([address], timeout=3)

    def _load_registry(self, identifier):
        print(f"get_allergy: {identifier}")
        address = helper.make_address(identifier)
        state_entries = self._context.get_state([address], timeout=3)
        print(f"state_entries: {state_entries}")
        if state_entries:
            try:
                allergy = Allergy()
                allergy.parse_from_json(state_entries[0].data.decode())
                return allergy
            except ValueError:
                return None
        else:
            return None

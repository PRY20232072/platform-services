from models.allergy import Allergy
from helpers import helper


class AllergyState:
    def __init__(self, context):
        self._context = context

    def save_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(
            patient_id=allergy.patient_id, identifier=allergy.allergy_id)
        # print(f"allergyRegistry found: {allergyRegistry}")
        if allergyRegistry is None:
            print(f"save_allergy: {allergy.allergy_id}")
            state_data = allergy.serialize_to_json().encode()
            allergy_patient_address = helper.make_address_allergy_patient(
                allergy_id=allergy.allergy_id, patient_id=allergy.patient_id)
            patient_allergy_address = helper.make_address_patient_allergy(
                patient_id=allergy.patient_id, allergy_id=allergy.allergy_id)

            self._context.set_state(
                {allergy_patient_address: state_data, patient_allergy_address: state_data}, timeout=3)

    def update_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(
            patient_id=allergy.patient_id, identifier=allergy.allergy_id)
        # print(f"allergyRegistry found: {allergyRegistry}")
        if allergyRegistry is not None:
            print(f"update_allergy: {allergy.allergy_id}")
            allergy_patient_address = helper.make_address_allergy_patient(
                allergy_id=allergy.allergy_id, patient_id=allergy.patient_id)
            patient_allergy_address = helper.make_address_patient_allergy(
                patient_id=allergy.patient_id, allergy_id=allergy.allergy_id)
            state_data = allergy.serialize_to_json().encode()
            self._context.set_state(
                {allergy_patient_address: state_data, patient_allergy_address: state_data}, timeout=3)

    def delete_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(
            patient_id=allergy.patient_id, identifier=allergy.allergy_id)
        # print(f"allergyRegistry found: {allergyRegistry}")
        if allergyRegistry is not None:
            print(f"delete_allergy: {allergy.allergy_id}")
            allergy_patient_address = helper.make_address_allergy_patient(
                allergy_id=allergy.allergy_id, patient_id=allergy.patient_id)
            patient_allergy_address = helper.make_address_patient_allergy(
                patient_id=allergy.patient_id, allergy_id=allergy.allergy_id)
            self._context.delete_state(
                [allergy_patient_address, patient_allergy_address], timeout=3)

    def _load_registry(self, patient_id, identifier):
        print(f"get_allergy: {identifier}")
        address = helper.make_address_allergy_patient(
            allergy_id=identifier, patient_id=patient_id)
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

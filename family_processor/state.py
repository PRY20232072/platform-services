from models.familyHistory import FamilyHistory
from helpers import helper


class FamilyHistoryState:
    def __init__(self, context):
        self._context = context

    def save_familyHistory(self, familyHistoryPayload):
        familyHistory = FamilyHistory()
        familyHistory.parse_from_payload(familyHistoryPayload)
        familyHistoryRegistry = self._load_registry(
            patient_id=familyHistory.patient_id, identifier=familyHistory.familyHistory_id)
        # print(f"familyHistoryRegistry found: {familyHistoryRegistry}")
        if familyHistoryRegistry is None:
            print(f"save_familyHistory: {familyHistory.familyHistory_id}")
            state_data = familyHistory.serialize_to_json().encode()
            familyHistory_patient_address = helper.make_address_familyHistory_patient(
                familyHistory_id=familyHistory.familyHistory_id, patient_id=familyHistory.patient_id)
            patient_familyHistory_address = helper.make_address_patient_familyHistory(
                patient_id=familyHistory.patient_id, familyHistory_id=familyHistory.familyHistory_id)

            self._context.set_state(
                {familyHistory_patient_address: state_data, patient_familyHistory_address: state_data}, timeout=3)

    def update_familyHistory(self, familyHistoryPayload):
        familyHistory = FamilyHistory()
        familyHistory.parse_from_payload(familyHistoryPayload)
        familyHistoryRegistry = self._load_registry(
            patient_id=familyHistory.patient_id, identifier=familyHistory.familyHistory_id)
        # print(f"familyHistoryRegistry found: {familyHistoryRegistry}")
        if familyHistoryRegistry is not None:
            print(f"update_familyHistory: {familyHistory.familyHistory_id}")
            familyHistory_patient_address = helper.make_address_familyHistory_patient(
                familyHistory_id=familyHistory.familyHistory_id, patient_id=familyHistory.patient_id)
            patient_familyHistory_address = helper.make_address_patient_familyHistory(
                patient_id=familyHistory.patient_id, familyHistory_id=familyHistory.familyHistory_id)
            state_data = familyHistory.serialize_to_json().encode()
            self._context.set_state(
                {familyHistory_patient_address: state_data, patient_familyHistory_address: state_data}, timeout=3)

    def delete_familyHistory(self, familyHistoryPayload):
        familyHistory = FamilyHistory()
        familyHistory.parse_from_payload(familyHistoryPayload)
        familyHistoryRegistry = self._load_registry(
            patient_id=familyHistory.patient_id, identifier=familyHistory.familyHistory_id)
        # print(f"familyHistoryRegistry found: {familyHistoryRegistry}")
        if familyHistoryRegistry is not None:
            print(f"delete_familyHistory: {familyHistory.familyHistory_id}")
            familyHistory_patient_address = helper.make_address_familyHistory_patient(
                familyHistory_id=familyHistory.familyHistory_id, patient_id=familyHistory.patient_id)
            patient_familyHistory_address = helper.make_address_patient_familyHistory(
                patient_id=familyHistory.patient_id, familyHistory_id=familyHistory.familyHistory_id)
            self._context.delete_state(
                [familyHistory_patient_address, patient_familyHistory_address], timeout=3)

    def _load_registry(self, patient_id, identifier):
        print(f"get_familyHistory: {identifier}")
        address = helper.make_address_familyHistory_patient(
            familyHistory_id=identifier, patient_id=patient_id)
        state_entries = self._context.get_state([address], timeout=3)
        print(f"state_entries: {state_entries}")
        if state_entries:
            try:
                familyHistory = FamilyHistory()
                familyHistory.parse_from_json(state_entries[0].data.decode())
                return familyHistory
            except ValueError:
                return None
        else:
            return None

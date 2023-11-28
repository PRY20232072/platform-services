import logging

from models.allergy import Allergy
from helpers import helper, logging_config

logging_config.configure_logging()


class AllergyState:
    def __init__(self, context):
        self._context = context

    def save_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(
            patient_id=allergy.patient_id, identifier=allergy.allergy_id)
        if allergyRegistry is None:
            logging.info(f"save_allergy: {allergy.allergy_id}")
            self._set_state(allergy)

    def update_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(
            patient_id=allergy.patient_id, identifier=allergy.allergy_id)
        if allergyRegistry is not None:
            logging.info(f"update_allergy: {allergy.allergy_id}")
            self._set_state(allergy)

    def delete_allergy(self, allergyPayload):
        allergy = Allergy()
        allergy.parse_from_payload(allergyPayload)
        allergyRegistry = self._load_registry(
            patient_id=allergy.patient_id, identifier=allergy.allergy_id)
        if allergyRegistry is not None:
            logging.info(f"delete_allergy: {allergy.allergy_id}")
            allergy_patient_address, patient_allergy_address = helper.makes_addresses(
                patient_id=allergy.patient_id, allergy_id=allergy.allergy_id)
            self._context.delete_state(
                [allergy_patient_address, patient_allergy_address], timeout=3)

    def _set_state(self, allergy: Allergy):
        allergy_patient_address, patient_allergy_address = helper.makes_addresses(
            patient_id=allergy.patient_id, allergy_id=allergy.allergy_id)
        state_data = allergy.serialize_to_json().encode()
        self._context.set_state(
            {allergy_patient_address: state_data, patient_allergy_address: state_data}, timeout=3)

    def _load_registry(self, patient_id, identifier):
        logging.info(f"get_allergy: {identifier}")
        address = helper.make_address_allergy_patient(
            allergy_id=identifier, patient_id=patient_id)
        state_entries = self._context.get_state([address], timeout=3)
        logging.info(f"state_entries: {state_entries}")
        if state_entries:
            try:
                allergy = Allergy()
                allergy.parse_from_json(state_entries[0].data.decode())
                return allergy
            except ValueError:
                return None
        else:
            return None

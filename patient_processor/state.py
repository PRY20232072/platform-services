from models.patient import Patient
from helpers import helper


class PatientState:
    def __init__(self, context):
        self._context = context

    def save_patient(self, patientPayload):
        patient = Patient()
        patient.parse_from_payload(patientPayload)
        patientRegistry = self._load_registry(patient.patient_id)
        if patientRegistry is None:
            print(f"save_patient: {patient.patient_id}")
            address = helper.make_address(patient.patient_id)
            state_data = patient.serialize_to_json().encode()
            self._context.set_state({address: state_data}, timeout=3)

    def update_patient(self, patientPayload):
        patient = Patient()
        patient.parse_from_payload(patientPayload)
        patientRegistry = self._load_registry(patient.patient_id)
        if patientRegistry is not None:
            print(f"update_patient: {patient.patient_id}")
            patient.permissions = patientRegistry.permissions
            address = helper.make_address(patient.patient_id)
            state_data = patient.serialize_to_json().encode()
            self._context.set_state({address: state_data}, timeout=3)

    def delete_patient(self, patientPayload):
        patient = Patient()
        patient.parse_from_payload(patientPayload)
        patientRegistry = self._load_registry(patient.patient_id)
        if patientRegistry is not None:
            print(f"delete_patient: {patient.patient_id}")
            address = helper.make_address(patient.patient_id)
            self._context.delete_state([address], timeout=3)

    def _load_registry(self, identifier):
        print(f"get_patient: {identifier}")
        address = helper.make_address(identifier)
        state_entries = self._context.get_state([address], timeout=3)
        print(f"state_entries: {state_entries}")
        if state_entries:
            try:
                patient = Patient()
                patient.parse_from_json(state_entries[0].data.decode())
                return patient
            except ValueError:
                return None
        else:
            return None


import json

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from models.enums import AllergyType, AllergyCategory, AllergyCriticality, AllergySeverity, ClinicalStatus, VerificationStatus, AllergyTransactionAction


class AllergyPayload(object):
    def __init__(self, payload):
        # parse json payload to dict
        try:
            payload = json.loads(payload.decode())
        except ValueError:
            raise InvalidTransaction("Invalid payload serialization")

        if not payload:
            raise InvalidTransaction("Payload is required")

        # check for required fields
        if payload['action'] not in AllergyTransactionAction.__members__:
            raise InvalidTransaction("Invalid Allergy Transactlfion Action: {}".format(
                payload['action']))

        self._action = payload['action']

        if not payload['allergy_id']:
            raise InvalidTransaction("Allergy ID is required")

        self._allergy_id = payload['allergy_id']
        self._patient_id = None
        self._participant_id = None
        self._type = None
        self._category = None
        self._criticality = None
        self._severity = None
        self._clinical_status = None
        self._verification_status = None
        self._onset_date = None
        self._recorded_date = None
        self._last_occurrence = None
        self._allergy_notes = None

        if self._action == AllergyTransactionAction.CREATE.name or self._action == AllergyTransactionAction.UPDATE.name:
            if not payload['patient_id']:
                raise InvalidTransaction("Patient ID is required")

            if not payload['participant_id']:
                raise InvalidTransaction("Participant ID is required")

            if not payload['type']:
                raise InvalidTransaction("Allergy Type is required")

            if not payload['category']:
                raise InvalidTransaction("Allergy Category is required")

            if not payload['criticality']:
                raise InvalidTransaction("Allergy Criticality is required")

            if not payload['severity']:
                raise InvalidTransaction("Allergy Severity is required")

            if not payload['clinical_status']:
                raise InvalidTransaction("Allergy Clinical Status is required")

            if not payload['verification_status']:
                raise InvalidTransaction(
                    "Allergy Verification Status is required")

            if not payload['onset_date']:
                raise InvalidTransaction("Allergy Onset Date is required")

            if not payload['recorded_date']:
                raise InvalidTransaction("Allergy Recorded Date is required")

            if not payload['last_occurrence']:
                raise InvalidTransaction("Allergy Last Occurrence is required")

            if not payload['allergy_notes']:
                raise InvalidTransaction("Allergy Notes is required")

            # check for valid values
            if payload['type'] not in AllergyType.__members__:
                raise InvalidTransaction(
                    "Invalid Allergy Type: {}".format(payload['type']))

            if payload['category'] not in AllergyCategory.__members__:
                raise InvalidTransaction(
                    "Invalid Allergy Category: {}".format(payload['category']))

            if payload['criticality'] not in AllergyCriticality.__members__:
                raise InvalidTransaction(
                    "Invalid Allergy Criticality: {}".format(payload['criticality']))

            if payload['severity'] not in AllergySeverity.__members__:
                raise InvalidTransaction(
                    "Invalid Allergy Severity: {}".format(payload['severity']))

            if payload['clinical_status'] not in ClinicalStatus.__members__:
                raise InvalidTransaction(
                    "Invalid Allergy Clinical Status: {}".format(payload['clinical_status']))

            if payload['verification_status'] not in VerificationStatus.__members__:
                raise InvalidTransaction("Invalid Allergy Verification Status: {}".format(
                    payload['verification_status']))

            # set payload properties
            self._patient_id = payload['patient_id']
            self._participant_id = payload['participant_id']
            self._type = payload['type']
            self._category = payload['category']
            self._criticality = payload['criticality']
            self._severity = payload['severity']
            self._clinical_status = payload['clinical_status']
            self._verification_status = payload['verification_status']
            self._onset_date = payload['onset_date']
            self._recorded_date = payload['recorded_date']
            self._last_occurrence = payload['last_occurrence']
            self._allergy_notes = payload['allergy_notes']

    @property
    def patient_id(self):
        return self._patient_id

    @property
    def allergy_id(self):
        return self._allergy_id

    @property
    def participant_id(self):
        return self._participant_id

    @property
    def type(self):
        return self._type

    @property
    def category(self):
        return self._category

    @property
    def criticality(self):
        return self._criticality

    @property
    def severity(self):
        return self._severity

    @property
    def clinical_status(self):
        return self._clinical_status

    @property
    def verification_status(self):
        return self._verification_status

    @property
    def onset_date(self):
        return self._onset_date

    @property
    def recorded_date(self):
        return self._recorded_date

    @property
    def last_occurrence(self):
        return self._last_occurrence

    @property
    def allergy_notes(self):
        return self._allergy_notes

    @property
    def action(self):
        return self._action

    @property
    def is_create(self):
        return self._action == AllergyTransactionAction.CREATE.name

    @property
    def is_update(self):
        return self._action == AllergyTransactionAction.UPDATE.name

    @property
    def is_delete(self):
        return self._action == AllergyTransactionAction.DELETE.name

import json

class Allergy(object):
    def __init__(self):
        pass

    def parse_from_payload(self, payload):
        self._patient_id = payload.patient_id
        self._allergy_id = payload.allergy_id
        self._participant_id = payload.participant_id
        self._type = payload.type
        self._category = payload.category
        self._criticality = payload.criticality
        self._severity = payload.severity
        self._clinical_status = payload.clinical_status
        self._verification_status = payload.verification_status
        self._onset_date = payload.onset_date
        self._recorded_date = payload.recorded_date
        self._last_occurrence = payload.last_occurrence
        self._allergy_notes = payload.allergy_notes

    def parse_from_json(self, jsonString):
        allergy = json.loads(jsonString)
        # print("allergy from json: ", allergy)
        self._patient_id = allergy['patient_id']
        self._allergy_id = allergy['allergy_id']
        self._participant_id = allergy['participant_id']
        self._type = allergy['type']
        self._category = allergy['category']
        self._criticality = allergy['criticality']
        self._severity = allergy['severity']
        self._clinical_status = allergy['clinical_status']
        self._verification_status = allergy['verification_status']
        self._onset_date = allergy['onset_date']
        self._recorded_date = allergy['recorded_date']
        self._last_occurrence = allergy['last_occurrence']
        self._allergy_notes = allergy['allergy_notes']

    def serialize_to_json(self):
        return json.dumps({
            'patient_id': self._patient_id,
            'allergy_id': self._allergy_id,
            'participant_id': self._participant_id,
            'type': self._type,
            'category': self._category,
            'criticality': self._criticality,
            'severity': self._severity,
            'clinical_status': self._clinical_status,
            'verification_status': self._verification_status,
            'onset_date': self._onset_date,
            'recorded_date': self._recorded_date,
            'last_occurrence': self._last_occurrence,
            'allergy_notes': self._allergy_notes
        })

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

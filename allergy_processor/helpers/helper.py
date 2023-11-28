import hashlib

TP_NAME = 'allergy-processor'
TP_FAMILY_VERSION = '1.0'
ALLERGY_REGISTRY_CODE = '01'


def _hash(identifier):
    return hashlib.sha512(identifier.encode('utf-8')).hexdigest()


def get_namespace_prefix():
    return _hash(TP_NAME)[:6]


def makes_addresses(patient_id, allergy_id):
    return make_address_allergy_patient(allergy_id, patient_id), make_address_patient_allergy(patient_id, allergy_id)


def make_address_allergy_patient(allergy_id, patient_id):
    return get_namespace_prefix() + ALLERGY_REGISTRY_CODE + _hash(allergy_id)[:22] + _hash(patient_id)[:40]


def make_address_patient_allergy(patient_id, allergy_id):
    return get_namespace_prefix() + ALLERGY_REGISTRY_CODE + _hash(patient_id)[:22] + _hash(allergy_id)[:40]

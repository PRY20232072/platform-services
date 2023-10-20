import hashlib

TP_NAME = 'allergy-processor'
TP_FAMILY_VERSION = '1.0'

ALLERGY_REGISTRY_CODE = '01'

def get_namespace_prefix():
    return hashlib.sha512(TP_NAME.encode('utf-8')).hexdigest()[:6]

def make_address(name):
    return get_namespace_prefix + ALLERGY_REGISTRY_CODE + hashlib.sha512(name.encode('utf-8')).hexdigest()[:62]
from enum import Enum

class ClinicalStatus (Enum):
    ACTIVE = 1
    INACTIVE = 2
    RESOLVED = 3


class VerificationStatus (Enum):
    UNCONFIRMED = 1
    CONFIRMED = 2
    REFUTED = 3
    ENTERED_IN_ERROR = 4


class AllergyType (Enum):
    ALLERGY = 1
    INTOLERANCE = 2


class AllergyCategory (Enum):
    FOOD = 1
    MEDICATION = 2
    ENVIRONMENT = 3
    BIOLOGIC = 4


class AllergyCriticality (Enum):
    LOW = 1
    HIGH = 2
    UNSABLE_TO_ASSESS = 3


class AllergySeverity (Enum):
    MILD = 1
    MODERATE = 2
    SEVERE = 3


class AllergyTransactionAction (Enum):
    CREATE = 1
    UPDATE = 2
    DELETE = 3
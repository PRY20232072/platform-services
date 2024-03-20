class PractitionerHelper {
    transformPractitionerList(practitionerList) {
        practitionerList.data = practitionerList.data.map((practitioner) => {
            return {
                practitioner_id: practitioner.practitioner_id,
                name_id: practitioner.name_id,
                telephone: practitioner.telephone,
            }
        });

        return practitionerList;
    }

    transformPractitioner(practitioner) {
        practitioner.data = {
            practitioner_id: practitioner.data.practitioner_id,
            name_id: practitioner.data.name_id,
            telephone: practitioner.data.telephone,
        }
        return practitioner;
    }
}

module.exports.PractitionerHelper = PractitionerHelper;
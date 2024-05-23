class AllergyHelper {
    transformRegistryList(registryList) {
        registryList.data = registryList.data.map((registry) => {
            return {
                allergy_id: registry.allergy_id,
                allergy_notes: registry.allergy_notes,
                category: registry.category,
                type: registry.type,
                participant_id: registry.participant_id,
                recorded_date: registry.recorded_date,
                clinical_status: registry.clinical_status
            }
        });

        return registryList;
    }
}

module.exports.AllergyHelper = AllergyHelper;
class FamilyHistoryHelper {
    transformRegistryList(registryList) {
        registryList.data = registryList.data.map((registry) => {
            return {
                familyHistory_id: registry.familyHistory_id,
                name: registry.name,
                relativeBirthdate: registry.relativeBirthdate,
                relationship: registry.relationship,
                clinical_status: registry.clinical_status,
                recorded_date: registry.recorded_date,
            }
        });

        return registryList;
    }
}

module.exports.FamilyHistoryHelper = FamilyHistoryHelper;
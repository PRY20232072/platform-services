const { PractitionerRepositoryImpl } = require("../../practitioner/implementations/PractitionerRepositoryImpl");

class AttentionHelper {
    constructor() {
        this.PractitionerRepository = new PractitionerRepositoryImpl();
    }

    async transformRegistryList(registryList) {
        try {
            registryList.data = await Promise.all(registryList.data.map(async (registry) => {
                const particitpant_id = registry.participant_id;
                const repositoryResponse = await this.PractitionerRepository.getPractitionerById(particitpant_id);
                const practitioner = repositoryResponse.data;

                return {
                    attention_id: registry.attention_id,
                    typeOfAttention: registry.typeOfAttention,
                    nameOfConsultation: registry.nameOfConsultation,
                    practitioner_name: practitioner.name_id,
                    recorded_date: registry.recorded_date,
                }
            }));
            return registryList;
        } catch (error) {
            throw error;
        }
    }
}

module.exports.AttentionHelper = AttentionHelper;
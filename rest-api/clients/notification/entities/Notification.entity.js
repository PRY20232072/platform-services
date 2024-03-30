const EntitySchema = require("typeorm").EntitySchema;

module.exports.Notification = new EntitySchema({
    name: "Notification",
    tableName: "notifications",
    columns: {
        created_at: {
            type: "timestamp",
            createDate: true,
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
        },
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        user_id: { // a quien le llega la notificacion
            type: "text",
        },
        patient_id: { // si no es null, es una notificacion que la ocasiona un paciente
            type: "text",
            nullable: true,
        },
        practitioner_id: { // si no es null, es una notificacion que la ocasiona un profesional de la salud
            type: "text",
            nullable: true,
        },
        register_id: { // si no es null, es una notificacion que la ocasiona un registro
            type: "text",
            nullable: true,
        },
        register_type: { // si no es null, es una notificacion que la ocasiona un registro
            type: "text",
            nullable: true,
        },
        type: { // READ, WRITE, MESSAGE
            type: "text",
        },
        message: { // si el tipo es MESSAGE, este campo tiene el mensaje
            type: "text",
            nullable: true,
        },
        read: {
            type: "boolean",
        },
    },
});

// examples
// {
//     "userId": "1",
//     "practitionerId": "2",
//     "type": "READ",
// }

// {
//     "userId": "2",
//     "patientId": "1",
//     "type": "MESSAGE",
//     "message": "Hello, how are you?"
// }

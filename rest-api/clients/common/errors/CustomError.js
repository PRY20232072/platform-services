class CustomError extends Error {
    constructor(newMessage, currentMessage = [], status = 500) {
        super(newMessage);

        this.status = status;
        if (currentMessage !== null && currentMessage !== undefined && currentMessage !== "") {
            this.message = [].concat(newMessage, currentMessage);
        } else {
            this.message = newMessage;
        }
    }
}

module.exports.CustomError = CustomError;

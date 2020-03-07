const transformSchema = schema => {
    schema.set('toJSON', {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    });
    return schema;
}

module.exports = transformSchema;
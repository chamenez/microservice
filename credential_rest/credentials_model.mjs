import mongoose from 'mongoose';

mongoose.connect(
    'mongodb://localhost:27017/credentials_db',
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose!');
});

const credentialSchema = mongoose.Schema({
    email: { type: String, required: true },
    number: { type: Number, required: true }
});

const Credential = mongoose.model("Credential", credentialSchema);

/**
 * @param {String} email
 * @param {Number} number
 * @returns 
 */
const createCredential = async (email, number) => {
    const credential = new Credential({ email: email, number: number });
    return credential.save();
}

/**
 * @param {Object} filter 
 * @param {String} projection 
 * @param {Number} limit 
 * @returns 
 */
const findCredentials = async (filter, projection, limit) => {
    const query = Credential.find(filter)
        .select(projection)
        .limit(limit);
    return query.exec();
}

/**
 * @param {String} _id 
 * @param {String} email
 * @param {Number} number 
 * @returns
 */

const replaceCredential = async (_id, email, number) => {
    const result = await Credential.updateOne({ _id: _id },
        { email: email, number: number });
        if(result.modifiedCount === 0) {
            throw new Error ('not found')
        }
    return result.modifiedCount;
}

/**
 * @param {String} _id
 * @param {String} email
 * @param {Number} number 
 * @returns
 */

const deleteByMany = async (_id, email, number) => {
    let filter = { _id: _id, email: email, number: number }
    for (let property in filter) {
        if (filter[property] === undefined) {
            delete filter[property]
        }
    }
    const result = await Credential.deleteMany(filter);
    return result.deletedCount;
}

export { createCredential, findCredentials, replaceCredential, deleteByMany };
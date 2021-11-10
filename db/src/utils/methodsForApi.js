import mongoose from 'mongoose';

const objectId = mongoose.Types.ObjectId;

const stringToObjectId = (id) => objectId(id);
const objectIdToString = (str) => (objectId.isValid(str) ? str.toString() : null);

export { stringToObjectId, objectIdToString };

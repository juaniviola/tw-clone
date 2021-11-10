import mongoose from 'mongoose';
import { objectIdToString, stringToObjectId } from '../../src/utils/methodsForApi';

describe('methods to export in api', () => {
  const id = '618c32765cb6cbed6e0fa120';

  it('objectIdToString() --> it should return string', () => {
    const objectId = mongoose.Types.ObjectId(id);
    const strId = objectIdToString(objectId);

    expect(typeof strId).toEqual('string');
    expect(strId).toEqual(id);
  });

  it('stringToObjectId() --> it should return ObjectId', () => {
    const objectId = stringToObjectId(id);

    expect(mongoose.Types.ObjectId.isValid(objectId)).toBeTruthy();
  });
});

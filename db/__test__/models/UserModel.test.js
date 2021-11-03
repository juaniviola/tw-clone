import 'core-js/stable';
import 'regenerator-runtime/runtime';
import User from '../../src/models/User';

describe('User database model', () => {
  const mockUser = new User({
    id: '123',
    username: 'foobar',
    password: 'foobar',
    fullName: 'foo bar',
    email: 'foobar-email.com',
  });

  it('it should return error with empty user', async () => {
    const newUser = new User();
    let err = null;

    try {
      await newUser.validate();
    } catch (error) {
      err = error;
    }

    expect(err.errors.username).toBeTruthy();
    expect(err.errors.email).toBeTruthy();
    expect(err.errors.fullName).toBeTruthy();
    expect(err.errors.password).toBeTruthy();
  });

  it('it should return error with invalid email', async () => {
    let err = null;

    try {
      await mockUser.validate();
    } catch (error) {
      err = error;
    }

    expect(err.errors.email).toBeTruthy();
  });

  it('it should return error with password length less than 8', async () => {
    let err = null;

    try {
      await mockUser.validate();
    } catch (error) {
      err = error;
    }

    expect(err.errors.password).toBeTruthy();
  });

  it('it should not return error with valid user', async () => {
    const userMock = new User({
      id: '123',
      username: 'foobar',
      password: 'foobarbuzz',
      fullName: 'foo bar',
      email: 'foobar@email.com',
    });
    let err = null;

    try {
      await userMock.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeFalsy();
  });
});

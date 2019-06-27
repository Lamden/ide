
const API = require('../contracting_api');
import "isomorphic-fetch"

jest.setTimeout(100000)

describe('API ENDPOINT /', () => {

    it('returns \'indeed\'', () => {
        expect.assertions(1);
        return API.apicheck('https://contracting.lamden.io:443').then(data => expect(data).toEqual('indeed'));
    });

    it('catches URL hostname errors', () => {
        expect.assertions(1);
        return API.apicheck('https://contractingtest.lamden.io:443')
        .catch(err => expect(err.name).toEqual('FetchError'));
    });

    it('catches URL port errors', () => {
        expect.assertions(1);
        return API.apicheck('https://contracting.lamden.io:442')
        .catch(err => expect(err.name).toEqual('FetchError'));
    });

    it('catches non https URL errors', () => {
        expect.assertions(1);
        return API.apicheck('http://contracting.lamden.io:443')
        .catch(err => expect(err.name).toEqual('FetchError'));
    });
});


const assert = require('assert');
const app = require('../app.js');

describe('Winner', function() {
    describe('#calculateWinner()', function() {
      it('should return null, X, or O', function() {
        assert.strictEqual(app.calculateWinner([null, null, null, null, null, null, null, null, null]), null);
        assert.strictEqual(app.calculateWinner(['X', 'X', 'X', null, null, null, null, null, null]), 'X');
        assert.strictEqual(app.calculateWinner(['X', 'X', 'O','O', 'X', 'X','X', 'O', 'O']), null);
      });
    });
});
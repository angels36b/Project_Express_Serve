const test = require('node:test');
const assert = require('node:assert/strict');
const {validateCreateTask, validateUpdateTask, validateUuid } = require('../validators/taskValidator');
const { title } = require('node:process');

test('validateCreateTask accepts valid title and runId', ()=> {
    const res = validateCreateTask({title: ' Learn Node ', runId: 'run_01'});
    assert.deepEqual(res,{value: {title: 'Learn Node', runId: 'run_01'}});

});

test('validateCreateTask rejects extra fields with error', () => {
    const res = validateCreateTask({title: 'Task', runId: 'run_01', ownerLogin: 'hacker'})
    assert.ok(res.error);
}); 

test('validateUpdateTask rejects string "true" for boolean done', ()=>{
    const res = validateUpdateTask({done: 'true'});
    assert.equal(res.error, 'done must be a boolean');
});

test('validateUuid catches malformed IDs before hitting PostgreSQL', () => {
    assert.ok(validateUuid('12345'));
    assert.equal(validateUuid('550e8400-e29b-41d4-a716-446655440000'), null);
});
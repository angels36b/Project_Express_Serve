const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RUN_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

function isPlainObject(value){
    return typeof value === 'object' && value !== null && !Array.isArray(value);

}

function validateUuid(id){

    if (typeof id !== 'string' || !UUID_REGEX.test(id)) {
    return 'Invalid task UUID';
  }
  return null;
}
function validateRunId(runId){
    if (typeof runId !== 'string' || !RUN_ID_REGEX.test(runId)){
        return 'runId must be 1-64 characters matching [A-Za-z0-9_-]';
    }
    return null;
}

function validateTitle(title) {
  if (typeof title !== 'string') {
    return 'title must be a string';
  }
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 200) {
    return 'title must be between 1 and 200 characters after trim';
  }
  return null;
}

function validateCreateTask(body) {
  if (!isPlainObject(body)) {
    return { error: 'Request body must be a JSON object' };
  }

const keys = Object.keys(body);
  const allowedKeys = ['title', 'runId'];

  if (keys.length !== 2 || !keys.every((k) => allowedKeys.includes(k))) {
    return { error: 'POST body must contain only title and runId' };
  }

  const titleError = validateTitle(body.title);
  if (titleError) return { error: titleError };

  const runIdError = validateRunId(body.runId);
  if (runIdError) return { error: runIdError };

  return {
    value: {
      title: body.title.trim(),
      runId: body.runId
    }
  };
}

function validateUpdateTask(body){
    if(!isPlainObject(body)){
        return {error: 'Request body must be a JSON object'};
    }
    const keys = Object.keys(body)
    const allowedkeys = ['title', 'done'];

    if (keys.length === 0 || !keys.every((k) => allowedkeys.includes(k))){
        return { error: 'PATCH body must be non-empty and contain only title and/or done'};

    }
    const updates = {};

    if('title' in body){
        const titleError = validateTitle(body.title);
        if (titleError) return {error: titleError};
        updates.title = body.title.trim();
    }
    if ('done' in body){
        if (typeof body.done !== 'boolean'){
            return {error: 'done must be a boolean'};
        }
        updates.done = body.done;
    }
    return {value:updates};
}
module.exports = {
    validateUuid,
    validateRunId,
    validateCreateTask,
    validateUpdateTask
}
function setNestedValue(obj, keys, value) {
  let current = obj;
    
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

function applyInternal(obj) {
  debugger;
  function apply(form, internal) {
    if (typeof form === 'undefined' || typeof internal === 'undefined') {
      return;
    }
    Object.keys(internal).forEach((key) => {
      switch (internal[key]) {
        case 'null':
          if (!form[key]) {
            form[key] = null;
          }
          return;
        case 'array':
          if (!form[key]) {
            form[key] = [];
          }
          return;
        case 'object':
          if (!form[key]) {
            form[key] = {};
          }
          return;
        // TODO: file
      }
      form[key] ??= {};
      apply(form[key], internal[key]);
    })
  }
  apply(obj.form, obj._apie);
}
  
function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const queryObject = {};
 
  params.forEach((value, key) => {
    // Split key by brackets, and remove any empty entries
    const keys = key.split(/\[|\]/).filter(Boolean);
    
    // Set the nested value
    setNestedValue(queryObject, keys, value);
  });
  
  return queryObject;
}
  
  // Usage:
  const queryString = window.location.search;
  const hydratedObject = parseQueryString(queryString);
  applyInternal(hydratedObject)
  // Log the resulting object
  console.log(hydratedObject);
  const elm = document.querySelector('apie-form');
  if (hydratedObject._internal) {
    elm.internalState = hydratedObject._internal;
  }
  if (hydratedObject.form) {
    elm.value = hydratedObject.form;
  }
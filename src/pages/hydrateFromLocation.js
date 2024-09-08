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
  
  // Log the resulting object
  console.log(hydratedObject);
  const elm = document.querySelector('apie-form');
  if (hydratedObject._internal) {
    elm.internalState = hydratedObject._internal;
  }
  if (hydratedObject.form) {
    elm.value = hydratedObject.form;
  }
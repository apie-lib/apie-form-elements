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
  function apply(form, internal) {
    if (typeof form === 'undefined' || typeof internal === 'undefined') {
      return;
    }
    Object.keys(internal).forEach((key) => {
      if (typeof internal[key] === 'object') {
        form[key] ??= {};
        apply(form[key], internal[key]);
        return;
      }
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
        case 'Psr\\Http\\Message\\UploadedFileInterface':
          const byteCharacters = atob(form[key].base64);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          
          const blob = new Blob([byteArray]);
          
          form[key] = new File([blob], form[key].originalFilename, { type: 'text/plain' });
          return;
        default:
          console.log('Unknown internal key', internal[key])
          return;
      }
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
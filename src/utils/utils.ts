export function waitFor(callback: () => boolean, interval: number = 100): Promise<void>
{
  return new Promise((resolve) => {
    const id = setInterval(() => {
      if (callback()) {
        resolve();
        clearInterval(id);
      }
    }, interval);
  });
}

interface HTMLElementWithNameAndValue extends HTMLElement {
  name: string;
  value: any;
}

export class FormNameSplit
{
  [Symbol.split](input: string): string[] {
    const result = [];
    while (input.length > 0) {
      if (input.charAt(0) === '[') {
        const endIndexOf = input.indexOf(']');
        if (endIndexOf === -1) {
          result.push(input.substring(1));
          input = '';
        } else {
          result.push(input.substring(1, endIndexOf));
          input = input.substring(endIndexOf + 1);
        }
      } else {
        const startIndexOf = input.indexOf('[');
        if (startIndexOf === -1) {
          result.push(input);
          input = '';
        } else {
          result.push(input.substring(0, startIndexOf));
          input = input.substring(startIndexOf);
        }
      }
    }
    return result;
  }
}

export function applyEventTarget(namePrefix: string, inputValue: any, target: HTMLElementWithNameAndValue): any
{
  if (!target.name.startsWith(namePrefix)) {
    return inputValue;
  }

  const keys = target.name.substring(namePrefix.length).split(new FormNameSplit());
  if (keys.length === 0) {
    return target.value;
  }
  if (inputValue === null) {
    inputValue = target.value;
  }
  let key;
  let ptr = inputValue;
  for(ptr=inputValue;keys.length > 0;) {
    key = keys.shift()
    if (!Object.hasOwnProperty.call(ptr, key) || ptr[key] === undefined || ptr[key] === null) {
      ptr[key] = {}
    }
    if (keys.length === 0) {
      ptr[key] = target.value;
    }
    ptr = ptr[key];
  }
  return inputValue;
}
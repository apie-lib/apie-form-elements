export * from './validation-errors';

export const APIE_FORM_CONTROLLER = Symbol('APIE_FORM_CONTROLLER');
export const APIE_CONSTRAINT = Symbol('APIE_CONSTRAINT');

export interface Option {
  name: string;
  value: string|Record<string, any>|File;
}

export interface ChangeEvent extends Option {
  force?: boolean;
}

export interface FileData {
  base64: string;
  originalFilename: string;
}


export interface ApieFormElement extends HTMLElement {
  name: string;
  value: any;
  apie: typeof APIE_FORM_CONTROLLER;
  onTriggerChange: (ev: ChangeEvent) => void|any;
  internalState: any;
}

export interface ApieConstraintElement extends HTMLElement {
  name: string;
  value: any;
  apie: typeof APIE_CONSTRAINT;
}

export interface ValidationError {
  '': string;
  [key: string]: string | ValidationError;
}

export function isApieFormElement(el: HTMLElement): el is ApieFormElement
{
  return (el as any).apie === APIE_FORM_CONTROLLER;
}

export function isApieConstraint(el: HTMLElement): el is ApieConstraintElement
{
  return (el as any).apie === APIE_CONSTRAINT;
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

export function loadTemplate(templateId: string): string {
  const templateElm = document.querySelector('#' + templateId);
  const divElement = document.createElement('div');
  divElement.appendChild(templateElm.cloneNode(true));
  var el = document.createElement('div');
  return String(templateElm.innerHTML).replace(/\&[#0-9a-z]+;/gi, function (enc) {
    el.innerHTML = enc;
    return el.innerText
  });
}

export function missingValidationErrors(validationErrors: ValidationError, foundIds: string[], prefix: string = ''): ChangeEvent[]{
  const tmp = new Set(foundIds);
  const result: ChangeEvent[] = [];
  Object.keys(validationErrors).filter((key: string) => !tmp.has(key))
    .map((key: string) => {
      if (typeof validationErrors[key] === 'string') {
        result.push({name: prefix + key, value: validationErrors[key]})
      } else {
        if (validationErrors[key]['']) {
          result.push({name: prefix + key, value: validationErrors[key]})
        }
        result.push(...missingValidationErrors(validationErrors[key] as ValidationError, [''], prefix + key + '.'));
      }
    });

  return result;
}

export function toFileList(f: string|number|File): FileList {
  const dataTransfer = new DataTransfer();
  if (f instanceof File) {
    dataTransfer.items.add(f);
  }
  return dataTransfer.files;
}

export function toEmptyFileList(): FileList {
  const dataTransfer = new DataTransfer();
  return dataTransfer.files;
}

export function toString(value: boolean|string|File|null|number|undefined): string {
  if (value === true) {
    return 'on';
  }
  if (!value && value !== 0) {
    return '';
  }
  if (value instanceof File) {
    return value.name;
  }
  return String(value);
}

export function toArray(value: Record<any, any>|Array<any>|boolean|string|File|null|number|undefined): Array<any> {
  if (value === undefined || value === null || value instanceof File || typeof value === 'string' || typeof value === 'number' || value === true || value === false) {
    return [];
  }
  if (typeof value === 'object' && Object.hasOwnProperty.call(value, 0)) {
    const result = [];
    for (let counter =0; Object.hasOwnProperty.call(value, counter); counter++) {
      result.push(value[counter]);
    }
    return result;
  }

  return Array.from(value as any);
}

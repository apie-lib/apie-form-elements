import { Option } from './RenderInfo';

export interface ChangeEvent extends Option {
  force?: boolean;
}

export interface FileData {
  base64: string;
  originalFilename: string;
}

export function isFileData(f: any): f is FileData {
  return f !== null && typeof f === 'object' && f.originalFilename && f.base64;
}

export function toFile(f: FileData): File
{
  const byteCharacters = atob(f.base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  
  const blob = new Blob([byteArray]);
  
  return new File([blob], f.originalFilename, { type: 'text/plain' });
}

export function toFileList(f: string|number|File|FileData): FileList {
  const dataTransfer = new DataTransfer();
  if (isFileData(f)) {
    f = toFile(f);
  }
  if (f instanceof File) {
    dataTransfer.items.add(f);
  }
  return dataTransfer.files;
}

export function toEmptyFileList(): FileList {
  const dataTransfer = new DataTransfer();
  return dataTransfer.files;
}

export function toString(value: boolean|string|File|null|number|undefined|Set<any>): string {
  if (value instanceof Set) {
    return Array.from(value).map((v: any) => toString(v)).join(', ');
  }
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

export function clone(value: any): any{
  if (value === null) {
    return null;
  }
  if (typeof value !== 'object' || value instanceof File) {
    return value;
  }
  if (Array.isArray(value)) {
    const newArray = [];
    for (let i = 0; i < value.length; i++) {
      newArray[i] = clone(value[i]);
    }
    return newArray;
  }
  const newObject = {};
  Object.keys(value).forEach((key: string) => {
    newObject[key] = clone(value[key]);
  });
  return newObject;
}

export interface ConstraintCheck {
  inverseCheck: boolean;
  exactMatch: any;
  message: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export function createErrorMessage(constraint: ConstraintCheck, value: any): string|null {
  const $testFn = constraint.inverseCheck ? (r) => !r : (r) => Boolean(r);
  const isSingleMessage = typeof constraint.message === 'string';
  const messages = isSingleMessage ? [constraint.message] : [];
  if (!isSingleMessage) {
    Object.entries(constraint.message).forEach(([_key, value]) => {
      messages.push(value);
    });
  }
  if ($testFn(constraint.exactMatch === value)) {
    return messages.length > 0 ? messages.join("\n") : null;
  }
  if (constraint.pattern && $testFn(!new RegExp(constraint.pattern).test(toString(value)))) {
    return messages.length > 0 ? messages.join("\n") : null;
  }
  return null;
}

export function findInShadowDoms(selector: string, element: HTMLElement|ShadowRoot|Element = document.body) {
  const found = element?.querySelector(selector);
  if (found) {
    return found;
  }
  
  if ('shadowRoot' in element) {
    const shadow = element.shadowRoot;
    if (shadow) {
      const found = findInShadowDoms(selector, shadow);
      if (found) {
        return found;
      }
    }
  }
  for (let i = 0; i < (element?.children?.length ?? 0); i++) {
    const child = element.children[i];
    const found = findInShadowDoms(selector, child);
    if (found) {
      return found;
    }
  }
  return null;
}
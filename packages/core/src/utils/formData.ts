import { isObject } from '../../../shared/src';
import { isFile, isFileOrBlob, isNullOrUndefined } from './common';

export function appendToFormData(jsonObject: Record<string, unknown>, formData: FormData, parentKey = ''): FormData {
  for (const key in jsonObject) {
    if (!Object.prototype.hasOwnProperty.call(jsonObject, key)) {
      continue;
    }

    const value = jsonObject[key];
    const newKey = parentKey ? `${parentKey}[${key}]` : key;

    if (isFileOrBlob(value)) {
      formData.append(newKey, value, isFile(value) ? value.name : undefined);
      continue;
    }

    if (isNullOrUndefined(value)) {
      // Treat nulls as empty strings
      // There might be people who prefer to omit the key entirely, but this is a safer approach
      // Since BE frameworks do convert empty strings to nulls
      formData.append(newKey, '');
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        appendToFormData({ [`${newKey}[${index}]`]: item }, formData);
      });
      continue;
    }

    if (isObject(value) && !(value instanceof File)) {
      appendToFormData(value, formData, newKey);
      continue;
    }

    formData.append(newKey, String(value));
  }

  return formData;
}

export function clearFormData(formData: FormData): FormData {
  formData.forEach((_, key) => {
    formData.delete(key);
  });

  return formData;
}

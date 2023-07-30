import { useCallback } from 'react';
import type { RefObject } from 'react';

interface UseFormParams {
  formRef: RefObject<HTMLFormElement>;
  gFormId: string;
  links: {
    entryId: string | number;
    formId: string;
  }[];
  extraEntries?: {
    entryId: string | number;
    value: string;
  }[];
}
export type { UseFormParams };
export default function useForm(param: UseFormParams) {
  const { formRef, gFormId, links, extraEntries = [] } = param;
  const googleCallback = useCallback(() => {
    let url = 'https://docs.google.com/forms/d/' + gFormId + '/formResponse?';
    if (formRef.current) {
      links.forEach((link, index) => {
        const value =
          (formRef.current?.querySelector(`#${link.formId}`) as HTMLInputElement)
            ?.value ?? '';
        url += 'entry.' + link.entryId + '=' + encodeURIComponent(value);
        if (index !== links.length - 1) {
          url += '&';
        }
      });
      extraEntries.forEach((entry) => {
        url += `&entry.${entry.entryId}=${encodeURIComponent(entry.value)}`;
      });
    }
    try {
      //   axios.post(url).catch(() => {});
      fetch(url, {
        method: 'POST',
      }).catch(() => {});
    } catch {
      // catch
    }
  }, []);
  return googleCallback;
}

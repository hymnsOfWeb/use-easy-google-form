import { useCallback } from 'react';
import type { FormEvent, RefObject } from 'react';

interface UseFormParams {
  formRef: RefObject<HTMLFormElement>;
  gFormId: string;
  links: {
    entryId: string | number;
    formId: string;
    type: 'text' | 'textarea' | 'radio';
  }[];
  extraEntries?: {
    entryId: string | number;
    value: string;
  }[];
}
export type { UseFormParams };
export default function useForm(param: UseFormParams) {
  const { formRef, gFormId, links, extraEntries = [] } = param;
  const googleCallback = useCallback(
    (e: FormEvent<HTMLFormElement> | undefined = undefined) => {
      if (e) {
        e?.preventDefault?.();
      }
      let url = 'https://docs.google.com/forms/d/' + gFormId + '/formResponse?';
      if (formRef.current) {
        links.forEach((link, index) => {
          if (link.type !== 'radio') {
            const value =
              (formRef.current?.querySelector(`#${link.formId}`) as HTMLInputElement)
                ?.value ?? '';
            url += 'entry.' + link.entryId + '=' + encodeURIComponent(value);
          } else {
            const containerDiv = formRef.current?.querySelector(
              `#${link.formId}`,
            ) as HTMLDivElement;
            const value =
              (containerDiv.querySelector('input:checked') as HTMLInputElement)
                ?.value ?? '';
            url += 'entry.' + link.entryId + '=' + encodeURIComponent(value);
          }
          if (index !== links.length - 1) {
            url += '&';
          }
        });
        extraEntries.forEach((entry) => {
          url += `&entry.${entry.entryId}=${encodeURIComponent(entry.value)}`;
        });
      }
      try {
        fetch(url, {
          method: 'POST',
        }).catch(() => {});
      } catch {
        // nothing here
      }
    },
    [],
  );
  return googleCallback;
}

import { useCallback } from "react";
import type { FormEvent, RefObject } from "react";

// interface EntryType {
//   type: 'text' | 'radio' | 'textarea' | 'checkbox' | 'date' | 'dropdown' | 'time';
//   entry: string;
//   question?: string;
//   values?: { text: string; value: string }[];
//   dateParts?: ('year' | 'month' | 'day')[];
//   timeParts?: ('hour' | 'minute' | 'second')[];
// }

interface UseFormParams {
  formRef: RefObject<HTMLFormElement>;
  gFormId: string;
  links: {
    entryId: string;
    formId: string;
    type: "text" | "radio" | "textarea" | "checkbox" | "date" | "dropdown" | "time";
  }[];
  extraEntries?: {
    entryId: string;
    value: string;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitExtra?: (..._: any) => any;
}
export type { UseFormParams };

const valueToUrl = (value: string) => encodeURIComponent(value);

const getTextValueFromForm = (formElem: HTMLFormElement, inputId: string) => {
  const input = formElem?.querySelector(`#${inputId}`) as HTMLInputElement;
  if (input?.value) {
    return valueToUrl(input.value);
  }
  return "";
};
const getRadioValueFromForm = (formElem: HTMLFormElement, inputId: string) => {
  const containerElem = formElem?.querySelector(`#${inputId}`) as HTMLDivElement;
  const input = containerElem?.querySelector("input:checked") as HTMLInputElement;
  if (input?.value) {
    return valueToUrl(input.value);
  }
  return "";
};
const getCheckboxValuesFromForm = (formElem: HTMLFormElement, inputId: string) => {
  const containerElem = formElem?.querySelector(`#${inputId}`) as HTMLDivElement;
  const inputs = Array.from(
    containerElem?.querySelectorAll("input:checked") ?? [],
  ) as HTMLInputElement[];
  const values: string[] = [];
  for (const input of inputs) {
    if (input?.value) {
      values.push(valueToUrl(input.value));
    }
  }
  return values;
};
const getDropdownValueFromForm = (formElem: HTMLFormElement, inputId: string) => {
  const input = formElem?.querySelector(`select#${inputId}`) as HTMLSelectElement;
  if (input?.value) {
    return valueToUrl(input.value);
  }
  return "";
};
const getDateValuesFromForm = (formElem: HTMLFormElement, inputId: string) => {
  const containerElem = formElem?.querySelector(`#${inputId}`) as HTMLDivElement;
  const yearInput = containerElem?.querySelector(
    "input[name='year']",
  ) as HTMLInputElement;
  const monthInput = containerElem?.querySelector(
    "input[name='month']",
  ) as HTMLInputElement;
  const dayInput = containerElem?.querySelector(
    "input[name='day']",
  ) as HTMLInputElement;
  const values: {
    year?: string;
    month?: string;
    day?: string;
  } = {};
  if (yearInput?.value) {
    values.year = yearInput.value;
  }
  if (monthInput?.value) {
    values.month = monthInput.value;
  }
  if (dayInput?.value) {
    values.day = dayInput.value;
  }
  return values;
};
const getTimeValuesFromForm = (formElem: HTMLFormElement, inputId: string) => {
  const containerElem = formElem?.querySelector(`#${inputId}`) as HTMLDivElement;
  const hourInput = containerElem?.querySelector(
    "input[name='hour']",
  ) as HTMLInputElement;
  const minuteInput = containerElem?.querySelector(
    "input[name='minute']",
  ) as HTMLInputElement;
  const secondInput = containerElem?.querySelector(
    "input[name='second']",
  ) as HTMLInputElement;
  const values: {
    hour?: string;
    minute?: string;
    second?: string;
  } = {};
  if (hourInput?.value) {
    values.hour = hourInput.value;
  }
  if (minuteInput?.value) {
    values.minute = minuteInput.value;
  }
  if (secondInput?.value) {
    values.second = secondInput.value;
  }
  return values;
};
const urlPart = ({
  entryId,
  value,
  entryIdSuffix = "",
}: {
  entryId: string;
  value: string;
  entryIdSuffix?: string;
}) => entryId + entryIdSuffix + "=" + value + "&";

export default function useForm(param: UseFormParams) {
  const { formRef, gFormId, links, extraEntries = [], onSubmitExtra } = param;
  const googleCallback = useCallback(
    (e: FormEvent<HTMLFormElement> | undefined = undefined) => {
      if (e) {
        e?.preventDefault?.();
      }
      let url = "https://docs.google.com/forms/d/" + gFormId + "/formResponse?";
      if (formRef.current) {
        const form = formRef.current;
        for (let index = 0; index < links.length; index++) {
          const link = links[index];
          const { entryId, formId, type } = link;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let value: any;
          let values: string[];
          switch (type) {
            case "text":
            case "textarea":
              value = getTextValueFromForm(form, formId);
              url += urlPart({ entryId, value });
              break;
            case "radio":
              value = getRadioValueFromForm(form, formId);
              url += urlPart({ entryId, value });
              break;
            case "checkbox":
              values = getCheckboxValuesFromForm(form, formId);
              for (const value of values) {
                url += urlPart({ entryId, value });
              }
              break;
            case "dropdown":
              value = getDropdownValueFromForm(form, formId);
              url += urlPart({ entryId, value });
              break;
            case "date":
              value = getDateValuesFromForm(form, formId);
              for (const temp of Object.keys(value)) {
                url += urlPart({
                  entryId,
                  value: value[temp],
                  entryIdSuffix: `_${temp}`,
                });
              }
              break;
            case "time":
              value = getTimeValuesFromForm(form, formId);
              for (const temp of Object.keys(value)) {
                url += urlPart({
                  entryId,
                  value: value[temp],
                  entryIdSuffix: `_${temp}`,
                });
              }
              break;
          }
        }
        extraEntries.forEach((entry) => {
          url += `&${entry.entryId}=${encodeURIComponent(entry.value)}`;
        });
      }
      try {
        fetch(url, {
          method: "POST",
        }).catch(() => {});
      } catch {
        // nothing here
      }
      if (onSubmitExtra) {
        onSubmitExtra();
      }
    },
    [],
  );
  return googleCallback;
}

# Easy Google Form React Hook

## Great to have ( If you want to make your life easier )
  [Click here](https://github.com/hymnsOfWeb/useEasyGoogleForm-extension) and download the extension present there. If this extension is installed, it'll automatically create a react form component in your google forms web page, you just have to copy paste hehe ;)

## FYI
  This hook still don't support the following question types in google form:
  - File upload
  - Grid
  - Scale

## Installation
  Run ```npm install @hymns-of-web/use-easy-google-form``` or ```yarn add @hymns-of-web/use-easy-google-form``` to install the package.  

## Usage

> I recommend you to use the extension mentioned above, and then modify the code if needed. But in case you want the satan to worship you and do stuff manually, follow the steps below.

  1. Create a google form and add questions to it.
  2. Click on the three dots on the top right corner of the form and click on "Get pre-filled link".
  3. Inspect and find input elements with name attribute's value starting with *entry.* for each question. (refer [this website](https://theconfuzedsourcecode.wordpress.com/2019/11/10/lets-auto-fill-google-forms-with-url-parameters/))
  4. Get the id of the google form from the url.
  5. Create a react component and import the hook.
  6. To use the hook, you need to pass in 3 mandatory parameters:
      - gFormId: The id of the form (from step 4).
      - formRef: The ref of the form element.
      - links: Now this is a bit tricky. Links must be an array of objects, where each object must have entryId, formId and type. The entryId is the name value of the input in google form prefil page (step 3), the formId is the id of the element in your own react form (step 7). The type is the type of the input element in your react form. The type can be one of the following:
        - text
        - radio
        - textarea
        - checkbox
        - date
        - dropdown
        - time
  7. The element to which you will be giving an id to pass in to the form id in the above step varies depending on the type. Please refer the following table for the same:
      | **type**     | **element**                                        | **description**                                                                                                                                                                                                                                                                                                                                                                                                                                              |
      |----------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
      | text     | input                                          | The hook will look for #<input_id>.value                                                                                                                                                                                                                                                                                                                                                                                                             |
      | textarea | textarea                                       | The hook will look for #<textarea_id>.value                                                                                                                                                                                                                                                                                                                                                                                                          |
      | radio    | Container type elements(div, section, etc) | The hook will look for input:checked selector inside the container.                                                                                                                                                                                                                                                                                                                                                                              |
      | checkbox | Container type elements(div, section, etc) | The hook will look for input:checked selector inside the container.                                                                                                                                                                                                                                                                                                                                                                              |
      | dropdown | select                                         | The hook will look for #<select_id>.value                                                                                                                                                                                                                                                                                                                                                                                                            |
      | date     | Container type elements(div, section, etc) | Must have different input elements for different date parts inside the container. The type must be string or number for each input element. The inputs must be distinguished via name attribute with the values: day, month and year. You can ignore year input IF you don't have year in your google form input. Months start from index 1.The hook will look for input[name=<day, month and year>] |
      | time     | Container type elements(div, section, etc) | Almost same as date but instead of day, month and year, you have to keep hours, minutes and seconds (seconds only if you have selected duration rather than time in your google form).The time must be in 24-hour format.                                                                                                                                                                                                               |
  8. The hook returns an onSubmit function which you can pass to the onSubmit prop of the form element. 
  9. There are 2 optional parameters that you can pass to the hook:
      - onSubmitExtra: A callback function that will be called when the logic of the hook is done. 
      - extraEntries: An array of objects, where each object must have entryId and value. The entryId is the name value of the input in google form prefil page (step 3), the value is the value that you want to pass to the google form. This is useful when you want to pass some extra data to the google form that is not present in your react form.
  10. You can see an example at: [Github](https://github.com/hymnsOfWeb/example-use-easy-google-form/blob/main/components/form.tsx) & [Live Link](https://hymnsofweb.github.io/example-use-easy-google-form/)
import { Event, EventEmitter } from '../../stencil-public-runtime';
import { FormValues, FormTouched, FormErrors, FormSubmit, FormRequired } from './form-declaration';
export declare class Form {
  el: any;
  private controls;
  private fields;
  /**
   * Initial field values of the form. It is an object with keys pointing to field name
   */
  initialValues?: any;
  /** Validate the form's values with an async function.
   * Should return a Promise which resolves to an errors object.
   * The keys in the errors object must match with the field names.
   */
  validate?: any;
  /**
   * Schema to render Dynamic Form. Contains an array of fields pointing to each form control.
   * Please see the usage reference for examples.
   */
  formSchema?: any;
  /**
   * YUP based validation schema for handling validation
   */
  validationSchema?: any;
  /** Tells Form to validate the form on each input's onInput event */
  validateOnInput?: boolean;
  /** Tells Form to validate the form on each input's onBlur event */
  validateOnBlur?: boolean;
  /** The number of milliseconds to delay before doing validation on Input */
  wait: number;
  /**
   * Id to uniquely identify the Form. If not set, a random Id will be generated.
   */
  formId: any;
  /**
   * Mapper Type - LEGO | FORMSERV | CUSTOM.
   * Defaults to `LEGO`.
   */
  mapperType: 'LEGO' | 'FORMSERV' | 'CUSTOM';
  /**
   * A custom type mapper object that maps the type of your fields in the schema to the Internal Field Types.
   * Internal Field Types are `TEXT`, `DROPDOWN`, `EMAIL` etc.
   * In the example below, `1` is the type of a field in your schema
   * that needs to correspond to `TEXT` type.
   * Please pass include the mapper for all the field types that you want to support.
   * Example typeMapper object : {
          'CUSTOM_TEXT': { type: 'TEXT' },
          'SELECT': { type: 'DROPDOWN' },
          'TEL': { type: 'PHONE_NUMBER' },
          'CHECKBOX': { type: 'CHECKBOX' },
          'TEXTAREA': { type: 'PARAGRAPH' },
          'DATETIME': { type: 'DATE_TIME' },
          'INTEGER': { type: 'NUMBER' },
        }
   */
  customTypeMapper: any;
  values: FormValues;
  touched: FormTouched<FormValues>;
  errors: FormErrors<FormValues>;
  formValidationSchema: any;
  formInitialValues: any;
  formSchemaState: any;
  hasSlot: boolean;
  fieldSearchText: any;
  /**
   * fwFormValuesChanged - event that gets emitted when values change.
   */
  fwFormValuesChanged: EventEmitter;
  /**
   * fwFormValueChanged - event that gets emitted when value in a form field changes.
   */
  fwFormValueChanged: EventEmitter;
  private debouncedHandleInput;
  private handleInputListener;
  private handleBlurListener;
  private handleChangeListener;
  private prevValues;
  componentWillLoad(): Promise<void>;
  schemaPropsChangeHandler(): Promise<void>;
  initialValuesHandler(initialValues: any): Promise<void>;
  valuesChangeHandler(values: any): void;
  handleSchemaPropsChange(): Promise<void>;
  handleFormSchemaAndInitialValuesChange(formSchema: any, initialValues: any): Promise<void>;
  componentDidLoad(): void;
  componentWillUpdate(): void;
  handleSlotChange(): void;
  disconnectedCallback(): void;
  handleSubmit: (event: Event) => Promise<FormSubmit>;
  handleReset: (event?: Event) => Promise<void>;
  handleValidation: () => Promise<void>;
  handleInput: (event: Event) => Promise<void>;
  handleBlur: (event: Event) => Promise<void>;
  setFocus: (field: any) => void;
  setFocusOnError: () => void;
  private getFormControls;
  private passPropsToChildren;
  private passPropsToChild;
  private composedUtils;
  private shouldRenderFormControl;
  private getFormSchemaFromSlots;
  /** Return if a field is disabled or not
   * if `editable` property is set to `false` in the field object of the form schema,
   * then the field is considered to be disabled.
   */
  private isDisabledField;
  /**
   * Method to set value on the form field.
   *
   * param: field - name of the form field
   * param: value - value of the form field
   * param: shouldValidate - should this form field be validated with the updated value. Default to true.
   */
  setFieldValue(field: string, value: any, shouldValidate?: boolean): Promise<void>;
  /**
   * Method to set values on the form fields.
   *
   * param: valuesObj - Object with key as form field name and value as the updated value for the field
   * example: `{ first_name: "new name", last_name: "new last name" }`
   * param: shouldValidate - should this form be validated with the updated values. Default to true.
   */
  setFieldsValue(valuesObj: FormValues, shouldValidate?: boolean): Promise<void>;
  /**
   * Method to set errors on the form fields.
   *
   * If you use `setErrors`, your errors will be wiped out by next `validate` or `validationSchema` call which can be triggered by the user typing (a change event) or blurring an input (a blur event).
   * Note: this assumed you have not manually set `validateOnInput` and `validateOnBlur` props to `false` (they are `true` by default).
   *
   * param: errorObj - key value pair of [fieldName]: ErrorMessage
   * example: `{ first_name: 'firstname is required' }`
   */
  setFieldErrors(errorObj: FormErrors<FormValues>): Promise<void>;
  /**
   * setFieldChoices Method to set field choices for a DROPDOWN/MULTI_SELECT/RADIO fields in formschema.
   * choices must be in the form of array with the below format:
   * [{
      id: 1,
      value: 'open',
      position: 1,
      dependent_ids: {},
    }].
   * fieldOptions is an optional parameter, must be an object with keys being option_label_path and option_value_path.
   * option_label_path refers to the key used for displaying the text.
   * option_value_path refers to the key which corresponds to the value of item.
   */
  setFieldChoices(field: string, choices: Array<any>, fieldOptions?: any): Promise<void>;
  /**
   * Method to set hidden fields on the form dynamically.
   *
   * Note: You must always pass all the fields that you want to hide. Also, note that the validation for hidden fields will be skipped.
   *
   * param: hiddenFields - key value pair of [fieldName]: true | false
   * example: `setHiddenFields({ first_name: true, last_name: false })`
   */
  setHiddenFields(hiddenFields?: any): Promise<void>;
  /**
   * Method to set disabled fields on the form dynamically.
   *
   * Note: You must always pass all the fields that you want to disable
   *
   * param: disabledFields - key value pair of [fieldName]: true | false
   * example: `setDisabledFields({ first_name: true, last_name: false })`
   */
  setDisabledFields(disabledFields?: any): Promise<void>;
  private _handleFieldModifier;
  /**
   * getValues
   * @returns An Object containing values and serializedValues.
   * serializedValues are those that contains the transformed values based on field type.
   * 1. For Number and Decimal: returns floating point number of value or undefined.
   * 2. For Date: returns value as ${year}-${month}-${date} or undefined.
   * 3. For Relationship : returns an array of values or value.
   */
  getValues(): Promise<{
    values: FormValues;
    serializedValues: FormValues;
  }>;
  /**
   *
   * @param event : An event which takes place in the DOM
   *
   * Method to submit the form
   */
  doSubmit(event?: any): Promise<FormSubmit>;
  /**
   *
   * @param event - An event which takes place in the DOM
   *
   * Method to reset the form
   */
  doReset(event?: any): Promise<void>;
  /**
   *
   * Method to filter the display of fields in the form based
   * on the passed text.
   *
   * @param text
   *
   */
  setFieldSearchText(text: string): Promise<void>;
  /**
   * Method to set required status on form fields
   *
   * param: requiredStatusObj - Object with key as form field name and value denoting if the field should be marked
   * as required or not
   * example: `{ first_name: true, last_name: false }`
   */
  setFieldsRequiredStatus(requiredStatusObj: FormRequired<FormValues>): Promise<void>;
  render(): any;
}

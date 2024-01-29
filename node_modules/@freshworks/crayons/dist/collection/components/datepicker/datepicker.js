import { Component, Element, Event, Listen, Prop, State, h, Method, Watch, } from '@stencil/core';
import { isValid, parse, parseISO, getYear, getMonth, getDate, getTime, startOfDay, getDaysInMonth, format, isMatch, formatISO, addDays, startOfWeek, } from 'date-fns';
import { handleKeyDown, renderHiddenField, getFocusableChildren, hasSlot, debounce, } from '../../utils';
import FieldControl from '../../function-components/field-control';
import { TranslationController } from '../../global/Translation';
import { addRTL } from '../../utils';
const defaultweekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const monthDetails = [
  { value: 'Jan', text: 'January' },
  { value: 'Feb', text: 'February' },
  { value: 'Mar', text: 'March' },
  { value: 'Apr', text: 'April' },
  { value: 'May', text: 'May' },
  { value: 'Jun', text: 'June' },
  { value: 'Jul', text: 'July' },
  { value: 'Aug', text: 'August' },
  { value: 'Sep', text: 'September' },
  { value: 'Oct', text: 'October' },
  { value: 'Nov', text: 'November' },
  { value: 'Dec', text: 'December' },
];
const getMonthNames = (lang) => {
  if (!lang) {
    return {
      longMonthNames: monthDetails.map((m) => m.text),
      shortMonthNames: monthDetails.map((m) => m.value),
    };
  }
  const shortMonthNames = [];
  const longMonthNames = [];
  for (let i = 0; i <= 11; i++) {
    shortMonthNames.push(lang.localize.month(i, { width: 'abbreviated' }));
    longMonthNames.push(lang.localize.month(i));
  }
  return {
    longMonthNames,
    shortMonthNames,
  };
};
const getWeekDays = (lang) => {
  if (!lang)
    return defaultweekDays;
  return Array.from(Array(7)).map((_e, i) => format(addDays(startOfWeek(new Date()), i), 'EEEEE', { locale: lang }));
};
export class Datepicker {
  constructor() {
    this.firstFocusElement = null;
    this.lastFocusElement = null;
    this.hasHintTextSlot = false;
    this.hasWarningTextSlot = false;
    this.hasErrorTextSlot = false;
    this.timeValue = '';
    this.dateFormat = '';
    /**
     *   Type of date selection enabled for the calendar. If the value is range, a user can select a date range in the calendar.
     */
    this.mode = 'single date';
    /**
     * Name of the component, saved as part of form data.
     */
    this.name = '';
    //({ keyName: 'datepicker.update' })
    this.updateText = '';
    //@i18n({ keyName: 'datepicker.cancel' })
    this.cancelText = '';
    /**
     * Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
     */
    this.required = false;
    /**
     * Theme based on which the input of the datepicker is styled.
     */
    this.state = 'normal';
    /**
     * Minimum year that needs to be displayed in the year dropdown.
     */
    this.minYear = 1970;
    /**
     * Maximum year that needs to be displayed in the year dropdown.
     */
    this.maxYear = new Date().getFullYear();
    /**
     * Make the input box as readonly. Default `false`
     */
    this.readonly = false;
    /**
     * Make the datepicker box as disabled. Default `false`
     */
    this.disabled = false;
    /**
     * Indicates if footer needs to be shown. Default `true`.
     */
    this.showFooter = true;
    /**
     * Displays a clear icon in the text box. Clicking the icon clears the value. Default `false`
     */
    this.clearInput = false;
    /**
     * Hint text displayed below the text box.
     */
    this.hintText = '';
    /**
     * Warning text displayed below the text box.
     */
    this.warningText = '';
    /**
     * Error text displayed below the text box.
     */
    this.errorText = '';
    /**
     * Label displayed on the interface, for the component.
     */
    this.label = '';
    /**
     * Whether the time-picker should be shown in the date-picker. Supports single date picker only.
     */
    this.showTimePicker = false;
    /**
     * The props for the time picker. Refer the fw-timepicker for valid format.
     */
    this.timeProps = {};
    /**
     * Debounce timer for date input.
     */
    this.debounceTimer = 800;
    /**
     * Displays alert icon and tooltip when user inputs an invalid date in the textbox. Default value is true.
     */
    this.showErrorOnInvalidDate = true;
    /**
     * To make the datepicker occupy full width of the container. Default value is false.
     */
    this.fullWidth = false;
    /**
     * Option to prevent the tooltip from being clipped when the component is placed inside a container with
     * `overflow: auto|hidden|scroll`.
     */
    this.hoistTooltip = true;
    this.escapeHandler = null;
    this.isDisplayFormatSet = false;
    this.isPlaceholderSet = false;
    this.isNextMonthRestricted = false;
    this.isPrevMonthRestricted = false;
    this.isDateInvalid = false;
    this.initState = this.state;
    this.isDateWithinMinDate = true;
    this.isDateWithinMaxDate = true;
    this.handleInputChangeWithDebounce = debounce((e, target) => {
      e.stopImmediatePropagation();
      this.emitEvent(e, target[0].value);
      this.fwDateInput.emit({
        event: e,
        name: this.name,
        value: target[0].value,
      });
      if (this.mode === 'range') {
        // Range input
        const val = target[0].value;
        if (!val) {
          this.value = undefined;
        }
        this.processRangeValueChange(val);
      }
      else {
        // Single Date input
        const val = target[0].value;
        if (!val) {
          this.value = undefined;
        }
        this.processValueChange(val);
      }
    }, this, this.debounceTimer);
    this.getSupportedYears = () => {
      const yearsArr = [];
      if (+this.maxYear < +this.minYear)
        this.maxYear = +this.minYear;
      let year = +this.minYear;
      while (year <= +this.maxYear) {
        yearsArr.push(year.toString());
        year++;
      }
      return yearsArr;
    };
    this.setTimepickerDate = () => {
      try {
        const date = format(new Date(this.year, this.month, this.selectedDay), this.dateFormat, {
          locale: this.langModule,
        });
        this.timepickerDate = date !== null && date !== void 0 ? date : '';
      }
      catch (error) {
        return '';
      }
    };
    this.isValidDateTime = () => {
      const dateNodes = this.host.shadowRoot.querySelectorAll('.c-day-container');
      // To check if user has selected any date and clicked update, since this.selectedDay will be set if any previous date value already exists.
      const isDateSelected = (dateNodes === null || dateNodes === void 0 ? void 0 : dateNodes.length) > 0 &&
        Object.values(dateNodes).some((node) => {
          return node.classList.contains('highlight-blue');
        });
      if (this.showTimePicker) {
        return !!(isDateSelected && this.selectedDay && this.timeValue);
      }
      if (this.clickedDateValue || this.value) {
        const parsedDate = parse(this.clickedDateValue || this.value || this.formatDateTime(), this.displayFormat, new Date(), {
          locale: this.langModule,
        }).valueOf();
        return (this.selectedDay &&
          isDateSelected &&
          this.isDateWithinMinMaxDate(parsedDate));
      }
      return this.selectedDay;
    };
    this.formatDateTime = () => {
      if (this.showTimePicker) {
        if (!this.timeValue)
          return;
        const [hour, minute] = this.timeValue.split(':');
        return format(new Date(this.year, this.month, this.selectedDay, parseInt(hour), parseInt(minute)), this.displayFormat, {
          locale: this.langModule,
        });
      }
      return format(new Date(this.year, this.month, this.selectedDay), this.displayFormat, {
        locale: this.langModule,
      });
    };
    this.getDayDetails = (args) => {
      const date = args.index - args.firstDay;
      const day = args.index % 7;
      let prevMonth = args.month - 1;
      let prevYear = Number(args.year);
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      const prevMonthNumberOfDays = getDaysInMonth(new Date(prevYear, prevMonth)) || 0;
      const _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
      const month = this._getValidDateInMonth(date, args);
      const timestamp = new Date(args.year, args.month, _date).valueOf();
      return { date: _date, day, month, timestamp };
    };
    this.getMonthDetails = (year, month) => {
      const firstDay = new Date(year, month).getDay();
      const numberOfDays = getDaysInMonth(new Date(year, month)) || 0;
      const monthArray = [];
      const rows = 6;
      let currentDay;
      let index = 0;
      const cols = 7;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          currentDay = this.getDayDetails({
            index,
            numberOfDays,
            firstDay,
            year,
            month,
          });
          monthArray.push(currentDay);
          index++;
        }
      }
      return monthArray;
    };
    this.setMonth = (offset) => {
      if ((offset === 1 && this.isNextMonthRestricted) ||
        (offset === -1 && this.isPrevMonthRestricted))
        return;
      let year = Number(this.year);
      let month = this.month + offset;
      if (month === -1) {
        month = 11;
        year--;
      }
      else if (month === 12) {
        month = 0;
        year++;
      }
      this.year = year.toString();
      this.month = month;
      this.toMonth = this.month === 11 ? 0 : this.month + 1;
      this.toYear =
        this.toMonth === 0 ? this.yearCalculation(this.year, 1) : this.year;
      this.monthDetails = this.getMonthDetails(year, month);
      this.nextMonthDetails =
        this.month === 11
          ? this.getMonthDetails(this.yearCalculation(this.year, 1), 0)
          : this.getMonthDetails(this.year, this.month + 1);
      this.checkYearRestriction();
    };
    this.isCurrentDay = (day) => {
      return day.timestamp === this.todayTimestamp;
    };
    this.isSelectedDay = ({ date, timestamp }) => {
      if (this.mode !== 'range') {
        const parsedDate = parse(this.clickedDateValue || this.value, this.displayFormat, new Date(), {
          locale: this.langModule,
        });
        const isValidDate = isValid(parsedDate);
        return isValidDate
          ? date === this.selectedDay &&
            getMonth(parsedDate) === getMonth(timestamp) &&
            getYear(parsedDate) === getYear(timestamp)
          : date === this.selectedDay;
      }
      return timestamp === this.startDate || timestamp === this.endDate;
    };
    this.handleDateHover = (day) => {
      if (this.startDate && !this.endDate) {
        if (this.startDate > day.timestamp) {
          this.endDate = this.startDate;
          this.startDate = undefined;
        }
        this.dateHovered = day.timestamp;
      }
      else if (!this.startDate && this.endDate) {
        if (this.endDate < day.timestamp) {
          this.startDate = this.endDate;
          this.endDate = undefined;
        }
        this.dateHovered = day.timestamp;
      }
    };
    this.isInRange = ({ timestamp }) => {
      const { endDate } = this;
      const { startDate } = this;
      if (startDate === endDate)
        return;
      return (startDate && endDate && timestamp >= startDate && timestamp <= endDate);
    };
    this.onDateClick = (e, { date, timestamp }) => {
      if (this.showSingleDatePicker()) {
        this.selectedDay = date;
        this.clickedDateValue = this.formatDateTime();
        this.showTimePicker && this.setTimepickerDate();
        if (!this.showFooter) {
          if (this.showTimePicker)
            this.timeValue = this.selectedTime;
          this.updateValueAndEmitEvent(e);
          this.showDatePicker = false;
          this.host.shadowRoot.querySelector('fw-popover').hide();
        }
      }
      else if (this.showDateRangePicker()) {
        this.handleRangeSelection(timestamp);
        if (!this.showFooter) {
          if (this.startDate && this.endDate) {
            this.updateValueAndEmitEvent(e);
            this.showDatePicker = false;
            this.host.shadowRoot.querySelector('fw-popover').hide();
          }
        }
        this.dateHovered = '';
      }
    };
    this.handleInputClear = (e) => {
      this.clearInputValue();
      this.emitEvent(e, undefined);
    };
    // handle cancel and popover close
    this.handlePopoverClose = (e) => {
      var _a, _b;
      if (['FW-SELECT', 'FW-TIMEPICKER'].includes((_a = e.target) === null || _a === void 0 ? void 0 : _a.tagName))
        return;
      if (this.mode === 'range') {
        // handle resetting of startDate and endDate on clicking cancel
        if (this.value && !this.isDateInvalid) {
          let [fromDateStr, toDateStr] = ((_b = this.value) === null || _b === void 0 ? void 0 : _b.split(TranslationController.t('datepicker.to'))) || [];
          fromDateStr = fromDateStr === null || fromDateStr === void 0 ? void 0 : fromDateStr.trim();
          toDateStr = toDateStr === null || toDateStr === void 0 ? void 0 : toDateStr.trim();
          const parsedFromDate = parse(fromDateStr, this.displayFormat, new Date(), {
            locale: this.langModule,
          }).valueOf();
          const parsedToDate = parse(toDateStr, this.displayFormat, new Date(), {
            locale: this.langModule,
          }).valueOf();
          if (this.startDate !== parsedFromDate) {
            this.startDate = parsedFromDate;
          }
          if (this.endDate !== parsedToDate) {
            this.endDate = parsedToDate;
          }
        }
        else if ((!this.startDate && !this.endDate) || this.isDateInvalid) {
          this.startDate = this.endDate = undefined;
        }
      }
      else {
        // handle resetting of selectedDay on clicking cancel
        if (this.value) {
          this.clickedDateValue = this.value;
          const parsedDate = parse(this.value, this.displayFormat, new Date(), {
            locale: this.langModule,
          });
          const date = getDate(parsedDate);
          if (!this.isDateInvalid) {
            if (this.selectedDay !== date)
              this.selectedDay = date;
          }
          else {
            this.selectedDay = this.clickedDateValue = undefined;
          }
          if (this.showTimePicker) {
            this.timeValue = format(getTime(new Date(this.value)), 'HH:mm', {
              locale: this.langModule,
            });
            this.timepickerDate = format(new Date(this.value), this.dateFormat, {
              locale: this.langModule,
            });
          }
        }
        else {
          this.selectedDay = undefined;
          if (this.showTimePicker) {
            this.timepickerDate = undefined;
            this.timeValue = '';
          }
        }
        if (this.timeValue) {
          if (this.selectedTime !== this.timeValue) {
            this.selectedTime = this.timeValue;
          }
        }
        else
          this.selectedTime = this.timepickerDate = undefined;
      }
    };
    this.onBlur = async (e) => {
      var _a, _b, _c, _d;
      e.stopImmediatePropagation();
      if (((_d = (_c = (_b = (_a = e) === null || _a === void 0 ? void 0 : _a.detail) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.relatedTarget) === null || _d === void 0 ? void 0 : _d.tagName) !== 'SPAN') {
        this.fwBlur.emit({
          event: e,
          name: this.name,
        });
      }
    };
  }
  makeDatePickerInert() {
    if (!this.madeInert) {
      /**
       * Focus trapping inside datepicker.
       */
      const focusableElements = getFocusableChildren(this.host);
      if (focusableElements.length) {
        this.firstFocusElement = focusableElements[0];
        this.lastFocusElement = focusableElements[focusableElements.length - 1];
        this.lastFocusElement.addEventListener('keydown', (e) => {
          !e.shiftKey &&
            e.keyCode === 9 &&
            this.focusElement(this.firstFocusElement);
        });
        this.firstFocusElement.addEventListener('keydown', (e) => {
          e.shiftKey &&
            e.keyCode === 9 &&
            this.focusElement(this.lastFocusElement);
        });
      }
      if (this.firstFocusElement) {
        this.focusElement(this.firstFocusElement);
      }
      this.madeInert = true;
    }
    this.escapeHandler = ((e) => {
      if (e.keyCode === 27) {
        this.showDatePicker = false;
        this.host.shadowRoot.querySelector('fw-popover').hide();
      }
    }).bind(this);
    document.addEventListener('keydown', this.escapeHandler);
  }
  emitEvent(event, eventDetails) {
    this.fwChange.emit({
      event: event,
      name: this.name,
      value: eventDetails,
    });
  }
  focusElement(element) {
    element.focus();
  }
  connectedCallback() {
    addRTL(this.host);
  }
  disconnectedCallback() {
    var _a;
    document.removeEventListener('keydown', this.escapeHandler);
    (_a = this.langChangRemoveListener) === null || _a === void 0 ? void 0 : _a.call(this);
  }
  formatDate(value) {
    if (!value)
      return value;
    return this.displayFormat
      ? formatISO(parse(value, this.displayFormat, new Date(), {
        locale: this.langModule,
      }))
      : formatISO(new Date(value));
  }
  /**
   * Returns the date value in ISO format.
   */
  async getValue() {
    if (this.mode === 'range') {
      return {
        fromDate: (this.startDate &&
          formatISO(parse(format(new Date(this.startDate), this.displayFormat, {
            locale: this.langModule,
          }), this.displayFormat, new Date(), {
            locale: this.langModule,
          }))) ||
          undefined,
        toDate: (this.endDate &&
          formatISO(parse(format(new Date(this.endDate), this.displayFormat, {
            locale: this.langModule,
          }), this.displayFormat, new Date(), {
            locale: this.langModule,
          }))) ||
          undefined,
      };
    }
    return ((this.value &&
      formatISO(parse(this.value, this.displayFormat, new Date(), {
        locale: this.langModule,
      }))) ||
      undefined);
  }
  /**
   * Sets focus on a specific `fw-datepicker`. Use this method instead of the global `input.focus()`.
   */
  async setFocus() {
    var _a, _b;
    if (this.nativeInput) {
      (_b = (_a = this.nativeInput).setFocus) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
  }
  /**
   * Clears the input value and unselects selected date.
   */
  async clearValue() {
    this.clearInputValue();
  }
  handleKeyDown(event) {
    switch (event.code) {
      case 'Enter':
        this.host.shadowRoot.querySelector('fw-popover').show();
        break;
      case 'ArrowDown':
        event.preventDefault();
    }
    this.makeDatePickerInert();
  }
  displayDatePicker() {
    this.showDatePicker = true;
  }
  handleButtonClick(e) {
    const target = e.composedPath()[0];
    const isUpdateRange = target.classList.value.includes('update-range-value');
    const isUpdateDate = target.classList.value.includes('update-date-value');
    const cancelText = this.cancelText || TranslationController.t('datepicker.cancel');
    const updateText = this.updateText || TranslationController.t('datepicker.update');
    if (isUpdateRange) {
      if (this.startDate && this.endDate) {
        this.updateValueAndEmitEvent(e);
      }
    }
    else if (isUpdateDate) {
      this.timeValue = this.selectedTime;
      if (this.isValidDateTime()) {
        this.setDateAndErrorState();
        this.updateValueAndEmitEvent(e);
      }
    }
    if (target.innerText === cancelText && !this.value) {
      if (this.mode === 'range') {
        this.startDate = this.endDate = undefined;
      }
      else {
        this.selectedDay = undefined;
      }
    }
    if (target.innerText === cancelText) {
      this.handlePopoverClose(e);
    }
    // Close datepicker only for fwClick event of Update and cancel buttons. Since this will
    // be triggered for month and year select dropdown as well the below check is added.
    if (target.innerText === updateText || target.innerText === cancelText) {
      this.showDatePicker = false;
      this.host.shadowRoot.querySelector('fw-popover').hide();
    }
  }
  /**
   * Listener to handle input changes
   */
  handleInputChanges(e) {
    const target = e.composedPath();
    this.handleInputChangeWithDebounce(e, target);
  }
  /**
   * Listener to handle Month Year dropdown.
   */
  handleMonthYearDropDownSelection(e) {
    if (e.composedPath()[0].tagName !== 'FW-DATEPICKER') {
      e.stopImmediatePropagation();
    }
    const newValue = e.detail && e.detail.value;
    if (!newValue) {
      return;
    }
    if (this.mode === 'range') {
      this.handleDateRangeDropDownUpdate(e, newValue);
      this.nextMonthDetails = this.getMonthDetails(this.toYear, this.toMonth);
    }
    else {
      this.handleSingleDateDropDownUpdate(e, newValue);
    }
    this.monthDetails = this.getMonthDetails(this.year, this.month);
  }
  handleSingleDateDropDownUpdate(e, newValue) {
    const isMonthUpdate = e
      .composedPath()[0]
      .classList.value.includes('single-month-selector');
    const isYearUpdate = e
      .composedPath()[0]
      .classList.value.includes('single-year-selector');
    const isTimeUpdate = e.composedPath()[0].tagName === 'FW-TIMEPICKER';
    if (isMonthUpdate) {
      this.month = this.shortMonthNames.indexOf(newValue);
    }
    else if (isYearUpdate) {
      this.year = newValue;
    }
    else if (isTimeUpdate) {
      this.timeValue = this.selectedTime = newValue;
    }
    this.checkYearRestriction();
  }
  handleDateRangeDropDownUpdate(e, newValue) {
    const isFromMonthUpdate = e
      .composedPath()[0]
      .classList.value.includes('from-month-selector');
    const isFromYearUpdate = e
      .composedPath()[0]
      .classList.value.includes('from-year-selector');
    const isToMonthUpdate = e
      .composedPath()[0]
      .classList.value.includes('to-month-selector');
    const isToYearUpdate = e
      .composedPath()[0]
      .classList.value.includes('to-year-selector');
    if (isFromMonthUpdate) {
      this.month = this.shortMonthNames.indexOf(newValue);
      if (this.month === 11) {
        this.toMonth = 0;
        this.toYear = this.yearCalculation(this.year, 1);
      }
      else {
        this.toMonth = this.month + 1;
      }
    }
    else if (isFromYearUpdate) {
      this.year = newValue;
      this.toYear =
        this.month === 11 ? this.yearCalculation(this.year, 1) : this.year;
    }
    else if (isToMonthUpdate) {
      this.toMonth = this.shortMonthNames.indexOf(newValue);
      if (this.toMonth === 0) {
        this.month = 11;
        this.year = this.yearCalculation(this.toYear, -1);
      }
      else {
        this.month = this.toMonth - 1;
      }
    }
    else if (isToYearUpdate) {
      this.toYear = newValue;
      this.year =
        this.toMonth === 0
          ? this.yearCalculation(this.toYear, -1)
          : this.toYear;
    }
  }
  yearCalculation(year, offset) {
    const resultYear = Number(year) + offset;
    return resultYear.toString();
  }
  getFormatFromLocale() {
    var _a, _b;
    this.dateFormat = (_b = (_a = this.langModule) === null || _a === void 0 ? void 0 : _a.formatLong) === null || _b === void 0 ? void 0 : _b.date({ width: 'short' });
    return this.showTimePicker
      ? `${this.dateFormat} ${this.timeFormat}`
      : this.dateFormat;
  }
  async handleLocaleChange(newLocale) {
    this.langModule = await TranslationController.getDateLangModule(newLocale);
  }
  handleMinDateChange() {
    this.monthDetails = this.getMonthDetails(this.year, this.month);
    this.mode === 'range' &&
      (this.nextMonthDetails = this.getMonthDetails(this.toYear, this.toMonth));
  }
  handleMaxDateChange() {
    this.monthDetails = this.getMonthDetails(this.year, this.month);
    this.mode === 'range' &&
      (this.nextMonthDetails = this.getMonthDetails(this.toYear, this.toMonth));
  }
  handleUserTimeZoneOffset(date) {
    return (new Date(date).valueOf() + new Date(date).getTimezoneOffset() * 60 * 1000);
  }
  async componentWillLoad() {
    var _a, _b, _c;
    if (this.mode === 'range' && this.showTimePicker) {
      throw Error('Time picker not supported in Date Range');
    }
    this.langModule = await TranslationController.getDateLangModule(this.locale);
    this.timeFormat || (this.timeFormat = (_b = (_a = this.langModule) === null || _a === void 0 ? void 0 : _a.formatLong) === null || _b === void 0 ? void 0 : _b.time({
      width: 'short',
    }));
    if (this.displayFormat) {
      this.isDisplayFormatSet = true;
      this.dateFormat = this.displayFormat;
      this.displayFormat = this.showTimePicker
        ? `${this.displayFormat} ${this.timeFormat}`
        : this.displayFormat;
    }
    if (this.placeholder) {
      this.isPlaceholderSet = true;
    }
    this.checkSlotContent();
    this.displayFormat = this.displayFormat || this.getFormatFromLocale();
    this.placeholder = this.placeholder || this.displayFormat;
    const onChange = TranslationController.onChange.bind(TranslationController);
    this.langChangRemoveListener = onChange('lang', async (locale) => {
      var _a, _b;
      this.langModule = await TranslationController.getDateLangModule(locale);
      this.displayFormat = this.isDisplayFormatSet
        ? this.displayFormat
        : (_b = (_a = this.langModule) === null || _a === void 0 ? void 0 : _a.formatLong) === null || _b === void 0 ? void 0 : _b.date({ width: 'short' });
      this.placeholder = this.isPlaceholderSet
        ? this.placeholder
        : this.displayFormat;
      if (this.mode === 'range')
        this.placeholder = this.isPlaceholderSet
          ? this.placeholder
          : `${this.displayFormat} ${TranslationController.t('datepicker.to')} ${this.displayFormat}`;
      const monthNames = getMonthNames(this.langModule);
      this.shortMonthNames = monthNames.shortMonthNames;
      this.longMonthNames = monthNames.longMonthNames;
      this.weekDays = getWeekDays(this.langModule);
    });
    if (this.mode === 'range') {
      const today = new Date();
      let [fromDate, toDate] = ((_c = this.value) === null || _c === void 0 ? void 0 : _c.split(TranslationController.t('datepicker.to'))) || [];
      fromDate = fromDate === null || fromDate === void 0 ? void 0 : fromDate.trim();
      toDate = toDate === null || toDate === void 0 ? void 0 : toDate.trim();
      if (isValid(parseISO(fromDate)) && isValid(parseISO(toDate))) {
        this.fromDate = fromDate;
        this.toDate = toDate;
      }
      if ((this.fromDate && !isValid(parseISO(this.fromDate))) ||
        (this.toDate && !isValid(parseISO(this.toDate)))) {
        // Show current month and year if invalid date is provided
        this.year = getYear(today);
        this.month = getMonth(today);
      }
      else {
        const fromDate = new Date(this.handleUserTimeZoneOffset(this.fromDate));
        this.year = this.fromDate ? getYear(fromDate) : getYear(today);
        this.month = this.fromDate ? getMonth(fromDate) : getMonth(today);
      }
    }
    else {
      this.processInitDateValue();
    }
    this.setMinMaxYearAndDateValues();
    this.toMonth = this.month === 11 ? 0 : this.month + 1;
    this.toYear =
      this.toMonth === 0 ? this.yearCalculation(this.year, 1) : this.year;
    this.monthDetails = this.getMonthDetails(this.year, this.month);
    this.todayTimestamp = startOfDay(new Date()).valueOf();
    const monthNames = getMonthNames(this.langModule);
    this.shortMonthNames = monthNames.shortMonthNames;
    this.longMonthNames = monthNames.longMonthNames;
    this.weekDays = getWeekDays(this.langModule);
    if (this.value && this.mode !== 'range') {
      this.setDateAndErrorState(true);
      const utcTimeRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
      this.value =
        this.showTimePicker || utcTimeRegex.test(this.value)
          ? format(new Date(this.value), this.displayFormat, {
            locale: this.langModule,
          })
          : format(new Date(this.handleUserTimeZoneOffset(this.value)), this.displayFormat, {
            locale: this.langModule,
          });
    }
    this.showTimePicker && this.setTimepickerDate();
    this.setInitialValues();
    this.checkYearRestriction();
  }
  setInitialValues() {
    this.nextMonthDetails =
      this.month === 11
        ? this.getMonthDetails(this.yearCalculation(this.year, 1), 0)
        : this.getMonthDetails(this.year, this.month + 1);
    if (this.mode === 'range')
      this.placeholder = this.isPlaceholderSet
        ? this.placeholder
        : `${this.displayFormat} ${TranslationController.t('datepicker.to')} ${this.displayFormat}`;
    this.supportedYears = this.getSupportedYears();
    this.startDate =
      this.fromDate !== undefined
        ? parseISO(this.fromDate).valueOf()
        : undefined;
    this.endDate =
      this.toDate !== undefined ? parseISO(this.toDate).valueOf() : undefined;
    if (this.mode === 'range') {
      if (this.startDate && this.endDate) {
        const formattedFromDate = format(new Date(this.startDate), this.displayFormat, {
          locale: this.langModule,
        });
        const formattedToDate = format(new Date(this.endDate), this.displayFormat, {
          locale: this.langModule,
        });
        this.setDateAndErrorState();
        this.value = `${formattedFromDate} to ${formattedToDate}`;
      }
      else
        this.value = undefined;
    }
  }
  setDateAndErrorState(checkDate = false) {
    if (this.mode === 'range' && this.fromDate && this.toDate) {
      const fromDate = parse(this.fromDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      }).valueOf();
      const toDate = parse(this.toDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      }).valueOf();
      this.isDateInvalid = !this.isDatewithinRange(fromDate, toDate);
    }
    else if (this.mode !== 'range') {
      this.isDateInvalid =
        checkDate &&
          !this.isDateWithinMinMaxDate(parseISO(this.value).valueOf());
    }
    this.state =
      this.showErrorOnInvalidDate && this.isDateInvalid
        ? 'error'
        : this.initState;
  }
  setMinMaxYearAndDateValues() {
    if (this.minDate && this.maxDate)
      this.minDate =
        parseISO(this.minDate).valueOf() > parseISO(this.maxDate).valueOf()
          ? undefined
          : this.minDate;
    this.maxYear = this.maxDate
      ? getYear(new Date(this.handleUserTimeZoneOffset(this.maxDate)))
      : this.maxYear;
    this.minYear =
      this.maxYear > this.minYear
        ? this.minDate
          ? getYear(new Date(this.handleUserTimeZoneOffset(this.minDate)))
          : this.minYear
        : 1970;
  }
  processInitDateValue() {
    const today = new Date();
    if (!this.value) {
      this.year = getYear(today);
      this.month = getMonth(today);
    }
    else {
      if (!isValid(parseISO(this.value))) {
        // Show current date if invalid date is provided
        this.year = getYear(today);
        this.month = getMonth(today);
        this.selectedDay = getDate(today);
        this.value = undefined;
      }
      else {
        const utcTimeRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
        const date = this.showTimePicker || utcTimeRegex.test(this.value)
          ? new Date(this.value)
          : new Date(this.handleUserTimeZoneOffset(this.value));
        this.year = getYear(date);
        this.month = getMonth(date);
        this.selectedDay = getDate(date);
        this.timeValue = format(getTime(date), 'HH:mm', {
          locale: this.langModule,
        });
        this.selectedTime = this.timeValue;
      }
    }
  }
  processRangeValueChange(val, emitChange = false) {
    let [fromDate, toDate] = (val === null || val === void 0 ? void 0 : val.split(TranslationController.t('datepicker.to'))) || [];
    fromDate = fromDate === null || fromDate === void 0 ? void 0 : fromDate.trim();
    toDate = toDate === null || toDate === void 0 ? void 0 : toDate.trim();
    const parsedFromDate = parse(fromDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    });
    const parsedToDate = parse(toDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    });
    const isValidFromDate = isValid(parsedFromDate);
    const isValidToDate = isValid(parsedToDate);
    const year = getYear(parse(fromDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    const toYear = getYear(parse(toDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    if (!isValidFromDate ||
      !isValidToDate ||
      !isMatch(fromDate, this.displayFormat, {
        locale: this.langModule,
      }) ||
      !isMatch(toDate, this.displayFormat, {
        locale: this.langModule,
      }) ||
      year < this.minYear ||
      year > this.maxYear ||
      toYear < this.minYear ||
      toYear > this.maxYear ||
      !this.isDatewithinRange(parsedFromDate.valueOf(), parsedToDate.valueOf())) {
      // Invalid date format
      this.isDateInvalid = !!val;
      this.state =
        this.showErrorOnInvalidDate && this.isDateInvalid
          ? 'error'
          : this.initState;
      this.startDate = this.endDate = undefined;
      this.fromDate = this.toDate = undefined;
      if (!emitChange)
        this.value = val;
      return;
    }
    this.year = year;
    this.fromDate = fromDate;
    this.toDate = toDate;
    const chosenFromMonth = getMonth(parse(fromDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    const chosenToMonth = getMonth(parse(toDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    if (chosenFromMonth === chosenToMonth && this.toMonth === chosenFromMonth) {
      this.toMonth = chosenFromMonth;
      this.month = this.toMonth - 1;
    }
    else {
      this.month = getMonth(parse(fromDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      }));
      this.toMonth = this.month === 11 ? 0 : this.month + 1;
    }
    this.startDate = parse(fromDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }).valueOf();
    this.endDate = parse(toDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }).valueOf();
    this.toYear =
      this.toMonth === 0 ? this.yearCalculation(this.year, 1) : this.year;
    const formattedFromDate = format(new Date(this.startDate), this.displayFormat, {
      locale: this.langModule,
    });
    const formattedToDate = format(new Date(this.endDate), this.displayFormat, {
      locale: this.langModule,
    });
    this.value = `${formattedFromDate} to ${formattedToDate}`;
    this.isDateInvalid = false;
    this.state =
      this.showErrorOnInvalidDate && this.isDateInvalid
        ? 'error'
        : this.initState;
    emitChange &&
      this.fwChange.emit({
        value: val,
      });
  }
  processValueChange(val, emitChange = false) {
    // show error if not ISO format and not display format
    const parsedDate = parse(val, this.displayFormat, new Date(), {
      locale: this.langModule,
    });
    const year = getYear(parse(val, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    if (year < this.minYear ||
      year > this.maxYear ||
      !isValid(parsedDate) ||
      !isMatch(val, this.displayFormat, {
        locale: this.langModule,
      }) ||
      !this.isDateWithinMinMaxDate(parsedDate.valueOf(), false)) {
      this.isDateInvalid = !!val;
      this.state =
        this.showErrorOnInvalidDate && this.isDateInvalid
          ? 'error'
          : this.initState;
      this.selectedDay = undefined;
      if (!emitChange)
        this.value = this.clickedDateValue = val;
      return;
    }
    this.year = year;
    this.month = getMonth(parse(val, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    this.selectedDay = getDate(parse(val, this.displayFormat, new Date(), {
      locale: this.langModule,
    }));
    if (this.showTimePicker) {
      this.timeValue = format(getTime(new Date(val)), 'HH:mm', {
        locale: this.langModule,
      });
      this.selectedTime = this.timeValue;
      // set the date value in date field
      this.setTimepickerDate();
    }
    this.value = this.formatDateTime();
    this.clickedDateValue = this.value;
    this.setDateAndErrorState();
    emitChange &&
      this.fwChange.emit({
        value: val,
      });
  }
  watchValueChanged(value) {
    if (!value) {
      this.startDate = undefined;
      this.endDate = undefined;
      this.selectedDay = undefined;
      this.value = undefined;
      const date = new Date();
      this.year = getYear(date);
      this.month = getMonth(date);
      this.monthDetails = this.getMonthDetails(this.year, this.month);
      this.timepickerDate = this.selectedTime = undefined;
      this.timeValue = '';
    }
    else {
      if (this.mode !== 'range') {
        // if the value is of the ISO UTC time format, timezone offset need not be calculated
        // when datepicker is used in form component, the value will be passed to form in UTC ISO format, hence skipping.
        const utcTimeRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
        // If ISO format, format it to display format and validate
        try {
          if (isValid(parseISO(value)))
            value =
              this.showTimePicker || utcTimeRegex.test(value)
                ? format(new Date(value), this.displayFormat, {
                  locale: this.langModule,
                })
                : format(new Date(this.handleUserTimeZoneOffset(value)), this.displayFormat, {
                  locale: this.langModule,
                });
          this.processValueChange(value, true);
          this.checkYearRestriction();
        }
        catch (e) {
          console.log('Invalid date provided !', e);
        }
      }
      else {
        try {
          // If ISO format, format it to display format and validate
          let [fromDate, toDate] = (value === null || value === void 0 ? void 0 : value.split(TranslationController.t('datepicker.to'))) || [];
          fromDate = fromDate === null || fromDate === void 0 ? void 0 : fromDate.trim();
          toDate = toDate === null || toDate === void 0 ? void 0 : toDate.trim();
          if (isValid(parseISO(fromDate)) && isValid(parseISO(toDate))) {
            this.fromDate = fromDate;
            this.toDate = toDate;
            fromDate = format(new Date(this.handleUserTimeZoneOffset(this.fromDate)), this.displayFormat, {
              locale: this.langModule,
            });
            toDate = format(new Date(this.handleUserTimeZoneOffset(this.toDate)), this.displayFormat, {
              locale: this.langModule,
            });
            value = `${fromDate} to ${toDate}`;
          }
          this.processRangeValueChange(value, true);
        }
        catch (e) {
          console.log('Invalid date provided !', e);
        }
      }
    }
  }
  _getValidDateInMonth(date, args) {
    if (date < 0 || args.year > this.maxYear || this.minYear > args.year) {
      return -1;
    }
    if (this.minDate !== undefined && this.maxDate !== undefined) {
      const minDate = parseISO(this.minDate);
      const maxDate = parseISO(this.maxDate);
      if (!isValid(minDate) || !isValid(maxDate)) {
        // Invalid minDate or maxDate provided.
        return;
      }
      const argDate = new Date(args.year, args.month, date + 1);
      const isValidDate = minDate.valueOf() <= argDate.valueOf() &&
        argDate.valueOf() <= maxDate.valueOf();
      return !isValidDate ? -1 : date >= args.numberOfDays ? 1 : 0;
    }
    else if (this.minDate !== undefined) {
      const minDate = parseISO(this.minDate);
      if (!isValid(minDate)) {
        // Invalid minDate provided.
        return;
      }
      const argDate = new Date(args.year, args.month, date + 1);
      const isValidDate = minDate.valueOf() <= argDate.valueOf();
      return !isValidDate ? -1 : date >= args.numberOfDays ? 1 : 0;
    }
    else if (this.maxDate !== undefined) {
      const maxDate = parseISO(this.maxDate);
      if (!isValid(maxDate)) {
        // Invalid minDate or maxDate provided.
        return;
      }
      const argDate = new Date(args.year, args.month, date + 1);
      const isValidDate = maxDate.valueOf() >= argDate.valueOf();
      return !isValidDate ? -1 : date >= args.numberOfDays ? 1 : 0;
    }
    return date >= args.numberOfDays ? 1 : 0;
  }
  isDateWithinMinMaxDate(date, checkYear = true) {
    this.isDateWithinMaxDate =
      this.maxDate && !(date <= parseISO(this.maxDate).valueOf())
        ? false
        : true;
    this.isDateWithinMinDate =
      this.minDate && !(parseISO(this.minDate).valueOf() <= date)
        ? false
        : true;
    if (checkYear)
      return (this.isDateWithinMaxDate &&
        this.isDateWithinMinDate &&
        this.year <= this.maxYear &&
        this.minYear <= this.year);
    else
      return this.isDateWithinMaxDate && this.isDateWithinMinDate;
  }
  isDatewithinRange(fromDate, toDate) {
    if (this.minDate && !this.maxDate)
      return (parseISO(this.minDate).valueOf() <= toDate &&
        parseISO(this.minDate).valueOf() <= fromDate &&
        fromDate <= toDate);
    if (this.maxDate && !this.minDate)
      return (toDate <= parseISO(this.maxDate).valueOf() &&
        fromDate <= parseISO(this.maxDate).valueOf() &&
        fromDate <= toDate);
    if (this.maxDate && this.minDate)
      return (toDate <= parseISO(this.maxDate).valueOf() &&
        parseISO(this.minDate).valueOf() <= fromDate &&
        fromDate <= toDate);
    else
      return fromDate <= toDate;
  }
  checkYearRestriction() {
    this.isNextMonthRestricted =
      Number(this.year) >= this.maxYear && this.month === 11 ? true : false;
    this.isPrevMonthRestricted =
      Number(this.year) <= this.minYear && this.month === 0 ? true : false;
  }
  handleKeyUp(e, day) {
    if (e.code === 'Enter') {
      if (e
        .composedPath()
        .find((e) => e.classList && e.classList.value === 'mdp-range-container')) {
        // Range Container
        this.onDateClick(e, day);
        if (this.startDate && this.endDate) {
          this.startDateFormatted = format(new Date(this.startDate), this.displayFormat, {
            locale: this.langModule,
          });
          this.endDateFormatted = format(new Date(this.endDate), this.displayFormat, {
            locale: this.langModule,
          });
          this.value = this.startDateFormatted + ' to ' + this.endDateFormatted;
          this.emitEvent(e, {
            fromDate: this.formatDate(this.startDateFormatted),
            toDate: this.formatDate(this.endDateFormatted),
          });
          this.showDatePicker = false;
          this.host.shadowRoot.querySelector('fw-popover').hide();
        }
      }
      else {
        // Single Date Container
        this.onDateClick(e, day);
        this.value = format(new Date(this.year, this.month, this.selectedDay), this.displayFormat, {
          locale: this.langModule,
        });
        this.emitEvent(e, this.formatDate(this.value));
        this.showDatePicker = false;
        this.host.shadowRoot.querySelector('fw-popover').hide();
      }
    }
  }
  isHoverInRange({ timestamp }) {
    const { startDate, endDate, dateHovered } = this;
    const startDateCondtion = startDate &&
      dateHovered &&
      timestamp <= dateHovered &&
      timestamp >= startDate;
    const endDateCondition = endDate &&
      dateHovered &&
      timestamp >= dateHovered &&
      timestamp <= endDate;
    return startDateCondtion || endDateCondition;
  }
  updateValueAndEmitEvent(e) {
    if (this.showSingleDatePicker()) {
      this.value = this.formatDateTime();
      this.showTimePicker && this.setTimepickerDate();
      this.emitEvent(e, this.formatDate(this.value));
    }
    else if (this.showDateRangePicker()) {
      this.startDateFormatted = format(this.startDate, this.displayFormat, {
        locale: this.langModule,
      });
      this.endDateFormatted = format(this.endDate, this.displayFormat, {
        locale: this.langModule,
      });
      this.fromDate = this.startDateFormatted;
      this.toDate = this.endDateFormatted;
      this.value = this.startDateFormatted + ' to ' + this.endDateFormatted;
      this.emitEvent(e, {
        fromDate: this.formatDate(this.startDateFormatted),
        toDate: this.formatDate(this.endDateFormatted),
      });
    }
  }
  clearInputValue() {
    if (this.mode !== 'range') {
      if (this.selectedDay) {
        this.selectedDay = undefined;
      }
    }
    else {
      if (this.startDate && this.endDate) {
        this.startDate = this.endDate = undefined;
      }
    }
    this.value = undefined;
    this.isDateInvalid = false;
    this.state = this.initState;
  }
  renderInvalidAlert() {
    return (h("div", { class: 'invalid-alert', slot: 'input-suffix' },
      h("fw-tooltip", { distance: '13', content: this.tooltipErrorText ||
          TranslationController.t('datepicker.tooltipError'), hoist: this.hoistTooltip },
        h("fw-icon", { name: 'alert', size: 14, color: '#d72d30' }))));
  }
  handleRangeSelection(timestamp) {
    if (this.startDate && this.endDate) {
      this.endDate = undefined;
      this.startDate = timestamp;
    }
    else if (this.startDate && !this.endDate) {
      if (timestamp >= this.startDate) {
        this.endDate = timestamp;
      }
      else if (timestamp < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = timestamp;
      }
    }
    else if (!this.startDate && this.endDate) {
      this.startDate = timestamp;
    }
    else if (!this.startDate && !this.endDate) {
      this.startDate = timestamp;
    }
  }
  getCellStyle(day) {
    let cellStyle = 'c-day-container';
    if (day.month !== 0) {
      cellStyle += ' disabled';
    }
    if (this.isCurrentDay(day)) {
      cellStyle += ' highlight';
    }
    if (this.isSelectedDay(day)) {
      cellStyle += ' highlight-blue';
    }
    if (this.startDate && this.endDate && this.isInRange(day)) {
      cellStyle += ' highlight-range';
    }
    if (((this.startDate && !this.endDate) ||
      (!this.startDate && this.endDate)) &&
      this.isHoverInRange(day)) {
      cellStyle += ' highlight-range';
    }
    if (day.timestamp === this.startDate) {
      cellStyle += ' start-day';
    }
    if (day.timestamp === this.endDate) {
      cellStyle += ' end-day';
    }
    if (this.startDate &&
      this.dateHovered < this.startDate &&
      day.timestamp === this.dateHovered) {
      cellStyle += ' start-day';
    }
    else if (this.endDate &&
      this.dateHovered < this.endDate &&
      day.timestamp === this.dateHovered) {
      cellStyle += ' start-day';
    }
    else if (this.startDate &&
      this.dateHovered > this.startDate &&
      day.timestamp === this.dateHovered) {
      cellStyle += ' end-day';
    }
    return cellStyle;
  }
  renderCalendar(monthDetails) {
    const days = monthDetails.map((day, index) => {
      return (h("div", { class: this.getCellStyle(day), key: index },
        h("div", { class: 'cdc-day' },
          h("span", { role: 'button', tabindex: day.month === -1 || day.month === 1 ? '-1' : '0', onClick: (e) => this.onDateClick(e, day), onMouseOver: () => this.handleDateHover(day), onFocus: () => this.handleDateHover(day), onKeyDown: handleKeyDown(() => this.handleDateHover(day)), onKeyUp: (e) => this.handleKeyUp(e, day) }, day.date))));
    });
    return (h("div", { class: 'c-container' },
      h("div", { class: 'cc-head' }, this.weekDays.map((day, index) => (h("div", { key: index, class: 'cch-name' }, day)))),
      h("div", { class: 'cc-body' }, days)));
  }
  showSingleDatePicker() {
    return this.showDatePicker && this.mode !== 'range';
  }
  showDateRangePicker() {
    return this.showDatePicker && this.mode === 'range';
  }
  checkSlotContent() {
    this.hasHintTextSlot = hasSlot(this.host, 'hint-text');
    this.hasWarningTextSlot = hasSlot(this.host, 'warning-text');
    this.hasErrorTextSlot = hasSlot(this.host, 'error-text');
  }
  renderNavButtons() {
    return (h("div", { class: 'btns' },
      h("div", { class: 'mdpch-button' },
        h("div", { role: 'button', tabindex: '0', class: `mdpchb-inner ${this.isPrevMonthRestricted && 'disabled'}`, onClick: () => this.setMonth(-1), onKeyDown: handleKeyDown(() => this.setMonth(-1)) },
          h("span", { class: 'mdpchbi-left-arrow' }))),
      h("div", { class: 'mdpch-button-right' },
        h("div", { role: 'button', tabindex: '0', class: `mdpchb-inner ${this.isNextMonthRestricted && 'disabled'}`, onClick: () => this.setMonth(1), onKeyDown: handleKeyDown(() => this.setMonth(1)) },
          h("span", { class: 'mdpchbi-right-arrow' })))));
  }
  renderSupportedYears(chosenYear) {
    // The if/else block adds the year value to the year dropdown if its not present, i.e for invalid dates, we will add and remove it once the user moves to a valid month calendar
    // this is to overcome the issue of year dropdown select value disappearing, if the year value is not present and selected in the dropdown
    // https://github.com/freshworks/crayons/issues/826
    const isChosenYearPresent = this.supportedYears.find((year) => {
      return +year === +chosenYear;
    });
    if (!isChosenYearPresent) {
      this.supportedYears.push(chosenYear.toString());
      this.supportedYears.sort();
    }
    else {
      +this.supportedYears[this.supportedYears.length - 1] !== +this.maxYear &&
        +this.supportedYears[this.supportedYears.length - 1] !== +chosenYear &&
        this.supportedYears.pop(); // to avoid re rendering array.pop is used rather than filtering and destructuring
    }
    return this.supportedYears.map((year, i) => ({
      value: year,
      key: i,
      selected: +year === +chosenYear,
      text: year,
    }));
  }
  renderFooter() {
    return (h("div", { class: 'mdpc-footer' },
      h("fw-button", { color: 'secondary', class: 'close-date-picker' }, this.cancelText || TranslationController.t('datepicker.cancel')),
      h("fw-button", { color: 'primary', class: this.mode === 'range' ? 'update-range-value' : 'update-date-value' }, this.updateText || TranslationController.t('datepicker.update'))));
  }
  renderTimePicker() {
    return (h("div", { class: 'time-container' },
      h("div", null,
        h("span", null, TranslationController.t('datepicker.date')),
        h("fw-input", { placeholder: this.dateFormat, value: this.timepickerDate, readonly: true })),
      h("div", null,
        h("span", null, TranslationController.t('datepicker.time')),
        h("fw-timepicker", Object.assign({ class: 'mdc-time', sameWidth: false, locale: this.locale, caret: false, optionsPlacement: 'bottom-end', format: this.timeFormat, value: this.timeValue, allowDeselect: false }, this.timeProps)))));
  }
  render() {
    const { host, name, value } = this;
    renderHiddenField(host, name, value);
    return (h(FieldControl, { inputId: this.name, label: this.label, labelId: `${this.label}-${this.name}`, state: this.state, hintTextId: `hint-${this.name}`, hintText: this.hintText, hasHintTextSlot: this.hasHintTextSlot, errorTextId: `error-${this.name}`, errorText: this.errorText, hasErrorTextSlot: this.hasErrorTextSlot, warningTextId: `warning-${this.name}`, warningText: this.warningText, hasWarningTextSlot: this.hasWarningTextSlot, required: this.required },
      h("fw-popover", { "same-width": 'false', distance: '8', placement: 'bottom-start', fallbackPlacements: ['top-start'], "hide-on-tab": 'false', onFwHide: this.handlePopoverClose, hoist: true },
        h("div", { role: 'combobox', "aria-controls": 'datepicker', "aria-expanded": this.showDatePicker, tabindex: '-1', onClick: () => !this.disabled && (this.showDatePicker = true), onKeyUp: () => !this.disabled && (this.showDatePicker = true), slot: 'popover-trigger', style: {
            display: this.fullWidth ? 'block' : 'inline-flex',
            alignItems: 'center',
          } },
          h("fw-input", { value: this.value, name: this.name, disabled: this.disabled, placeholder: this.placeholder, required: this.required, onFwBlur: this.onBlur, ref: (el) => (this.nativeInput = el), state: this.state, readonly: this.showTimePicker || this.readonly, clearInput: this.clearInput, onFwInputClear: this.handleInputClear, style: {
              width: this.fullWidth
                ? '100%'
                : this.mode === 'range'
                  ? '235px'
                  : '200px',
            } },
            this.isDateInvalid &&
              this.showErrorOnInvalidDate &&
              this.renderInvalidAlert(),
            h("div", { class: 'icon-calendar', slot: 'input-suffix' },
              h("div", { class: 'separator', style: {
                  borderLeftColor: this.state === 'error' ? '#d72d30' : '#ebeff3',
                } }),
              h("span", { class: 'date-icon' },
                h("fw-icon", { name: this.showTimePicker ? 'calendar-time' : 'calendar', style: {
                    '--fw-icon-color': this.state === 'error' && '#d72d30',
                  } }))))),
        this.showSingleDatePicker() ? (h("div", { id: 'datepicker', class: 'datepicker', slot: 'popover-content', ref: (el) => (this.popoverContentElement = el) },
          this.showTimePicker && this.renderTimePicker(),
          h("div", { class: 'mdp-container' },
            h("div", { class: 'mdpc-head' },
              h("div", { class: 'mdpch-container' },
                h("span", { class: 'mdpchc-month' },
                  h("fw-select", { class: 'first single-month-selector', value: this.shortMonthNames[this.month], "same-width": 'false', "options-placement": 'bottom-start', variant: 'button', options: this.longMonthNames.map((month, i) => ({
                      value: this.shortMonthNames[i],
                      key: i,
                      selected: month === this.longMonthNames[this.month],
                      text: month,
                    })), allowDeselect: false, boundary: this.popoverContentElement })),
                h("span", { class: 'mdpchc-year' },
                  h("fw-select", { class: 'last single-year-selector', value: this.year, "same-width": 'false', "options-placement": 'bottom-start', variant: 'button', options: this.renderSupportedYears(this.year), "allow-deselect": 'false', boundary: this.popoverContentElement }))),
              this.renderNavButtons()),
            h("div", { class: 'mdpc-body' }, this.renderCalendar(this.monthDetails))),
          this.showFooter && this.renderFooter())) : (''),
        this.showDateRangePicker() ? (h("div", { id: 'datepicker', class: 'daterangepicker', slot: 'popover-content', ref: (el) => (this.popoverContentElement = el) },
          h("div", { class: 'mdp-range-container' },
            h("div", { class: 'mdpc-head' },
              h("div", { class: 'mdpch-container' },
                h("span", { class: 'mdpchc-month' },
                  h("fw-select", { class: 'first from-month-selector', value: this.shortMonthNames[this.month], "same-width": 'false', variant: 'button', "options-placement": 'bottom-start', options: this.longMonthNames.map((month, i) => ({
                      value: this.shortMonthNames[i],
                      key: i,
                      selected: month === this.longMonthNames[this.month],
                      text: month,
                    })), allowDeselect: false, boundary: this.popoverContentElement })),
                h("span", { class: 'mdpchc-year' },
                  h("fw-select", { class: 'last from-year-selector', value: this.year, "same-width": 'false', "options-placement": 'bottom-start', variant: 'button', options: this.renderSupportedYears(this.year), "allow-deselect": 'false', boundary: this.popoverContentElement }))),
              h("div", { class: 'mdpch-container-right' },
                h("span", { class: 'mdpchc-month' },
                  h("fw-select", { class: 'first to-month-selector', "same-width": 'false', variant: 'button', value: this.shortMonthNames[this.toMonth], "options-placement": 'bottom-start', options: this.longMonthNames.map((month, i) => ({
                      value: this.shortMonthNames[i],
                      key: i,
                      selected: month === this.longMonthNames[this.toMonth],
                      text: month,
                    })), allowDeselect: false, boundary: this.popoverContentElement })),
                h("span", { class: 'mdpchc-year' },
                  h("fw-select", { class: 'last to-year-selector', value: this.toYear, "same-width": 'false', "options-placement": 'bottom-start', variant: 'button', options: this.renderSupportedYears(this.toYear), "allow-deselect": 'false', boundary: this.popoverContentElement }))),
              this.renderNavButtons()),
            h("div", { class: 'body-container' },
              h("div", { class: 'mdpc-body' }, this.renderCalendar(this.monthDetails)),
              h("div", { class: 'mdpc-body mdpc-body-right' }, this.renderCalendar(this.nextMonthDetails)))),
          this.showFooter && this.renderFooter())) : (''))));
  }
  static get is() { return "fw-datepicker"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["datepicker.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["datepicker.css"]
  }; }
  static get properties() { return {
    "mode": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'single date' | 'range'",
        "resolved": "\"range\" | \"single date\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Type of date selection enabled for the calendar. If the value is range, a user can select a date range in the calendar."
      },
      "attribute": "mode",
      "reflect": false,
      "defaultValue": "'single date'"
    },
    "minDate": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Earliest date a user can select in the calendar, if mode is range. Must be a valid ISO date format if set."
      },
      "attribute": "min-date",
      "reflect": false
    },
    "maxDate": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Latest date a user can select in the calendar, if mode is range. Must be a valid ISO date format if set."
      },
      "attribute": "max-date",
      "reflect": false
    },
    "fromDate": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Starting date of the date range that is preselected in the calendar, if mode is range. Must be a date later than the min-date value and valid ISO date format."
      },
      "attribute": "from-date",
      "reflect": false
    },
    "toDate": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Ending date of the date range that is preselected in the calendar, if mode is range. Must be a date earlier than the max-date value and valid ISO date format."
      },
      "attribute": "to-date",
      "reflect": false
    },
    "displayFormat": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Format in which the date values selected in the calendar are populated in the input box. Defaults to the locale specific display format."
      },
      "attribute": "display-format",
      "reflect": false
    },
    "value": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Date that is preselected in the calendar, if mode is single date or undefined. If set this must be valid ISO date format."
      },
      "attribute": "value",
      "reflect": false
    },
    "name": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Name of the component, saved as part of form data."
      },
      "attribute": "name",
      "reflect": false,
      "defaultValue": "''"
    },
    "placeholder": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Text displayed in the input box before a user selects a date or date range."
      },
      "attribute": "placeholder",
      "reflect": false
    },
    "updateText": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "update-text",
      "reflect": false,
      "defaultValue": "''"
    },
    "cancelText": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "cancel-text",
      "reflect": false,
      "defaultValue": "''"
    },
    "required": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute\u2019s value is undefined, the value is set to false."
      },
      "attribute": "required",
      "reflect": false,
      "defaultValue": "false"
    },
    "state": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "'normal' | 'warning' | 'error'",
        "resolved": "\"error\" | \"normal\" | \"warning\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Theme based on which the input of the datepicker is styled."
      },
      "attribute": "state",
      "reflect": false,
      "defaultValue": "'normal'"
    },
    "minYear": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Minimum year that needs to be displayed in the year dropdown."
      },
      "attribute": "min-year",
      "reflect": false,
      "defaultValue": "1970"
    },
    "maxYear": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Maximum year that needs to be displayed in the year dropdown."
      },
      "attribute": "max-year",
      "reflect": false,
      "defaultValue": "new Date().getFullYear()"
    },
    "locale": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Locale for which datepicker needs to be shown. Defaults to browser's current locale."
      },
      "attribute": "locale",
      "reflect": false
    },
    "readonly": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Make the input box as readonly. Default `false`"
      },
      "attribute": "readonly",
      "reflect": false,
      "defaultValue": "false"
    },
    "disabled": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Make the datepicker box as disabled. Default `false`"
      },
      "attribute": "disabled",
      "reflect": false,
      "defaultValue": "false"
    },
    "showFooter": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Indicates if footer needs to be shown. Default `true`."
      },
      "attribute": "show-footer",
      "reflect": false,
      "defaultValue": "true"
    },
    "clearInput": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Displays a clear icon in the text box. Clicking the icon clears the value. Default `false`"
      },
      "attribute": "clear-input",
      "reflect": false,
      "defaultValue": "false"
    },
    "hintText": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Hint text displayed below the text box."
      },
      "attribute": "hint-text",
      "reflect": false,
      "defaultValue": "''"
    },
    "warningText": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Warning text displayed below the text box."
      },
      "attribute": "warning-text",
      "reflect": false,
      "defaultValue": "''"
    },
    "errorText": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Error text displayed below the text box."
      },
      "attribute": "error-text",
      "reflect": false,
      "defaultValue": "''"
    },
    "label": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Label displayed on the interface, for the component."
      },
      "attribute": "label",
      "reflect": false,
      "defaultValue": "''"
    },
    "showTimePicker": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Whether the time-picker should be shown in the date-picker. Supports single date picker only."
      },
      "attribute": "show-time-picker",
      "reflect": false,
      "defaultValue": "false"
    },
    "timeProps": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "{}",
        "resolved": "{}",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The props for the time picker. Refer the fw-timepicker for valid format."
      },
      "defaultValue": "{}"
    },
    "timeFormat": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The format of time picker ."
      },
      "attribute": "time-format",
      "reflect": false
    },
    "debounceTimer": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Debounce timer for date input."
      },
      "attribute": "debounce-timer",
      "reflect": false,
      "defaultValue": "800"
    },
    "showErrorOnInvalidDate": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Displays alert icon and tooltip when user inputs an invalid date in the textbox. Default value is true."
      },
      "attribute": "show-error-on-invalid-date",
      "reflect": false,
      "defaultValue": "true"
    },
    "tooltipErrorText": {
      "type": "any",
      "mutable": false,
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Error text displayed on the tooltip for invalid date inputs."
      },
      "attribute": "tooltip-error-text",
      "reflect": false
    },
    "fullWidth": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "To make the datepicker occupy full width of the container. Default value is false."
      },
      "attribute": "full-width",
      "reflect": false,
      "defaultValue": "false"
    },
    "hoistTooltip": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Option to prevent the tooltip from being clipped when the component is placed inside a container with\n`overflow: auto|hidden|scroll`."
      },
      "attribute": "hoist-tooltip",
      "reflect": false,
      "defaultValue": "true"
    }
  }; }
  static get states() { return {
    "showDatePicker": {},
    "year": {},
    "toYear": {},
    "monthDetails": {},
    "nextMonthDetails": {},
    "month": {},
    "todayTimestamp": {},
    "selectedDay": {},
    "startDate": {},
    "endDate": {},
    "startDateFormatted": {},
    "endDateFormatted": {},
    "dateHovered": {},
    "supportedYears": {},
    "toMonth": {},
    "firstFocusElement": {},
    "lastFocusElement": {},
    "popoverContentElement": {},
    "langModule": {},
    "shortMonthNames": {},
    "longMonthNames": {},
    "weekDays": {},
    "hasHintTextSlot": {},
    "hasWarningTextSlot": {},
    "hasErrorTextSlot": {},
    "timeValue": {},
    "dateFormat": {},
    "selectedTime": {},
    "timepickerDate": {}
  }; }
  static get events() { return [{
      "method": "fwChange",
      "name": "fwChange",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Triggered when the update button clicked"
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }, {
      "method": "fwBlur",
      "name": "fwBlur",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Triggered when the input box loses focus."
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }, {
      "method": "fwDateInput",
      "name": "fwDateInput",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Triggered when text is entered in  input box."
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "getValue": {
      "complexType": {
        "signature": "() => Promise<string | { fromDate: string; toDate: string; }>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<string | { fromDate: string; toDate: string; }>"
      },
      "docs": {
        "text": "Returns the date value in ISO format.",
        "tags": []
      }
    },
    "setFocus": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Sets focus on a specific `fw-datepicker`. Use this method instead of the global `input.focus()`.",
        "tags": []
      }
    },
    "clearValue": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Clears the input value and unselects selected date.",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "host"; }
  static get watchers() { return [{
      "propName": "locale",
      "methodName": "handleLocaleChange"
    }, {
      "propName": "minDate",
      "methodName": "handleMinDateChange"
    }, {
      "propName": "maxDate",
      "methodName": "handleMaxDateChange"
    }, {
      "propName": "value",
      "methodName": "watchValueChanged"
    }]; }
  static get listeners() { return [{
      "name": "keydown",
      "method": "handleKeyDown",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "fwFocus",
      "method": "displayDatePicker",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "fwClick",
      "method": "handleButtonClick",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "fwInput",
      "method": "handleInputChanges",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "fwChange",
      "method": "handleMonthYearDropDownSelection",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}

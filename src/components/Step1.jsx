import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localEditBooking } from '../actions';
import { validate } from '../utils'

class Step1 extends Component {
  static initFormData = {
    meal: '',
    people: 1,
  };

  static initFormValidators = {
    meal: [
      { rule: 'required', message: 'Please select a meal!' },
    ],
    people: [
      { rule: 'minNumber:1', message: 'Number of people must be between 1 and 10' },
      { rule: 'maxNumber:10', message: 'Number of people must be between 1 and 10' },
    ],
  };

  static initFormErrors = {
    meal: [],
    people: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formData: {
        ...Step1.initFormData,
        ...props.booking,
      },
      formValidators: Step1.initFormValidators,
      formErrors: Step1.initFormErrors,
    };
  }

  componentDidMount() {
    this.props.setTrigger(this.submit);
  }

  setFormData = (field, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }), this.validateField(field, value));
  };

  getFormData() {
    return {
      ...this.state.formData
    };
  }

  /** validate changed field */
  validateField = (field, value, callback) => {
    if (field && this.state.formValidators[field]) {
      const validators = this.state.formValidators[field];
      const fieldErrors = [];
      validators.forEach((validator) => {
        const isValidate = validate(validator.rule, value);
        if (!isValidate) {
          fieldErrors.push(validator.message);
        }
      });

      if (callback) callback(fieldErrors);

      this.setState(prevState => ({
        formErrors: {
          ...prevState.formErrors,
          [field]: fieldErrors,
        },
      }));
    } else {
      this.props.onError([]);
      if (callback) callback([]);
    }
  };

  validateAll = (callback) => {
    const validators = Object.keys(this.state.formData).map((field) => {
      const value = this.state.formData[field];
      return new Promise((resolve) => {
        this.validateField(field, value, err => resolve(err));
      });
    });

    Promise.all(validators).then((resp) => {
      const errors = resp.reduce((accumulator, currentValue) => accumulator.concat(currentValue));
      callback(errors);
    });
  };

  submit = (e) => {
    e.preventDefault();
    this.validateAll((errors) => {
      if (!errors.length) {
        this.doSubmit();
      }
    });
  };

  /** DO SUBMIT
   * */
  doSubmit = () => {
    // TODO: submit data (APIs)
    const data = this.getFormData();
    this.props.localEditBooking(data);

    this.props.onSubmit(true);
  };

  render() {
    return (
      <div>
        <form>
          <div>
            <label>
              Please select a meal:
              <br/>
              <select value={this.state.formData.meal} onChange={e => this.setFormData('meal', e.target.value)}>
                <option value="">---</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </label>
            <p style={{color: "red"}}>{this.state.formErrors["meal"].join(', ')}</p>
          </div>
          <div>
            <label>
              Please enter Number of people:
              <br/>
              <input style={{width: '150px'}} type="number" value={this.state.formData.people} onChange={e => this.setFormData('people', e.target.value)} />
              <p style={{color: "red"}}>{this.state.formErrors["people"].join(', ')}</p>
            </label>
          </div>
          <div>

          </div>
        </form>
      </div>
    );
  }
}

Step1.propTypes = {
  setTrigger: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  /**/
  dishes: PropTypes.array,
  localEditBooking: PropTypes.func,
};

const mapStateToProps = state => ({
  dishes: state.app.dishes.data,
  booking: state.app.booking.data,
});

const mapDispatchToProps = dispatch => ({
  localEditBooking: payload => dispatch(localEditBooking(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Step1);

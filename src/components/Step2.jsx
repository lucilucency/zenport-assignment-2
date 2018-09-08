import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localEditBooking } from '../actions';
import { validate } from '../utils'

class Step2 extends Component {
  static initFormData = {
    restaurant: '',
    dishes: [],
  };

  static initFormValidators = {
    restaurant: [
      { rule: 'required', message: 'Please select a restaurant!' },
    ],
  };

  static initFormErrors = {
    restaurant: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formData: {
        ...Step2.initFormData,
        ...props.booking,
      },
      formValidators: Step2.initFormValidators,
      formErrors: Step2.initFormErrors,
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

      this.setState(prevState => ({
        formErrors: {
          ...prevState.formErrors,
          [field]: fieldErrors,
        },
      }));

      if (callback) callback(fieldErrors);
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
    this.props.localEditBooking({
      ...this.props.booking,
      ...data,
    });

    this.props.onSubmit(true);
  };

  render() {
    const { dishes, booking } = this.props;
    const availableDishes = dishes.filter(el => el.availableMeals && el.availableMeals.includes(booking.meal)) || [];

    let restaurantDS = availableDishes.reduce((accumulator, value) => {
      if (accumulator) {
        const restaurantIndex = accumulator.findIndex(el => el.name === value.restaurant);
        if (restaurantIndex === -1) {
          accumulator.push({
            name: value.restaurant,
            dishes: [value.name]
          });
          return accumulator;
        } else {
          accumulator[restaurantIndex].dishes.push(value.name)
          return accumulator;
        }
      }
      return null;
    }, []);

    return (
      <div>
        <form>
          <div>
            <label>
              Please select a restaurant:
              <br/>
              <select value={this.state.formData.restaurant} onChange={e => {
                this.setFormData('restaurant', e.target.value);
                const r = restaurantDS.find(el => el.name === e.target.value);
                if (r) this.setFormData('dishes', r.dishes);
              }}>
                <option value="">---</option>
                {restaurantDS.map(r => (
                  <option value={r.name} key={r.name}>{r.name}</option>
                ))}
              </select>
            </label>
            <p style={{color: "red"}}>{this.state.formErrors["restaurant"].join(', ')}</p>
          </div>
        </form>
      </div>
    );
  }
}

Step2.propTypes = {
  setTrigger: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  /**/
  dishes: PropTypes.array,
  updateUserBooking: PropTypes.func,
};

const mapStateToProps = state => ({
  dishes: state.app.dishes.data,
  booking: state.app.booking.data,
});

const mapDispatchToProps = dispatch => ({
  localEditBooking: payload => dispatch(localEditBooking(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Step2);

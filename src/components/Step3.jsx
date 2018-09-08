import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { localEditBooking } from '../actions';
import { validate } from '../utils'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

class Step3 extends Component {
  static initFormData = {

  };

  static initFormValidators = {
    orders: [
      { rule: 'required', message: 'Please select a Dish and No of serving!' },
    ],
  };

  static initFormErrors = {
    orders: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      formData: {
        orders: [{
          dishes: props.booking.dishes,
          selected: '',
          servings: 1,
        }],
        ...props.booking,
      },
      formValidators: Step3.initFormValidators,
      formErrors: Step3.initFormErrors,
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

  addOrder = () => {
    const orders = this.state.formData.orders;
    const notSelectedDishes = this.props.booking.dishes.filter(el => !orders.map(o => o.selected).includes(el));
    if (notSelectedDishes && notSelectedDishes.length) {
      this.setState(prevState => ({
        formData: {
          orders: [
            ...prevState.formData.orders,
            {
              dishes: notSelectedDishes,
              selected: '',
              servings: 1,
            },
          ],
        }
      }))
    }
  };

  renderOrder = (index, dishes) => {
    const notSelectedDishes = dishes;

    return (
      <Row>
        <div>
          <label>
            Please select a Dish:
            <br/>
            <select
              value={this.state.formData.orders[index].selected}
              onChange={e => {
                const dish = e.target.value;
                this.setState(prevState => {
                  let orders = prevState.formData.orders;
                  orders[index].selected = dish;
                  return ({
                    formData: {
                      orders,
                    }
                  })
                })
              }}
            >
              <option value="">---</option>
              {notSelectedDishes.map(r => (
                <option value={r} key={r}>{r}</option>
              ))}
            </select>
          </label>
          {/*<p style={{color: "red"}}>{this.state.formErrors["orders"].join(', ')}</p>*/}
        </div>
        <div>
          <label>
            Please enter No of serving:
            <br/>
            <input
              style={{width: '50px'}}
              type="number"
              value={this.state.formData.orders[index].servings}
              onChange={e => {
                const servings = e.target.value;
                this.setState(prevState => {
                  let orders = prevState.formData.orders;
                  orders[index].servings = servings;
                  return ({
                    formData: {
                      orders,
                    }
                  })
                })
              }}
            />
          </label>
          {/*<p style={{color: "red"}}>{this.state.formErrors["orders"].join(', ')}</p>*/}
        </div>
      </Row>
    )
  };

  render() {
    const { orders } = this.state.formData;

    return (
      <div>
        <form>
          {orders.map((order, index) => {
            return (
              <div>
                {this.renderOrder(index, order.dishes)}
              </div>
            )
          })}
          <button onClick={this.addOrder}>Add</button>
        </form>
      </div>
    );
  }
}

Step3.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Step3);

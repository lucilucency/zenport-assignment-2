import dishes from './dishes.json';

const dispatchOK = (reducer, payload) => ({
  type: `OK/${reducer}`,
  payload,
});
const dispatchOKEdit = (reducer, payload) => ({
  type: `OK/EDIT/${reducer}`,
  payload,
});


const dispatchAction = (reducer) => {
  return dispatchOK(reducer, dishes["dishes"]);
};

export const getDishes = () => dispatchAction('dishes');
export const localEditBooking = payload => dispatch => dispatch(dispatchOKEdit('booking', payload));
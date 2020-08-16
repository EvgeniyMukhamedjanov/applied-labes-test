const reducer = (state, action) => {

  if (state === undefined) {
    return {
      isLoggedIn: false
    }
  }

  switch (action.type) {
    case 'SET_LOGIN_STATE':
      return {
        isLoggedIn: action.state
      }

    default:
      return state;
  }
};

export default reducer;

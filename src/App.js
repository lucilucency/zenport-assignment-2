import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getDishes } from './actions';
import { Step1, Step2, Step3, Step4 } from './components'
import logo from './logo.svg';


const AppStyled = styled.div`
.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.App-header {
  text-align: center;
  background-color: #222;
  height: 200px;
  padding: 20px;
  color: white;
}

.App-title {
  font-size: 1.5em;
}

.App-content {
  padding-top: 20px;
  width: 600px;
  margin: auto;
  text-align: left;
}

@keyframes App-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stepper-nav {
  display: flex;
  flex-direction: row;
}

.stepper-nav > div {
    
}

.stepper-nav > div.is-active {
  background-color: aqua;
}

.stepper-nav > div > a {
    display: block;
    color: white;
    text-align: center;
    padding: 16px;
    text-decoration: none;
}

.stepper-nav > div > a:hover {
    background-color: #c0ffff;
}
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      isFormValid: false,
    };

    this.steps = [{
      heading: "Step 1",
      key: "step1",
      content: <Step1
        setTrigger={(action) => {
          this.triggerSubmit = action;
          this.forceUpdate();
        }}
        onError={(err) => {
          if (err.length) {
            this.setState({ isFormValid: false });
          } else {
            this.setState({ isFormValid: true });
          }
        }}
        onSubmit={isValid => this.checkAfterSubmit(isValid, false)}
      />,
      next: e => this.triggerSubmit(e),
    }, {
      heading: "Step 2",
      key: "step2",
      content: <Step2
        setTrigger={(action) => {
          this.triggerSubmit = action;
          this.forceUpdate();
        }}
        onError={(err) => {
          if (err.length) {
            this.setState({ isFormValid: false });
          } else {
            this.setState({ isFormValid: true });
          }
        }}
        onSubmit={isValid => this.checkAfterSubmit(isValid, false)}
      />,
      next: e => this.triggerSubmit(e),
    }, {
      heading: "Step 3",
      key: "step3",
      content: <Step3
        setTrigger={(action) => {
          this.triggerSubmit = action;
          this.forceUpdate();
        }}
        onError={(err) => {
          if (err.length) {
            this.setState({ isFormValid: false });
          } else {
            this.setState({ isFormValid: true });
          }
        }}
        onSubmit={isValid => this.checkAfterSubmit(isValid, false)}
      />,
      next: e => this.triggerSubmit(e),
    }, {
      heading: "Review",
      key: "step4",
      content: <Step4
        setTrigger={(action) => {
          this.triggerSubmit = action;
          this.forceUpdate();
        }}
        onError={(err) => {
          if (err.length) {
            this.setState({ isFormValid: false });
          } else {
            this.setState({ isFormValid: true });
          }
        }}
        onSubmit={isValid => {
          console.log('abc')
        }}
      />,
      next: e => this.triggerSubmit(e),
    }]
  }

  componentDidMount() {
    this.props.getDishes();
  }

  checkAfterSubmit = (isValid, isEnd, callback) => {
    if (isValid) {
      if (isEnd) {
        this.end(callback);
      } else {
        this.next(callback)
      }
    }
  };

  next = (callback) => {
    const lastIndex = this.steps.length - 1;
    this.setState({
      stepIndex: this.state.stepIndex < lastIndex ? this.state.stepIndex + 1 : lastIndex,
      isFormValid: false,
    }, callback);
  };

  previous = (callback) => {
    this.setState({
      stepIndex: this.state.stepIndex > 0 ? this.state.stepIndex - 1 : 0,
      isFormValid: false,
    }, callback);
  };

  end = (callback) => {
    const lastIndex = this.steps.length - 1;
    this.setState({
      stepIndex: lastIndex,
    }, callback);
  };

  render() {
    const { stepIndex } = this.state;
    const step = this.steps[stepIndex];

    return (
      <AppStyled>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
            <div className="stepper-nav">
              {this.steps.map((el, index) => (
                <div className={index === stepIndex ? 'is-active' : ''} key={el.key}><a href={`#${el.key}`}>{el.heading}</a></div>
              ))}
            </div>
          </header>
          <div className="App-content">
            {step && (
              <div>
                <div>
                  {step.content}
                </div>
                <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                  {stepIndex !== 0 && <button className="btn-back" onClick={e => this.previous()}>Previous</button>}
                  {stepIndex !== this.steps.length - 1 && <button className="btn-next" onClick={step.next}>Next</button>}
                  {stepIndex === this.steps.length - 1 && <button className="btn-end" onClick={step.end}>Submit</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </AppStyled>
    );
  }
}

const mapStateToProps = state => ({
  dishes: state.app.dishes.data,
});

const mapDispatchToProps = dispatch => ({
  getDishes: () => dispatch(getDishes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

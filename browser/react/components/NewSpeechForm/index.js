import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable' 
// import validate from './validate'

const renderField = ({ input, label, type, meta: { touched, error }, onChangeAction }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label} onChange={ event => {
        onChangeAction(event.target.value);
        input.onChange(event);
      }}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const NewSpeechForm = (props) => {
  const { wpm, speechText, handleSubmit, pristine, reset, submitting, onChange } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="speechText" type="text" component={renderField} label="Speech Text" onChangeAction={onChange} />
      <Field name="wpm" type="number" component={renderField} label="Words Per Minute" onChangeAction={onChange}/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'immutableExample',  // a unique identifier for this form
  // validate
})(NewSpeechForm)
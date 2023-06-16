import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import TextField from '../../components/TextField';

test('TextField', () => {
  const label = 'Test Label';
  const name = 'testName';
  const value = 'testValue';
  const onChange = jest.fn();
  const { getByLabelText } = render(
    <Formik initialValues={{ [name]: value }} onSubmit={() => {}}>
      <TextField label={label} name={name} onChange={onChange} />
    </Formik>
  );
  const input = getByLabelText(label);
  expect(input.value).toBe(value);
  fireEvent.change(input, { target: { value: 'newValue' } });
  expect(onChange).toHaveBeenCalled();
});

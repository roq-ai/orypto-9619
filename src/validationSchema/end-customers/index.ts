import * as yup from 'yup';

export const endCustomerValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
});

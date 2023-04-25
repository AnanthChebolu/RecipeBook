import React from 'react';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import http from '../../utils/http';
import { useAuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm: React.FunctionComponent = () => {
    const navigate = useNavigate();

    // source: https://stackoverflow.com/questions/52483260/validate-phone-number-with-yup
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object({
        first_name: yup.string().optional().required('First name is a required field'),
        last_name: yup.string().optional().required('Last name is a required field'),
        phone_number: yup.string().matches(phoneRegExp, 'Phone number is not valid').optional(),
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup.string().min(6).required(),
        confirm_password: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords do not match')
            .required('Confirm your password')
    });

    const initialValues = {
        first_name: '',
        last_name: '',
        phone_number: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    };

    const registerFormik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setSubmitting(true);

            try {
                const res = await http.post('/accounts/register/', values);
                navigate('/login');
            } catch (e: any) {
                const { response } = e;
                Object.keys(response.data).forEach((key) => setFieldError(key, response.data[key]));
            }

            setSubmitting(false);
        }
    });

    return (
        <Card>
            <CardContent>
                <Stack spacing={3}>
                    <Stack spacing={4}>
                        <Typography variant="h3">
                            <strong>Easy Chef</strong>
                        </Typography>

                        <Typography variant="h4">
                            <strong>Create an account</strong>
                        </Typography>
                    </Stack>

                    <FormikProvider value={registerFormik}>
                        <Form>
                            <Stack spacing={2}>
                                <TextField
                                    key="register-first_name-field"
                                    id="first_name"
                                    name="first_name"
                                    label="First Name"
                                    value={registerFormik.values.first_name}
                                    onChange={registerFormik.handleChange}
                                    error={
                                        registerFormik.touched.first_name &&
                                        Boolean(registerFormik.errors.first_name)
                                    }
                                    helperText={
                                        registerFormik.touched.first_name &&
                                        registerFormik.errors.first_name
                                    }
                                />

                                <TextField
                                    key="register-last_name-field"
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    label="Last Name"
                                    value={registerFormik.values.last_name}
                                    onChange={registerFormik.handleChange}
                                    error={
                                        registerFormik.touched.last_name &&
                                        Boolean(registerFormik.errors.last_name)
                                    }
                                    helperText={
                                        registerFormik.touched.last_name &&
                                        registerFormik.errors.last_name
                                    }
                                />

                                <TextField
                                    key="register-email-field"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={registerFormik.values.email}
                                    onChange={registerFormik.handleChange}
                                    error={
                                        registerFormik.touched.email &&
                                        Boolean(registerFormik.errors.email)
                                    }
                                    helperText={
                                        registerFormik.touched.email && registerFormik.errors.email
                                    }
                                />

                                <TextField
                                    key="register-username-field"
                                    id="username"
                                    name="username"
                                    label="Username"
                                    value={registerFormik.values.username}
                                    onChange={registerFormik.handleChange}
                                    error={
                                        registerFormik.touched.username &&
                                        Boolean(registerFormik.errors.username)
                                    }
                                    helperText={
                                        registerFormik.touched.username &&
                                        registerFormik.errors.username
                                    }
                                />

                                <TextField
                                    key="register-password-field"
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={registerFormik.values.password}
                                    onChange={registerFormik.handleChange}
                                    error={
                                        registerFormik.touched.password &&
                                        Boolean(registerFormik.errors.password)
                                    }
                                    helperText={
                                        registerFormik.touched.password &&
                                        registerFormik.errors.password
                                    }
                                />

                                <TextField
                                    key="register-confirm_password-field"
                                    id="confirm_password"
                                    name="confirm_password"
                                    label="Confirm Password"
                                    type="password"
                                    value={registerFormik.values.confirm_password}
                                    onChange={registerFormik.handleChange}
                                    error={
                                        registerFormik.touched.confirm_password &&
                                        Boolean(registerFormik.errors.confirm_password)
                                    }
                                    helperText={
                                        registerFormik.touched.confirm_password &&
                                        registerFormik.errors.confirm_password
                                    }
                                />
                                <div>
                                    <Button
                                        disabled={registerFormik.isSubmitting}
                                        variant="contained"
                                        color="info"
                                        type="submit"
                                    >
                                        Register
                                    </Button>
                                </div>
                                <Link to="/login">Already have an account?</Link>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;

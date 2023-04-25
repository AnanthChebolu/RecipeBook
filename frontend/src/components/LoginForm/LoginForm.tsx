import React from 'react';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import http from '../../utils/http';
import { useAuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm: React.FunctionComponent = () => {
    const navigate = useNavigate();

    const { setToken } = useAuthContext();

    const validationSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().required()
    });

    const initialValues = {
        username: '',
        password: ''
    };

    const loginFormik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setSubmitting(true);

            try {
                const res = await http.post('/accounts/login/', values);

                if (res.status === 200) {
                    setToken(res.data.access);
                }

                navigate('/');
            } catch (e: any) {
                const { response } = e;
                if ('detail' in response.data) setFieldError('password', response.data['detail']);
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
                            <strong>Login to your account</strong>
                        </Typography>
                    </Stack>

                    <FormikProvider value={loginFormik}>
                        <Form>
                            <Stack spacing={2}>
                                <TextField
                                    key="login-username-field"
                                    id="username"
                                    name="username"
                                    label="Username"
                                    value={loginFormik.values.username}
                                    onChange={loginFormik.handleChange}
                                    error={
                                        loginFormik.touched.username &&
                                        Boolean(loginFormik.errors.username)
                                    }
                                    helperText={
                                        loginFormik.touched.username && loginFormik.errors.username
                                    }
                                />

                                <TextField
                                    key="login-password-field"
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={loginFormik.values.password}
                                    onChange={loginFormik.handleChange}
                                    error={
                                        loginFormik.touched.password &&
                                        Boolean(loginFormik.errors.password)
                                    }
                                    helperText={
                                        loginFormik.touched.password && loginFormik.errors.password
                                    }
                                />

                                <div>
                                    <Button
                                        disabled={loginFormik.isSubmitting}
                                        variant="contained"
                                        color="info"
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                </div>
                                <Link to="/register">Don't have an account?</Link>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default LoginForm;

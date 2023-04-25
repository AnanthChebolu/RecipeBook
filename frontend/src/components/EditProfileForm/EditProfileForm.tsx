import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import UserAvatar from '../UserAvatar/UserAvatar';
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../utils/http';
import { useAuthContext } from '../../context/AuthContext';
import { KeyedMutator } from 'swr';

interface EditProfileFormProps {
    mediaHeight?: number;
    avatarURL?: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    mutate: KeyedMutator<any>;
}

const EditProfileForm: React.FunctionComponent<EditProfileFormProps> = (
    props: EditProfileFormProps
) => {
    // source for image upload: https://www.youtube.com/watch?v=YOGgaYUW1OA
    const [image, setImage] = useState<File | null>(null);

    function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event.target.files ? event.target.files[0] : null);
        setImage(event.target.files ? event.target.files[0] : null);
    }

    // source: https://stackoverflow.com/questions/52483260/validate-phone-number-with-yup
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object({
        first_name: yup.string().optional().required('First name is a required field'),
        last_name: yup.string().optional().required('Last name is a required field'),
        phone_number: yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
        email: yup.string().email().required(),
        password: yup.string().min(6),
        confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords do not match')
    });

    const { getAxiosConfig } = useAuthContext();

    let initialValues = {
        avatarURL: props.avatarURL,
        first_name: props.firstName,
        last_name: props.lastName,
        email: props.email,
        phone_number: props.phoneNumber,
        password: '',
        confirm_password: ''
    };

    const editProfileFormik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true, // source: https://github.com/jaredpalmer/formik/issues/811
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setSubmitting(true);

            const newValues: {
                email: string;
                first_name: string;
                last_name: string;
                password?: string;
                phone_number?: string;
            } = {
                email: values.email,
                first_name: values.first_name,
                last_name: values.last_name
            };

            // Taking care of image upload here too
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);

            if (values.password) {
                newValues.password = values.password;
                formData.append('password', values.password);
            }

            if (values.phone_number) {
                newValues.phone_number = values.phone_number;
                formData.append('phone_number', values.phone_number);
            }

            if (image) {
                formData.append('avatar', image, image.name);
            }

            try {
                const res = await http.patchForm(
                    '/accounts/profile/edit/',
                    formData,
                    getAxiosConfig()
                );

                await props.mutate();
            } catch (e: any) {
                const { response } = e;
                Object.keys(response.data).forEach((key) => setFieldError(key, response.data[key]));
            }

            setSubmitting(false);
        }
    });

    let pfp;

    let name;
    if (props.firstName && props.lastName) {
        name = `${props.firstName} ${props.lastName}`;
    } else {
        name = props.username;
    }

    pfp = <UserAvatar name={name} />;

    return (
        <Card key="Profile-Edit-Form">
            <CardContent>
                <Stack>
                    <Typography variant="h5">Edit your profile</Typography>
                    <CardHeader
                        avatar={
                            initialValues.avatarURL ? <Avatar src={initialValues.avatarURL} /> : pfp
                        }
                        title={props.username}
                        subheader={props.email}
                        titleTypographyProps={{ fontSize: 'large' }}
                        subheaderTypographyProps={{ fontSize: 'large' }}
                    />

                    <FormikProvider value={editProfileFormik}>
                        <Form encType="multipart/form-data">
                            <Stack spacing={2}>
                                <Button variant="outlined" component="label">
                                    Upload Avatar {image ? `(${image.name})` : ''}
                                    <input
                                        name="avatar"
                                        id="avatar-upload"
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleImage}
                                    />
                                </Button>
                                <TextField
                                    key="edit-first_name-field"
                                    id="first_name"
                                    name="first_name"
                                    label="First Name"
                                    value={editProfileFormik.values.first_name}
                                    onChange={editProfileFormik.handleChange}
                                    error={
                                        editProfileFormik.touched.first_name &&
                                        Boolean(editProfileFormik.errors.first_name)
                                    }
                                    helperText={
                                        editProfileFormik.touched.first_name &&
                                        editProfileFormik.errors.first_name
                                    }
                                />

                                <TextField
                                    fullWidth
                                    key="edit-last_name-field"
                                    id="last_name"
                                    name="last_name"
                                    label="Last Name"
                                    value={editProfileFormik.values.last_name}
                                    onChange={editProfileFormik.handleChange}
                                    error={
                                        editProfileFormik.touched.last_name &&
                                        Boolean(editProfileFormik.errors.last_name)
                                    }
                                    helperText={
                                        editProfileFormik.touched.last_name &&
                                        editProfileFormik.errors.last_name
                                    }
                                />

                                <TextField
                                    key="edit-phone_number-field"
                                    id="phone_number"
                                    name="phone_number"
                                    label="Phone Number"
                                    type="tel"
                                    value={editProfileFormik.values.phone_number}
                                    onChange={editProfileFormik.handleChange}
                                    error={
                                        editProfileFormik.touched.phone_number &&
                                        Boolean(editProfileFormik.errors.phone_number)
                                    }
                                    helperText={
                                        editProfileFormik.touched.phone_number &&
                                        editProfileFormik.errors.phone_number
                                    }
                                />

                                <TextField
                                    key="edit-email-field"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={editProfileFormik.values.email}
                                    onChange={editProfileFormik.handleChange}
                                    error={
                                        editProfileFormik.touched.email &&
                                        Boolean(editProfileFormik.errors.email)
                                    }
                                    helperText={
                                        editProfileFormik.touched.email &&
                                        editProfileFormik.errors.email
                                    }
                                />

                                <Stack spacing={2} direction="row">
                                    <TextField
                                        fullWidth
                                        key="edit-password-field"
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={editProfileFormik.values.password}
                                        onChange={editProfileFormik.handleChange}
                                        error={
                                            editProfileFormik.touched.password &&
                                            Boolean(editProfileFormik.errors.password)
                                        }
                                        helperText={
                                            editProfileFormik.touched.password &&
                                            editProfileFormik.errors.password
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        key="confirm-edit-password-field"
                                        id="confirm_password"
                                        name="confirm_password"
                                        label="Confirm Password"
                                        type="password"
                                        value={editProfileFormik.values.confirm_password}
                                        onChange={editProfileFormik.handleChange}
                                        error={
                                            editProfileFormik.touched.confirm_password &&
                                            Boolean(editProfileFormik.errors.confirm_password)
                                        }
                                        helperText={
                                            editProfileFormik.touched.confirm_password &&
                                            editProfileFormik.errors.confirm_password
                                        }
                                    />
                                </Stack>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={editProfileFormik.isSubmitting}
                                >
                                    Save
                                </Button>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default EditProfileForm;

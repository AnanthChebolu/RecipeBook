import React, { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import http from '../../../utils/http';
import { useAuthContext } from '../../../context/AuthContext';

export interface CommentProps {
    recipeID: string;
}

export const CommentField: React.FunctionComponent<CommentProps> = ({ recipeID }) => {
    const [richTextValue, setRichTextValue] = useState('');
    const { getAxiosConfig } = useAuthContext();
    const formik = useFormik({
        initialValues: {
            recipeId: recipeID
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                console.log(richTextValue);
                const myPost = await http.post(
                    `/recipes/${values.recipeId}/comments/add/`,
                    { text: richTextValue },
                    getAxiosConfig()
                );
            } catch (e: any) {}
            setSubmitting(false);
        }
    });

    return (
        <Container maxWidth="xl">
            <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                        <Stack spacing={2}>
                            <ReactQuill
                                theme="snow"
                                placeholder="Tell us what you think!"
                                value={richTextValue}
                                style={{
                                    maxWidth: '100%',
                                    height: '300px'
                                }}
                                onChange={setRichTextValue}
                            />
                        </Stack>
                        <Button
                            disabled={formik.isSubmitting}
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            <Typography variant="subtitle1">Comment</Typography>
                        </Button>
                    </Stack>
                </Form>
            </FormikProvider>
        </Container>
    );
};

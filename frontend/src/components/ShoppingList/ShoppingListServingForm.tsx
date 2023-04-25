import React from 'react';
import { Form, Formik } from 'formik';
import http from '../../utils/http';
import * as yup from 'yup';
import { Recipe } from './ShoppingList';
import { KeyedMutator } from 'swr';
import { useAuthContext } from '../../context/AuthContext';
import { Button, TextField, Typography } from '@mui/material';

interface ShoppingListServingFormProps {
    recipe: Recipe;
    mutate: KeyedMutator<any>;
}

const ShoppingListServingForm: React.FunctionComponent<ShoppingListServingFormProps> = (
    props: ShoppingListServingFormProps
) => {
    const { getAxiosConfig } = useAuthContext();

    const validationSchema = yup.object({
        num_servings: yup.number().min(0).required()
    });
    const initialValues = { num_servings: props.recipe.servings };

    const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
        setSubmitting(true);
        const url = `/recipes/${props.recipe.id}/add-to-shopping-list/`;

        try {
            await http.post(url, values, getAxiosConfig());
            await props.mutate();
        } catch (e) {}

        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange }) => (
                <Form>
                    <div style={{ marginBottom: 5 }}>
                        <TextField
                            sx={{ width: '50%' }}
                            size="small"
                            id={`${props.recipe.id}num_servings`}
                            label="Servings"
                            name="num_servings"
                            type="number"
                            value={values.num_servings}
                            onChange={handleChange}
                            error={touched.num_servings && Boolean(errors.num_servings)}
                            helperText={touched.num_servings && errors.num_servings}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </div>
                    <Button size="small" variant="contained" type="submit" sx={{ width: '20%' }}>
                        Save
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ShoppingListServingForm;

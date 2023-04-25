//@ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import { useAuthContext } from '../../context/AuthContext';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import http from '../../utils/http';
import useSWR, { mutate } from 'swr';
import * as yup from 'yup';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import { string } from 'yup';
import { ModalContext } from '../Interactions/EditButton/EditButton';

const validateNums = (value: any) => {
    let error;
    if (!/^\d*[1-9]\d*$/.test(value)) {
        error = 'Must be a positive integer';
    }
    return error;
};

const cleanData = (data: any) => {
    data.name = data.name ? data.name : '';
    for (const diet of data.diets) {
        diet.name = diet.name ? diet.name : '';
    }
    for (const cuisine of data.cuisines) {
        cuisine.name = cuisine.name ? cuisine.name : '';
    }
    for (const ingredient of data.ingredients) {
        ingredient.name = ingredient.name ? ingredient.name : '';
        ingredient.units = ingredient.units ? ingredient.units : '';
        ingredient.quantity = ingredient.quantity && ingredient ? ingredient.quantity : 1;
    }
    for (const instruction of data.instructions) {
        instruction.instruction = instruction.instruction ? instruction.instruction : '';
        instruction.prep_time = instruction.prep_time ? instruction.prep_time : 0;
        instruction.cooking_time = instruction.cooking_time ? instruction.cooking_time : 0;
        instruction.instruction_number = instruction.instruction_number
            ? instruction.instruction_number
            : 1;
        instruction.images = instruction.images ? instruction.images : [];
        instruction.videos = instruction.videos ? instruction.videos : [];
    }
    data.num_servings = data.num_servings ? data.num_servings : 1;
    data.overall_cooking_time = data.overall_cooking_time ? data.overall_cooking_time : 0;
    data.overall_prep_time = data.overall_prep_time ? data.overall_prep_time : 0;
    data.images = data.images ? data.images : [];
    data.videos = data.videos ? data.videos : [];
};

interface EditRecipeProps {
    recipeId: string;
    data: any;
}
interface LengthProp {
    [key: number]: number;
}

export const EditRecipe: React.FunctionComponent<EditRecipeProps> = (props: EditRecipeProps) => {
    cleanData(props.data);
    const [step_images, setStepImages] = useState<any[][]>([[]]);
    const [step_videos, setStepVideos] = useState<any[][]>([[]]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [stepImagesLength, setStepImagesLength] = useState<LengthProp>({});
    const [stepVideosLength, setStepVideosLength] = useState<LengthProp>({});

    const handleImageChange = (step: number, numImages: number) => {
        setStepImagesLength({ ...stepImagesLength, [step]: numImages });
    };
    const handleVideo = (step: number, numVideos: number) => {
        setStepVideosLength({ ...stepVideosLength, [step]: numVideos });
    };

    const navigate = useNavigate();
    const [init_vals, setInitVals] = useState(props.data);
    const [searchParams] = useSearchParams();
    const base_recipe_id = searchParams.get('base_recipe_id');
    const { getAxiosConfig } = useAuthContext();
    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);
    const base_recipe_data = useSWR(
        () => (base_recipe_id ? `/recipes/${base_recipe_id}/view/` : null),
        fetcher
    );
    const { handleClose } = useContext(ModalContext);
    const ingredient_data = useSWR(`/recipes/ingredients/`, fetcher);

    useEffect(() => {
        if (base_recipe_data.data) {
            cleanData(base_recipe_data.data);
            setInitVals(base_recipe_data.data);
            for (const ingredient of ingredients) {
                ingredient.label = ingredient.name;
            }
        }
        if (ingredient_data.data) {
            setIngredients(ingredient_data.data);
        }
    }, [base_recipe_data, ingredient_data, base_recipe_data.error, ingredient_data.error]);

    if (base_recipe_data.error || ingredient_data.error) {
        return <h1>ERROR</h1>;
    }

    if (base_recipe_data.isLoading || ingredient_data.isLoading) {
        return <h1>LOADING</h1>;
    }
    // @ts-ignore
    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            minWidth={'m'}
        >
            <Avatar sx={{ m: 1 }}>
                <CookieIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Edit recipe
            </Typography>

            <Formik
                initialValues={init_vals}
                enableReinitialize
                onSubmit={async (values, { setSubmitting }) => {
                    /*
                     * When making post request, make individual request for images and videos AFTER CREATING THE RECIPE
                     * HttpPostForm using id of newly created recipe.
                     *
                     * Use getParams to get QUERYPARAMETER ID. IF there is one, get the recipe, if not, leave blank,  query parameter is baser_recipe_id=...
                     * */
                    setSubmitting(true);

                    try {
                        let total_cooking = 0;
                        let total_prep = 0;
                        for (const instruction of values.instructions) {
                            total_cooking += instruction.cooking_time;
                            total_prep += instruction.prep_time;
                        }

                        values.overall_cooking_time = total_cooking;
                        values.overall_prep_time = total_prep;

                        if (base_recipe_data && base_recipe_data.data) {
                            // @ts-ignore
                            values.base_recipe_id = base_recipe_data.data.id;
                        }

                        const res = await http.patch(
                            `/recipes/${props.recipeId}/edit/`,
                            values,
                            getAxiosConfig()
                        );

                        if (res.status === 200) {
                            const id = res.data.id;
                            console.log('images submit', images);
                            for (const imageList of images) {
                                for (const image of imageList) {
                                    try {
                                        console.log('image', image);
                                        const post_data = { recipe: id, image: image };
                                        const res = await http.postForm(
                                            'recipes/upload/image/',
                                            post_data,
                                            getAxiosConfig()
                                        );
                                        if (res.status === 201) {
                                            console.log('image upload', 'UPLOADED!');
                                        }
                                    } catch (e: any) {
                                        const { response } = e;
                                        console.log('upload error', response);
                                    }
                                }
                            }
                            for (const videoList of videos) {
                                for (const video of videoList) {
                                    try {
                                        console.log('video', video);
                                        const post_data = { recipe: id, video: video };
                                        const res = await http.postForm(
                                            '/recipes/upload/video/',
                                            post_data,
                                            getAxiosConfig()
                                        );
                                        if (res.status === 201) {
                                            console.log('video upload', 'UPLOADED!');
                                        }
                                    } catch (e: any) {
                                        const { response } = e;
                                        console.log('upload error', response);
                                    }
                                }
                            }
                            for (let i = 0; i < step_videos.length; i++) {
                                for (const videoList of step_videos[i]) {
                                    for (const video of videoList) {
                                        try {
                                            const post_data = {
                                                instruction_number: i + 1,
                                                recipe: id,
                                                video: video
                                            };
                                            const res = await http.postForm(
                                                '/recipes/instructions/upload/video/',
                                                post_data,
                                                getAxiosConfig()
                                            );
                                            if (res.status === 201) {
                                                console.log('video upload', 'UPLOADED!');
                                            }
                                        } catch (e: any) {
                                            const { response } = e;
                                            console.log('upload error', response);
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < step_images.length; i++) {
                                for (const imageList of step_images[i]) {
                                    for (const image of imageList) {
                                        try {
                                            const post_data = {
                                                instruction_number: i + 1,
                                                recipe: id,
                                                image: image
                                            };
                                            const res = await http.postForm(
                                                '/recipes/instructions/upload/image/',
                                                post_data,
                                                getAxiosConfig()
                                            );
                                            if (res.status === 201) {
                                                console.log('image upload', 'UPLOADED!');
                                            }
                                        } catch (e: any) {
                                            const { response } = e;
                                            console.log('upload error', response);
                                        }
                                    }
                                }
                            }
                            handleClose();
                            await mutate(`/recipes/${id}/view/`);
                            navigate(`/recipes/${id}`);
                        }
                    } catch (e: any) {
                        const { response } = e;
                        console.log('error', response, e);
                    }

                    setSubmitting(false);
                }}
            >
                {/*Recipe name, cuisine and diet*/}
                {({ values, errors, touched, handleChange, setFieldValue }) => (
                    <Form>
                        <Box sx={{ mt: 1 }}>
                            <Field
                                as={TextField}
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Recipe name"
                                name="name"
                                autoFocus
                            />
                            <Grid container spacing={2}>
                                <Grid item>
                                    <FieldArray
                                        name={'cuisines'}
                                        render={({
                                            move,
                                            swap,
                                            push,
                                            insert,
                                            unshift,
                                            pop,
                                            form
                                        }) => (
                                            <div>
                                                {form.values.cuisines.map(
                                                    (cuisine: any, index: number) => (
                                                        <div key={index}>
                                                            <Field
                                                                as={TextField}
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                id={`cuisines[${index}].name`}
                                                                label="Cuisine"
                                                                name={`cuisines[${index}].name`}
                                                                autoFocus
                                                            />
                                                        </div>
                                                    )
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    size="medium"
                                                    onClick={() => {
                                                        push({
                                                            name: ''
                                                        });
                                                    }}
                                                >
                                                    Add a Cuisine
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </Grid>
                                <Grid item>
                                    <FieldArray
                                        name={'diets'}
                                        render={({ push, form }) => (
                                            <div>
                                                {form.values.diets.map(
                                                    (diet: any, index: number) => (
                                                        <div key={index}>
                                                            <Field
                                                                as={TextField}
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                id={`diets[${index}].name`}
                                                                label="Diet"
                                                                name={`diets[${index}].name`}
                                                                autoFocus
                                                            />
                                                        </div>
                                                    )
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    size="medium"
                                                    onClick={() => {
                                                        push({
                                                            name: ''
                                                        });
                                                    }}
                                                >
                                                    Add a Diet
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {/*Ingredient creation*/}
                            <Divider
                                sx={{
                                    '&::before, &::after': {
                                        borderColor: 'black'
                                    }
                                }}
                            >
                                INGREDIENTS
                            </Divider>

                            <FieldArray
                                name={'ingredients'}
                                render={({ move, swap, push, insert, unshift, pop, form }) => (
                                    <div>
                                        {form.values.ingredients.map(
                                            (instruction: any, index: number) => (
                                                <div key={index}>
                                                    {/** both these conventions do the same  */}
                                                    <Typography component="h1" variant="h6">
                                                        Ingredient {index + 1}
                                                    </Typography>
                                                    <Field
                                                        name={`ingredients[${index}].name`}
                                                        id={`ingredients[${index}].name`}
                                                        as={Autocomplete}
                                                        freeSolo
                                                        disablePortal
                                                        options={ingredients.map((o) => o.name)}
                                                        selectOnFocus
                                                        clearOnBlur
                                                        handleHomeEndKeys
                                                        value={form.values.ingredients[index].name}
                                                        onChange={(e: any, value: any) => {
                                                            form.setFieldValue(
                                                                `ingredients[${index}].name`,
                                                                value !== null
                                                                    ? value
                                                                    : form.values.ingredients[index]
                                                                          .name
                                                            );
                                                        }}
                                                        renderInput={(params: any) => (
                                                            <Field
                                                                as={TextField}
                                                                {...params}
                                                                label="Ingredient"
                                                                name={`ingredients[${index}].name`}
                                                            />
                                                        )}
                                                    />
                                                    <FormControl
                                                        sx={{ minWidth: 80, marginTop: 2 }}
                                                        fullWidth
                                                    >
                                                        <Grid item>
                                                            <Field
                                                                as={TextField}
                                                                id={`ingredients[${index}].units`}
                                                                name={`ingredients[${index}].units`}
                                                                value={
                                                                    form.values.ingredients[index]
                                                                        .units
                                                                }
                                                                onChange={form.handleChange}
                                                                fullWidth
                                                                select
                                                                label="Unit"
                                                                type={'text'}
                                                            >
                                                                <MenuItem value={'tsp'}>
                                                                    teaspoon
                                                                </MenuItem>
                                                                <MenuItem value={'tbs'}>
                                                                    tablespoon
                                                                </MenuItem>
                                                                <MenuItem value={'cup'}>
                                                                    cup
                                                                </MenuItem>
                                                                <MenuItem value={'oz'}>
                                                                    ounce
                                                                </MenuItem>
                                                                <MenuItem value={'mg'}>
                                                                    milligram
                                                                </MenuItem>
                                                                <MenuItem value={'g'}>
                                                                    gram
                                                                </MenuItem>
                                                                <MenuItem value={'kg'}>
                                                                    kilogram
                                                                </MenuItem>
                                                                <MenuItem value={'lbs'}>
                                                                    pounds
                                                                </MenuItem>
                                                                <MenuItem value={'mL'}>
                                                                    millilitre
                                                                </MenuItem>
                                                                <MenuItem value={'L'}>
                                                                    litre
                                                                </MenuItem>
                                                            </Field>
                                                        </Grid>
                                                    </FormControl>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            type={'number'}
                                                            id={`ingredients[${index}].quantity`}
                                                            name={`ingredients[${index}].quantity`}
                                                            label="Quantity"
                                                            value={
                                                                form.values.ingredients[index]
                                                                    .quantity
                                                            }
                                                            onChange={form.handleChange}
                                                            autoFocus
                                                            error={
                                                                errors &&
                                                                errors.ingredients &&
                                                                errors.ingredients[index]
                                                            }
                                                            validate={validateNums}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        {errors &&
                                                            errors.ingredients &&
                                                            errors.ingredients[index] &&
                                                            touched &&
                                                            touched.ingredients &&
                                                            touched.ingredients[index] && (
                                                                <Typography
                                                                    className="field-error"
                                                                    color={'error'}
                                                                >
                                                                    Quantity must be greater than 0
                                                                </Typography>
                                                            )}
                                                    </Grid>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            onClick={() => {
                                                push({
                                                    name: '',
                                                    units: '',
                                                    quantity: 1
                                                });
                                            }}
                                        >
                                            Add an ingredient
                                        </Button>
                                    </div>
                                )}
                            />

                            <Divider
                                sx={{
                                    '&::before, &::after': {
                                        borderColor: 'black'
                                    }
                                }}
                            >
                                STEPS
                            </Divider>
                            {/*Step creation*/}

                            <Grid container direction={'column'}>
                                <FieldArray
                                    name={'instructions'}
                                    render={({ move, swap, push, insert, unshift, pop, form }) => (
                                        <div>
                                            {form.values.instructions.map(
                                                (instruction: any, index: number) => (
                                                    <div key={index}>
                                                        <Typography component="h1" variant="h6">
                                                            Step {index + 1}
                                                        </Typography>
                                                        <Grid item>
                                                            <Field
                                                                as={TextField}
                                                                margin="normal"
                                                                required
                                                                fullWidth
                                                                id={`instructions[${index}].instruction`}
                                                                name={`instructions[${index}].instruction`}
                                                                label="Instruction"
                                                                value={
                                                                    form.values.instructions[index]
                                                                        .instruction
                                                                }
                                                                onChange={form.handleChange}
                                                                multiline
                                                                autoFocus
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Field
                                                                as={TextField}
                                                                margin="normal"
                                                                fullWidth
                                                                type={'number'}
                                                                id={`instructions[${index}].prep_time`}
                                                                label="Prep time"
                                                                name={`instructions[${index}].prep_time`}
                                                                value={
                                                                    form.values.instructions[index]
                                                                        .prep_time
                                                                }
                                                                onChange={form.handleChange}
                                                                autoFocus
                                                                error={
                                                                    errors &&
                                                                    errors.instructions &&
                                                                    errors.instructions[index]
                                                                }
                                                                validate={validateNums}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Field
                                                                as={TextField}
                                                                margin="normal"
                                                                fullWidth
                                                                type={'number'}
                                                                id={`instructions[${index}].cooking_time`}
                                                                label="Cooking time"
                                                                name={`instructions[${index}].cooking_time`}
                                                                value={
                                                                    form.values.instructions[index]
                                                                        .cooking_time
                                                                }
                                                                onChange={form.handleChange}
                                                                autoFocus
                                                                error={
                                                                    errors &&
                                                                    errors.instructions &&
                                                                    errors.instructions[index]
                                                                }
                                                                validate={validateNums}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            {errors &&
                                                                errors.instructions &&
                                                                errors.instructions[index] &&
                                                                touched &&
                                                                touched.instructions &&
                                                                touched.instructions[index] && (
                                                                    <Typography
                                                                        className="field-error"
                                                                        color={'error'}
                                                                    >
                                                                        Prep-time and cooking time
                                                                        must be greater than 0
                                                                    </Typography>
                                                                )}
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                variant="contained"
                                                                component="label"
                                                            >
                                                                Upload a step image
                                                                <input
                                                                    hidden
                                                                    accept="image/*"
                                                                    multiple
                                                                    type="file"
                                                                    onChange={(event) => {
                                                                        let new_step_images = [
                                                                            ...step_images
                                                                        ];
                                                                        new_step_images[index].push(
                                                                            event.currentTarget
                                                                                .files
                                                                        );
                                                                        setStepImages(
                                                                            new_step_images
                                                                        );
                                                                        handleImageChange(
                                                                            index,
                                                                            step_images[index]
                                                                                .length
                                                                        );
                                                                    }}
                                                                />
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                component="label"
                                                                sx={{ marginLeft: 2 }}
                                                            >
                                                                Upload a step video
                                                                <input
                                                                    hidden
                                                                    accept="video/*"
                                                                    multiple
                                                                    type="file"
                                                                    onChange={(event) => {
                                                                        let new_step_videos = [
                                                                            ...step_videos
                                                                        ];
                                                                        new_step_videos[index].push(
                                                                            event.currentTarget
                                                                                .files
                                                                        );
                                                                        setStepVideos(
                                                                            new_step_videos
                                                                        );
                                                                        handleVideo(
                                                                            index,
                                                                            step_videos[index]
                                                                                .length
                                                                        );
                                                                    }}
                                                                />
                                                            </Button>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    textAlign: 'center',
                                                                    marginBottom: '1rem'
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        marginLeft: '1rem',
                                                                        marginRight: '1rem'
                                                                    }}
                                                                >{`${
                                                                    stepImagesLength[index]
                                                                        ? stepImagesLength[index]
                                                                        : 0
                                                                } images uploaded`}</Typography>

                                                                <Typography
                                                                    sx={{
                                                                        marginLeft: '4rem'
                                                                    }}
                                                                >{`${
                                                                    stepVideosLength[index]
                                                                        ? stepVideosLength[index]
                                                                        : 0
                                                                } videos uploaded`}</Typography>
                                                            </div>
                                                        </Grid>
                                                    </div>
                                                )
                                            )}
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{ marginTop: 2 }}
                                                    onClick={() => {
                                                        push({
                                                            instruction: '',
                                                            prep_time: 1,
                                                            cooking_time: 1,
                                                            instruction_number:
                                                                form.values.instructions[
                                                                    form.values.instructions
                                                                        .length - 1
                                                                ].instruction_number + 1
                                                        });
                                                        setStepImages([...step_images, []]);
                                                        setStepVideos([...step_videos, []]);
                                                    }}
                                                >
                                                    Add a step
                                                </Button>
                                            </Grid>
                                        </div>
                                    )}
                                />
                            </Grid>

                            <Divider
                                sx={{
                                    '&::before, &::after': {
                                        borderColor: 'black'
                                    }
                                }}
                            >
                                SUBMISSION
                            </Divider>

                            <Grid container direction={'column'} spacing={1} sx={{ marginTop: 2 }}>
                                <Grid item>
                                    <Button variant="contained" component="label">
                                        Upload a recipe image
                                        <input
                                            hidden
                                            accept="image/*"
                                            multiple
                                            type="file"
                                            id={'images'}
                                            name={'images'}
                                            onChange={(event) => {
                                                setImages([...images, event.currentTarget.files]);
                                            }}
                                        />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ marginLeft: 2 }}
                                    >
                                        Upload a recipe video
                                        <input
                                            hidden
                                            accept="video/*"
                                            multiple
                                            type="file"
                                            id={'videos'}
                                            name={'videos'}
                                            onChange={(event) => {
                                                setVideos([...videos, event.currentTarget.files]);
                                            }}
                                        />
                                    </Button>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                marginLeft: '1rem',
                                                marginRight: '1rem'
                                            }}
                                        >{`${images.length} images uploaded`}</Typography>

                                        <Typography
                                            sx={{
                                                marginLeft: '4rem'
                                            }}
                                        >{`${videos.length} videos uploaded`}</Typography>
                                    </div>
                                </Grid>
                            </Grid>

                            {/*END*/}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 2 }}
                            >
                                Edit Recipe
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

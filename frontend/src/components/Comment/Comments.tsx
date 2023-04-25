import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Form, FormikProvider, useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Button,
    Pagination,
    Container,
    Stack,
    Box,
    Typography,
    CardContent,
    Card,
    Chip,
    Avatar
} from '@mui/material';
import http from '../../utils/http';
import { useAuthContext } from '../../context/AuthContext';
import useSWR from 'swr';
import { Login } from '@mui/icons-material';
import editProfilePage from '../../pages/Profile/EditProfilePage';

interface CommentInterface {
    id: number;
    user: string;
    recipeId: string;
    text: string;
    date_created: string;
    avatar: string;
}
interface CommentsProps {
    recipeId: string;
    queryLimit: number;
}
const getDate = (date: string) => {
    const DATE = new Date(date);
    return DATE.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};
const Comment: React.FunctionComponent<CommentInterface> = (props: CommentInterface) => {
    // const parsedHTML = new DOMParser().parseFromString(props.text, 'text/html');
    // const textContent = parsedHTML.body.textContent || '';

    return (
        <Container>
            <Card variant="outlined">
                <Stack spacing={2}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack spacing={2}>
                                <Box
                                    display="flex"
                                    flexWrap="wrap"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="caption" display="block" gutterBottom>
                                        {'Posted by '}
                                        <Chip
                                            avatar={<Avatar alt="user" src={props.avatar} />}
                                            label={props.user}
                                            variant="outlined"
                                        />
                                        {' on '}
                                        {getDate(props.date_created)}
                                    </Typography>
                                </Box>
                                <div
                                    style={{
                                        width: 'auto',
                                        maxWidth: '1000px',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                    className={'ql-editor'}
                                    dangerouslySetInnerHTML={{ __html: props.text }}
                                />
                            </Stack>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>
        </Container>
    );
};
function createCommentList(data: CommentInterface[]): React.ReactElement[] {
    const commentList: React.ReactElement[] = [];
    for (let comment of data) {
        commentList.push(
            <Stack>
                <Comment
                    key={comment.id}
                    avatar={comment.avatar}
                    id={comment.id}
                    user={comment.user}
                    recipeId={comment.recipeId}
                    text={comment.text}
                    date_created={comment.date_created}
                />
            </Stack>
        );
    }
    return commentList.reverse();
}

export const Comments: React.FunctionComponent<CommentsProps> = (props: CommentsProps) => {
    const { getAxiosConfig } = useAuthContext();
    const [commentList, setCommentList] = useState<React.ReactElement[]>([]);
    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);
    const [richTextValue, setRichTextValue] = useState('');
    const url = `/recipes/${props.recipeId}/comments/`;
    const { data, error, mutate, isLoading } = useSWR(url, fetcher);
    const [comments, setComments] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        if (data) {
            setCommentList(createCommentList(data));
        }
    }, [data]);

    const totalpages = Math.ceil(commentList.length / props.queryLimit);
    const [offset, setOffset] = useState(0);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setOffset((newPage - 1) * props.queryLimit);
    };
    const formik = useFormik({
        initialValues: {
            recipeId: props.recipeId
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                const myPost = await http.post(
                    `/recipes/${values.recipeId}/comments/add/`,
                    { text: richTextValue },
                    getAxiosConfig()
                );
                await mutate();
            } catch (e: any) {}
            setSubmitting(false);
        }
    });
    useEffect(() => {
        setComments(commentList.slice(offset, offset + props.queryLimit));
    }, [offset, commentList, props.queryLimit]);
    const { token } = useAuthContext();
    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading</div>;

    return (
        <Container>
            {token && (
                <Container style={{ marginBottom: '3rem' }}>
                    <FormikProvider value={formik}>
                        <Form
                            onSubmit={(event) => {
                                formik.handleSubmit(event);
                                setTimeout(() => {
                                    setRichTextValue('');
                                }, 0);
                            }}
                        >
                            <ReactQuill
                                theme="snow"
                                placeholder="Tell us what you think!"
                                value={richTextValue}
                                style={{
                                    maxWidth: '100%',
                                    width: '100%',
                                    height: '200px'
                                }}
                                onChange={setRichTextValue}
                            />
                            <div
                                style={{
                                    marginTop: '3rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                {richTextValue &&
                                    richTextValue.replace(/<(.|\n)*?>/g, '').trim().length !==
                                        0 && (
                                        <Button
                                            disabled={formik.isSubmitting}
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                            style={{
                                                width: '10%'
                                            }}
                                        >
                                            <Typography variant="subtitle1">Comment</Typography>
                                        </Button>
                                    )}
                                {(!richTextValue ||
                                    richTextValue.replace(/<(.|\n)*?>/g, '').trim().length ===
                                        0) && (
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        style={{
                                            width: '10%'
                                        }}
                                        disabled
                                    >
                                        <Typography variant="subtitle1">Comment</Typography>
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </FormikProvider>
                </Container>
            )}

            {!token && (
                <Typography
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    Login to add a comment!
                </Typography>
            )}

            <Typography variant="h4" component="h2">
                {`Comments (${commentList.length})`}
                <hr style={{ marginTop: '0.5rem' }} />
            </Typography>
            {comments.map((element, index) => {
                return <div key={index}>{element}</div>;
            })}
            <Box paddingTop="5%" display="flex" justifyContent="center" alignItems="center">
                {commentList.length !== 0 && (
                    <Pagination
                        style={{ marginBottom: '3rem' }}
                        count={totalpages}
                        onChange={handleChangePage}
                    />
                )}
            </Box>
        </Container>
    );
};

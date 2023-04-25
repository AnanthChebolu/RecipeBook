import * as React from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import http from '../../../utils/http';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';

interface DeleteButtonProps {
    recipeId: string;
    isOwner: boolean;
}

export const DeleteButton: React.FunctionComponent<DeleteButtonProps> = (
    props: DeleteButtonProps
) => {
    const { getAxiosConfig } = useAuthContext();
    const navigate = useNavigate();
    const handleDelete = async () => {
        try {
            const response = await http.delete(
                `/recipes/${props.recipeId}/delete/`,
                getAxiosConfig()
            );
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {props.isOwner && (
                <Button
                    variant="outlined"
                    color={'error'}
                    endIcon={<DeleteIcon />}
                    onClick={handleDelete}
                >
                    Delete Recipe
                </Button>
            )}
        </div>
    );
};

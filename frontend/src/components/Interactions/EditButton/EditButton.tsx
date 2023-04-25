import * as React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { createContext, useState } from 'react';
import Modal from '@mui/material/Modal';
import { EditRecipe } from '../../EditRecipe/EditRecipe';
import { Box } from '@mui/material';

interface EditButtonProps {
    recipeId: string;
    isOwner: boolean;
    data: any;
}
export const ModalContext = createContext({
    open: false,
    handleOpen: () => {},
    handleClose: () => {}
});

export const EditButton: React.FunctionComponent<EditButtonProps> = (props: EditButtonProps) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div style={{ marginBottom: '1rem' }}>
            {props.isOwner && (
                <Button
                    variant="outlined"
                    color={'primary'}
                    endIcon={<EditIcon />}
                    onClick={handleOpen}
                >
                    Edit Recipe
                </Button>
            )}
            <ModalContext.Provider value={{ open, handleOpen, handleClose }}>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            maxHeight: '800px',
                            overflowY: 'auto',
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: 'white',
                            boxShadow: 24,
                            borderRadius: '10px',
                            p: 4
                        }}
                    >
                        <EditRecipe recipeId={props.recipeId} data={props.data} />
                    </Box>
                </Modal>
            </ModalContext.Provider>
        </div>
    );
};

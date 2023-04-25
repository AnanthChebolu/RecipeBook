import React from 'react';
import { Typography, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link as Scroll } from 'react-scroll';

export const JumptoComments: React.FunctionComponent = () => {
    return (
        <Scroll to="Comments" smooth={true}>
            <Typography variant="h6" gutterBottom>
                Read the comments here!
                <KeyboardArrowDownIcon style={{ color: '#000000' }} />
            </Typography>
        </Scroll>
    );
};

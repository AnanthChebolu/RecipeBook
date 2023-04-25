import * as React from 'react';
import Chip from '@mui/material/Chip';
import { Box, Typography } from '@mui/material';
import { green } from '@mui/material/colors';

export interface Cuisine {
    name: string;
}
export interface Diet {
    name: string;
}
interface TagsProps {
    cuisineTags: Cuisine[];
    dietTags: Diet[];
}
export const Tags: React.FunctionComponent<TagsProps> = (props: TagsProps) => {
    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: 'auto auto'
                }}
            >
                <div style={{ alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom style={{ color: '#388e3c' }}>
                        Cuisines
                    </Typography>
                </div>
                <div style={{ alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom style={{ color: '#f57c00' }}>
                        Diets
                    </Typography>
                </div>
                <div style={{ alignItems: 'center', textAlign: 'center' }}>
                    {props.cuisineTags.map((tag) => {
                        return (
                            <Chip
                                key={tag.name + 'cuisine'}
                                label={tag.name}
                                size="small"
                                component="a"
                                variant="outlined"
                                style={{
                                    color: '#388e3c',
                                    borderColor: '#388e3c',
                                    marginLeft: '10px'
                                }}
                            />
                        );
                    })}
                </div>
                <div style={{ alignItems: 'center', textAlign: 'center' }}>
                    {props.dietTags.map((tag) => {
                        return (
                            <Chip
                                key={tag.name + 'diet'}
                                label={tag.name}
                                component="a"
                                variant="outlined"
                                size="small"
                                style={{
                                    color: '#f57c00',
                                    borderColor: '#f57c00',
                                    marginLeft: '10px'
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

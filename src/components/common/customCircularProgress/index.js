import React from "react";
import PropTypes from 'prop-types';

// Material UI imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';


const CustomCircularProgress = (props)=> {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
                variant="determinate" 
                color="secondary"
                size={40}
                value={props.value}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography 
                    variant="caption" 
                    component="div" 
                    color="text.secondary"
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box> 
        </Box>
    );
}

CustomCircularProgress.propTypes= {
    value: PropTypes.number.isRequired,
}

CustomCircularProgress.defaultProps = {
    value: 0
}

export default CustomCircularProgress;
import React from "react";
import PropTypes from 'prop-types';


// Material UI imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';


const AddressCard = (props)=> {

    return (
        <Card sx={{ width: 'auto', minHeight: 210 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: deepPurple[700] }}>
                        <LocationOnOutlinedIcon />
                    </Avatar>
                }
                title={props.user}
                subheader="Delivery Address"
            />
            <Divider/>
            <CardContent>
                <Typography 
                    variant="caption" 
                    align='left' 
                    gutterBottom
                >
                    {props.addressLine1},
                </Typography>
                <Typography 
                    variant="caption" 
                    align='left' 
                    gutterBottom
                >
                    {props.addressLine2},
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Chip label={props.city} variant="outlined" />
                    <Chip label={props.state} variant="outlined" />
                    <Chip label={props.pincode} variant="filled" />
                </Stack>
            </CardContent>
        </Card>
    );
}

AddressCard.propTypes= {
    user: PropTypes.string.isRequired,
    addressLine1: PropTypes.string.isRequired,
    addressLine2: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    pincode: PropTypes.number.isRequired,
}

AddressCard.defaultProps = {
    user: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: 600000,
}

export default AddressCard;
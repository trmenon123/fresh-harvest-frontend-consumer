import React, {useState} from "react";
import PropTypes from 'prop-types';


// Material UI imports
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';


const AddressForm = (props)=> {

    const [state, setState]= useState({
        formFields: [
            {
                key: 0, 
                target:{name: 'addressLine1', label: 'Address Line 1', type:'text', value:''}
            },
            {
                key: 1, 
                target:{name: 'addressLine2', label: 'Address Line 2', type:'text', value:''}
            },
            {
                key: 2, 
                target:{name: 'city', label: 'City', type:'text', value:''}
            },
            {
                key: 3, 
                target:{name: 'state', label: 'State', type:'text', value:''}
            },
            {
                key: 4, 
                target:{name: 'pincode', label: 'Pincode', type:'number', value:''}
            }
        ]
    });

    const handleFormSubmit = ()=> {
        let data = {};
        state.formFields.forEach((element)=> {
            data[`${element.target.name}`]= element.target.value
        });
        props.update(data);
    }

    const handleFieldChange = (value, key)=> {
        let currentState = state;
        currentState.formFields[key].target['value']= value;
        setState(currentState);
        handleFormSubmit();
    }

    

    return (
        <React.Fragment>
            <Card variant="outlined">
            <CardHeader
                title={props.showAlert === true?
                    <Alert severity="error">Please eneter valid data</Alert>
                    :""
                }
            />
                <CardContent>
                    {state.formFields.map(({key, target})=> {
                        return(
                            <TextField 
                                key={key}
                                id={target.name}
                                label={target.label} 
                                variant="outlined" 
                                color="secondary"
                                fullWidth={true}
                                type={target.type}
                                defaultValue={target.value}
                                sx={{my: 1}}
                                onChange={(event)=>handleFieldChange(event.target.value, key)}
                                required
                            />
                        );
                    })}
                </CardContent>
            </Card>
            
        </React.Fragment>
    );
}

AddressForm.propTypes= {
    update: PropTypes.func.isRequired,
    showAlert: PropTypes.bool.isRequired
}

AddressForm.defaultProps = {
    update: ()=>{},
    showAlert: false
}

export default AddressForm;
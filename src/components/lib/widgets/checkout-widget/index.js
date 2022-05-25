import React, { Component} from "react";
import { AddressCard, AddressForm, CheckoutList } from '../../../common';
import farm from '../../../../assets/farmFreshConsumer.jpg';

// Material UI imports
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import { red, green } from '@mui/material/colors';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Chip from '@mui/material/Chip';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AlertTitle from '@mui/material/AlertTitle';

// Services imports
import {
    getAddress,
    addAddress,
    getActiveCarts,
    getStockMedia,
    manageCart,
    confirmTransaction
} from '../../../../services';

class CheckoutWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
          address: [],
          selectedAddress: {},
          isAddressSelected: false,
          modalOpen: false,
          newAddress: {},
          modalValidation: false,
          cart:[],
          toaster: {
                open: false,
                description: "",
                style: "success"
          },
          
        };
    }

    componentDidMount() {   
        console.log("USER DATA:");
        console.log(JSON.parse(localStorage.user)['_id']);   
        try {
            getAddress(JSON.parse(localStorage.user)['_id']).subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true &&
                        response?.data?.exist === true &&
                        Array.isArray(response?.data?.data?.address)
                    ){
                        this.setState({
                            ...this.state,
                            address: response.data.data.address,
                        },()=> {
                            this.populateInventory();
                        });
                    }

                },
                error: (error)=> {
                    console.log(error);
                }
            })
        }catch(error){
            console.log(error);
        }
    }

    componentDidUpdate() {
        console.log("Checkout Widget mounted");
        console.log(this.state);
    }

    updateAddress= ()=> {
        try {
            getAddress(JSON.parse(localStorage.user)['_id']).subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true &&
                        response?.data?.exist === true &&
                        Array.isArray(response?.data?.data?.address)
                    ){
                        this.setState({
                            ...this.state, 
                            address: response.data.data.address,
                        });
                    }
                },
                error: (error)=> {
                    console.log(error);
                }
            })
        }catch(error){
            console.log(error);
        } 
    }

    populateInventory = ()=> {
        try {
            getActiveCarts({
                createdBy: JSON.parse(localStorage.user)['_id'],
                checkout: false
            }).subscribe({
                next: (response)=> {
                    if(
                        response.success === true &&
                        response.data &&
                        Array.isArray(response.data.data)
                    ) {
                        this.setState({...this.state, cart: response.data.data}, ()=> {
                            this.state.cart.forEach((element, key)=> {
                                if(element?.stock?.mediaPresent === true) {
                                    getStockMedia(element?.stock?.mediaUrl).subscribe({
                                        next: (response)=> {
                                            let currentCart = this.state.cart;
                                            let currentElement = currentCart[key];
                                            currentElement= {...currentElement, mediaUrl : URL.createObjectURL(response)}
                                            currentCart[key] = currentElement;
                                            this.setState({...this.state, cart: currentCart});
                                        },
                                        error: (error)=> {
                                            console.log(error);
                                        }
                                    })
                                }
                            })
                        })
                        
                    }
                },
                error: (error) => {
                    console.log(error)
                },
            });
        }catch(err) {
            console.log(err);
        }
    }

    handleOpenModal= ()=> {
        this.setState({...this.state, modalOpen: true});
    }

    handleCloseModal= ()=> {
        this.setState({...this.state, modalOpen: false});
    }

    handleSelectAddress=(event, value)=> {
        this.setState({...this.state, selectedAddress: value, isAddressSelected: true});
    }

    handleUpdateFormFields = (data)=> {
        this.setState({...this.state, newAddress: data});
    }

    handleFormSubmit= ()=> {
        const newAddress = this.state.newAddress;
        if(
            newAddress.addressLine1.length === 0 ||
            newAddress.addressLine2.length === 0 ||
            newAddress.city.length === 0 ||
            newAddress.state.length === 0 ||
            newAddress.pincode.toString().length < 6
        ) {
            this.setState({...this.state, modalValidation: true});
        }else {
            const data = {...newAddress, user: JSON.parse(localStorage.user)['_id']};
            try {
                addAddress(data).subscribe({
                    next: (response)=> {
                        if(
                            response &&
                            response?.success === true
                        ){
                            this.setState({
                                ...this.state, 
                                modalOpen: false, 
                                newAddress: {}
                            }, ()=> {
                                this.updateAddress();
                            })
                            
                        }
    
                    },
                    error: (error)=> {
                        console.log(error);
                    }
                })
            }catch(error){
                console.log(error);
            }
        }
    }

    handleConfirmOrder = ()=> {
        try {
            confirmTransaction({
                user: JSON.parse(localStorage.user)['_id'],
                selectedAddress: this.state.isAddressSelected === true? this.state.selectedAddress._id: "",
            }).subscribe({
                next: (response)=> {      
                    console.log(response);              
                    this.setState({
                        ...this.state,
                        toaster: {
                            open: true,
                            description: response.message,
                            style: response.success === true? 'success': 'error'
                        },
                    });
                },
                error: (error)=> {
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: {
                            open: true,
                            description: "Unable to make request at this time. Please try again later.",
                            style: 'error'
                        },
                    });
                }
            })
        }catch(err) {
            console.log(err);
        }
    }

    handleManageCart = (data)=> {
        try {
            manageCart(data).subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true &&
                        response?.data
                    ){
                        let currentCart = this.state.cart;
                        let elementIndex = currentCart.findIndex((item)=>{
                            return item._id === response.data.data._id
                        });

                        let currentElement = currentCart.find((item)=>
                            item._id === response.data.data._id
                        );

                        console.log(elementIndex);
                        currentElement = {
                            ...currentElement,
                            quantity: response.data.data.quantity,
                            itemCost: response.data.data.itemCost,
                            stock: {
                                ...currentElement.stock,
                                stock: response.data.data.stock["stock"]
                            }
                        };
                        currentCart.splice(elementIndex, 1, currentElement);
                        this.setState({...this.state, cart: currentCart});
                    }

                },
                error: (error)=> {
                    console.log(error);
                }
            })
        }catch(error){
            console.log(error);
        }
    }

    handleToasterClose=()=> {
        this.setState({
            ...this.state,
            toaster: {
                open: false,
                description: '',
                style: 'success'
            },
        }, ()=> {
            this.populateInventory();
        });
    }

    render() {
        return(
            <React.Fragment>  
                <Snackbar 
                    open={this.state.toaster.open} 
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'right'}}
                    autoHideDuration={6000} 
                    onClose={this.handleToasterClose}
                >
                    <Alert 
                        severity={this.state.toaster.style} 
                        sx={{ width: '100%' }}
                        variant="filled"
                    >
                        {this.state.toaster.description}
                    </Alert>
                    
                </Snackbar>
                <Dialog
                    open={this.state.modalOpen}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'right'}}
                    keepMounted
                    fullWidth
                    onClose={this.handleCloseModal}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>Add a new delivery address</DialogTitle>
                    <DialogContent>
                        <AddressForm 
                            update={this.handleUpdateFormFields} 
                            showAlert={this.state.modalValidation}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="text" 
                            color="secondary"
                            size="large"
                            startIcon={<AddIcon/>} 
                            onClick={this.handleFormSubmit}
                        >
                            Add Address
                        </Button>
                    </DialogActions>
                </Dialog>              
                <Box sx={{display:{xs:'block', md:'none'}, mt:2}}>
                    <Button 
                        variant="contained" 
                        color="secondary"
                        fullWidth
                        size="large"
                        startIcon={<AddIcon/>}
                        onClick={this.handleOpenModal}
                    >
                        Add Address
                    </Button>
                    <Box 
                        sx={{
                            my: 2,
                            width: '100%', 
                            overflow: 'auto',
                            "&::-webkit-scrollbar": {
                                width: 20
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#c6cbe9"
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#9c27b0",
                                borderRadius: 2
                            }
                        }}
                    >
                        {this.state.address.length === 0?
                            <Alert severity="warning">
                                Please add an address to continue with your order
                            </Alert>
                            :
                            <ToggleButtonGroup
                                color="secondary"
                                value={this.state.selectedAddress}
                                exclusive
                                onChange={this.handleSelectAddress}
                            >
                                {this.state.address.map((element)=> {
                                    return(
                                        <ToggleButton
                                            key={`responsive-1-${element._id}`} 
                                            value={element} 
                                            fullWidth sx={{width: 'auto'}}
                                        >
                                            <AddressCard 
                                                user={JSON.parse(localStorage.user)['name']}
                                                addressLine1={element.addressLine1}
                                                addressLine2={element.addressLine2}
                                                city={element.city}
                                                state={element.state}
                                                pincode={element.pincode}
                                            />                                    
                                        </ToggleButton>
                                    );
                                })}
                            </ToggleButtonGroup>
                        }
                        
                    </Box>                    
                </Box>
                <Grid container spacing={2}>
                    <Grid 
                        item 
                        xs={4}
                        display={{xs:'none', md:'block'}}
                    >
                        <Box sx={{display:{xs:'none', md:'block'}, mt:2}}>
                            <Button 
                                variant="contained" 
                                color="secondary"
                                fullWidth
                                size="large"
                                startIcon={<AddIcon/>}
                                onClick={this.handleOpenModal}
                            >
                                Add Address
                            </Button>
                            <Box sx={{my: 2,width: '100%'}}>
                                {this.state.address.length === 0?
                                    <Alert severity="warning">
                                        Please add an address to continue with your order
                                    </Alert>
                                    :
                                    <ToggleButtonGroup
                                        color="secondary"
                                        orientation="vertical"
                                        value={this.state.selectedAddress}
                                        exclusive
                                        size="large"
                                        fullWidth
                                        onChange={this.handleSelectAddress}
                                    >
                                        {this.state.address.map((element)=> {
                                            return(
                                                <ToggleButton
                                                    key={`responsive-2-${element._id}`} 
                                                    value={element}
                                                >
                                                    <AddressCard 
                                                        user={JSON.parse(localStorage.user)['name']}
                                                        addressLine1={element.addressLine1}
                                                        addressLine2={element.addressLine2}
                                                        city={element.city}
                                                        state={element.state}
                                                        pincode={element.pincode}
                                                    />                                    
                                                </ToggleButton>
                                            );
                                        })}
                                    </ToggleButtonGroup>
                                }
                            </Box>
                        </Box>
                        
                    </Grid>
                    <Grid 
                        item 
                        xs={12}
                        md={8}
                    >
                        <Card raised={true} sx={{mt: 2, width: 'auto'}}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }}>
                                        <PointOfSaleIcon/>
                                        {}
                                    </Avatar>
                                }
                                action={
                                    <Chip 
                                        color="success" 
                                        variant="outlined"
                                        size="medium"
                                        avatar={
                                            <Avatar 
                                                sx={{ bgcolor: green[900]}}
                                            >
                                                <CurrencyRupeeIcon 
                                                    sx={{ m: 1, p: 3, color: '#fff' }} 
                                                />
                                            </Avatar>
                                        } 
                                        label={this.state.cart.reduce((a, b)=>{
                                            return a + b.itemCost;
                                        }, 0)} 
                                    />
                                }
                                title="Checkout"
                                subheader="September 14, 2016"
                            />
                            <CardMedia
                                component="img"
                                height="215"
                                image={farm}
                                alt="Fresh Harvest Checkout"
                            />                            
                            <CardContent>
                                <CheckoutList 
                                    list={this.state.cart}
                                    clickHandler={this.handleManageCart}
                                />
                            </CardContent>
                            <Divider/>
                            {this.state.isAddressSelected === false? 
                                <Alert severity="info" >
                                    <AlertTitle>Info</AlertTitle>
                                    <strong>
                                        Select a delivery address to continue
                                    </strong>
                                </Alert>
                                :""
                            }
                            <CardActions disableSpacing sx={{px: 4}}>
                                
                                <Button 
                                    variant="outlined" 
                                    color="secondary"
                                    size="large"
                                    fullWidth
                                    startIcon={<ThumbUpOffAltIcon/>}
                                    onClick={this.handleConfirmOrder}
                                    disabled={this.state.isAddressSelected === true? false: true}
                                >
                                    Confirm
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </React.Fragment>               
        )
    }
}

export default CheckoutWidget;
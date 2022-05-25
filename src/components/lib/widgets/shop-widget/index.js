import React, { Component} from "react";
import { Thumbnail, DynamicNavigator } from '../../../common';
import config from '../../../../constants/config.json';

// Material UI imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Card from '@mui/material/Card';
import { CardActionArea } from "@mui/material";
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import { deepOrange } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Badge from '@mui/material/Badge';
import ButtonGroup from '@mui/material/ButtonGroup';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Services imports
import {
    getAllStocks,
    getStockMedia,
    getActiveCarts,
    addCartItem
} from '../../../../services';

class ShopWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
          stocks: {count: 0, data: []},
          filters: {status: false, name: "", type: ""},
          renderList: [],
          cart: {open: false, data:{count: 0, data: []}},
          filter: {open: false, anchorElement: null},
          mediaMapping: []
        };
    }

    componentDidMount() {
        
        try {
            getActiveCarts({
                createdBy: JSON.parse(localStorage.user)['_id'],
                checkout: false
            }).subscribe({
                next: (response)=> {
                    if(response.success === true) {
                        console.log(response.data);
                        this.setState({
                            ...this.state,
                            cart: {...this.state.cart, data: response.data}
                        }, ()=> {
                            getAllStocks({
                                filterStatus: this.state.filters.status,
                                filterByType: this.state.filters.type,
                                filterByName: this.state.filters.name,
                            }).subscribe({
                                next: (response) => {
                                    console.log(response.data);
                                    if(
                                        response.success === true && 
                                        response.data.data &&
                                        Array.isArray(response.data.data)
                                    ){
                                        this.setState({...this.state, stocks: response?.data}, ()=> {
                                            let archivedSurplusList = this.state.stocks.data;
                                            console.log(archivedSurplusList);
                                            archivedSurplusList.forEach((value, key)=> {
                                                if(value.stock && Array.isArray(value.stock)) {
                                                    let archivedStockList = value.stock;
                                                    archivedStockList.forEach((item, id)=> {
                                                        if(item?.mediaPresent === true) {
                                                            getStockMedia(item?.mediaUrl).subscribe({
                                                                next: (resp)=> {
                                                                    archivedStockList[id].mediaUrl = URL.createObjectURL(resp);
                                                                    archivedSurplusList[key].stock = archivedStockList;
                                                                    this.setState({
                                                                        ...this.state, 
                                                                        stocks: {...this.state.stocks, data: archivedSurplusList},
                                                                        mediaMapping: [
                                                                            ...this.state.mediaMapping,
                                                                            {
                                                                                stockId: item?.stockId,
                                                                                media: URL.createObjectURL(resp)
                                                                            }
                                                                        ]
                                                                    })
                                                                },
                                                                error: (error)=> {
                                                                    console.log(error);
                                                                }
                                                            })
                                                        }
                                                    });
                                                }
                                            })
                                        });
                                        
                                    }
                                },
                                error: (error) => {
                                    console.log(error)
                                },
                            });
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
        // console.log(this.state);
    }

    updateStockList = ()=> {
        const data = {
            filterStatus: this.state.filters.status,
            filterByType: this.state.filters.type,
            filterByName: this.state.filters.name,
        };
        try {
            getAllStocks(data).subscribe({
                next: (response) => {
                    console.log(response.data);
                    if(
                        response.success === true && 
                        response.data.data &&
                        Array.isArray(response.data.data)
                    ){
                        this.setState({...this.state, stocks: response?.data}, ()=> {
                            let archivedSurplusList = this.state.stocks.data;
                            console.log(archivedSurplusList);
                            archivedSurplusList.forEach((value, key)=> {
                                if(value.stock && Array.isArray(value.stock)) {
                                    let archivedStockList = value.stock;
                                    archivedStockList.forEach((item, id)=> {
                                        if(item?.mediaPresent === true) {
                                            getStockMedia(item?.mediaUrl).subscribe({
                                                next: (resp)=> {
                                                    archivedStockList[id].mediaUrl = URL.createObjectURL(resp);
                                                    archivedSurplusList[key].stock = archivedStockList;
                                                    this.setState({
                                                        ...this.state, 
                                                        stocks: {...this.state.stocks, data: archivedSurplusList},
                                                        mediaMapping: [
                                                            ...this.state.mediaMapping,
                                                            {
                                                                stockId: item?.stockId,
                                                                media: URL.createObjectURL(resp)
                                                            }
                                                        ]
                                                    })
                                                },
                                                error: (error)=> {
                                                    console.log(error);
                                                }
                                            })
                                        }
                                    });
                                }
                            })
                        });
                        
                    }
                },
                error: (error) => {
                    console.log(error)
                },
            });
        } catch (error) {
          console.error(error.message);
        }
    }

    updateCartList = ()=> {
        const data = {
            createdBy: JSON.parse(localStorage.user)['_id'],
            checkout: false
        };
        try {
            getActiveCarts(data).subscribe({
                next: (response)=> {
                    if(response.success === true) {
                        console.log(response.data);
                        this.setState({
                            ...this.state,
                            cart: {...this.state.cart, data: response.data}
                        });
                    }
                },
                error: (error)=> {
                    console.log(error);
                }
            })
        }catch (err) {
            console.log(err);
        }
    }

    handleCartListOpen = (event) => {
        this.setState({...this.state, cart:{...this.state.cart, open: true}});
    }

    handleCartListClose = () => {        
        this.setState({...this.state, cart:{...this.state.cart, open: false}});
    }

    handleAddToCart = (element)=> {
        const data = {
            createdBy: JSON.parse(localStorage.user)['_id'],
            stockId: element?.stockId,
            quantity: 1
        };
        addCartItem(data).subscribe({
            next: (response)=> {
                const data = {
                    createdBy: JSON.parse(localStorage.user)['_id'],
                    checkout: false
                };
                try {
                    getActiveCarts(data).subscribe({
                        next: (response)=> {
                            if(response.success === true) {
                                console.log(response.data);
                                this.setState({
                                    ...this.state,
                                    cart: {...this.state.cart, data: response.data}
                                }, ()=> {
                                    this.updateStockList();
                                });
                            }
                        },
                        error: (error)=> {
                            console.log(error);
                        }
                    })
                }catch (err) {
                    console.log(err);
                }
                
            },
            error: (error)=> {
                console.log(error)
            }
        }, ()=> {
            this.updateCartList();
        })
    }

    handleFilterOpen = (event)=> {
        this.setState({
            ...this.state, 
            filter: {...this.state.filter, open: true, anchorElement: event.currentTarget}
        });
    }

    handleFilterClose = ()=> {
        this.setState({
            ...this.state, 
            filter: {...this.state.filter, open: false,anchorElement: null}
        });
    }

    handleFilterTypeSelect = (event)=> {
        if(event.target.value !== 0) {
            const typeSelected = config.serviceDictionary.surplus.types.find((element)=> {
                return element.value === event.target.value;
            })?.reference;
            this.setState({
                ...this.state,
                filters: {
                    ...this.state.filters,
                    ...this.state.filters,
                    status: true,
                    type:typeSelected
                }
            }, ()=> {
                this.handleFilterClose();
            });
        }else {
            this.setState({
                ...this.state,
                filters: {
                    ...this.state.filters,
                    ...this.state.filters,
                    type: ""
                }
            }, ()=> {
                this.handleFilterClose();
            });
        }
        
    }

    handleFilterNameChange= (event)=> {
        console.log(event.target.value);
        this.setState({
            ...this.state,
            filters: {
                ...this.state.filters,
                ...this.state.filters,
                status: true,
                name:event.target.value.toUpperCase()
            }
        });
    }

    handleFilterClick= ()=> {
        this.updateStockList();
    }

    handleResetFilter = ()=> {
        this.setState({
            ...this.state,
            filters: {
                ...this.state.filters,
                ...this.state.filters,
                status: false,
                type:"",
                name: ""
            }
        }, ()=> {
            this.updateStockList();
        });
    }

    render() {
        return(
            <React.Fragment>
                <Card raised sx={{m: 4}}>
                    <CardHeader
                        action={
                            <Box sx={{mr: 4}}>
                                <Badge 
                                    badgeContent={this.state.cart.data.count}
                                    color="info"
                                >
                                    <Fab 
                                        color="secondary" 
                                        onClick={this.handleCartListOpen}
                                    >
                                        <ShoppingBasketIcon/>
                                    </Fab>
                                </Badge>
                                
                                <Dialog
                                    open={this.state.cart.open}
                                    TransitionComponent={Slide}
                                    TransitionProps={{direction:'left'}}
                                    keepMounted
                                    fullWidth
                                    scroll="paper"
                                    onClose={this.handleCartListClose}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle>
                                        My Basket
                                    </DialogTitle>
                                    <Divider />
                                    <DialogContent>
                                        {this.state.cart.data.count === 0?
                                            <h4>Nothing Present in basket</h4>
                                            :
                                            <React.Fragment>
                                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                                    {this.state.cart.data.data.map((item)=> {
                                                        return (
                                                            <ListItem key={item?._id}>
                                                                <ListItemAvatar>
                                                                    <Avatar 
                                                                        alt={item._id} 
                                                                        src={this.state.mediaMapping.find((element)=> {
                                                                                return element.stockId === item.stock._id
                                                                            })?.media}
                                                                        variant="square"
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText 
                                                                    primary={item.stock.surplusId.name}
                                                                    secondary={item.stock.farmId.name}
                                                                />
                                                            </ListItem>                                                           
                                                        );
                                                    })}
                                                </List>
                                            </React.Fragment>
                                        }                                        
                                    </DialogContent>
                                    <DialogActions>
                                        <DynamicNavigator
                                            label="Proceed to checkout"
                                            route="checkout"
                                            disabled={this.state.cart.data.count === 0? true: false}
                                        />
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        }                        
                    />
                    <CardContent 
                        sx={{
                            display: 'flex', 
                            justifyContent: 'flex-start',
                            flexDirection: 'row'
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <TextField 
                                    id="outlined-basic" 
                                    label="Filter by name"
                                    size="small"
                                    variant="outlined"
                                    sx={{flex: 1, width: '100%'}}
                                    onChange={this.handleFilterNameChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    size="small"
                                    label="Filter type"
                                    defaultValue=''
                                    sx={{flex: 1, width: '100%'}}
                                    onChange={this.handleFilterTypeSelect}
                                >
                                    {config.serviceDictionary.surplus.types.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.reference}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>                        
                    </CardContent>
                    <CardActions sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <ButtonGroup 
                            variant="outlined" 
                            aria-label="outlined primary button group"
                            
                        >
                            <Button color="primary" onClick={this.handleFilterClick}>
                                Filter
                            </Button>
                            <Button color="primary" onClick={this.handleResetFilter}>
                                Reset
                            </Button>
                        </ButtonGroup>
                    </CardActions>
                </Card>

                
                {this.state.stocks.count === 0? 
                    
                    <Alert severity="warning">
                        <AlertTitle>Warning</AlertTitle>                                
                        <strong>
                            There are no items matching your request
                        </strong>
                    </Alert>                    
                    :
                    <List sx={{width: '100%'}}>
                        {this.state.stocks.data.map((element)=> {
                            return(
                                <ListItem alignItems="flex-start" key={element.surplusId}>
                                    <Paper elevation={4} sx={{my: 2, width: '100%'}}>
                                        <Typography variant="h6" sx={{p: 4}}>
                                            {element?.surplusName.toUpperCase()}
                                        </Typography>
                                        <Divider sx={{mb: 2}}/>
                                        {element?.stock.length === 0?
                                            <Typography variant="subtitle2" sx={{p: 2}}>
                                                Nothing to show here
                                            </Typography>
                                            :
                                            <Grid 
                                                container 
                                                spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} 
                                                columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                                            >
                                                {element?.stock.map((item)=> {
                                                    return (
                                                        <Grid item key={item.stockId}>
                                                            <Card sx={{width: '300px', m: 2}} raised>
                                                                <CardHeader
                                                                    avatar={
                                                                        <Avatar sx={{ bgcolor: deepOrange[900] }}>
                                                                            {item?.farm?.owner?.name[0]}
                                                                        </Avatar>}
                                                                    title= {item?.farm?.name}
                                                                    subheader={item?.farm?.owner?.name}
                                                                />
                                                                <CardContent>
                                                                    {item.mediaPresent === true?
                                                                        <CardMedia
                                                                            component="img"
                                                                            image={item.mediaUrl}
                                                                            alt={element.surplusName}
                                                                            height={180}
                                                                        />
                                                                        :
                                                                        <Thumbnail width="300px" height="180px"/>
                                                                    }
                                                                </CardContent>
                                                                    <CardActions >
                                                                        <Chip 
                                                                            label={`${item.stock} available`} 
                                                                            variant="outlined" 
                                                                            color="secondary"
                                                                        />
                                                                        <Chip 
                                                                            icon={<CurrencyRupeeIcon />}
                                                                            label={`${item.unitPrice}`} 
                                                                            variant="outlined" 
                                                                            color="primary"
                                                                        />
                                                                        <IconButton 
                                                                            aria-label="add to favorites"
                                                                            onClick={()=>this.handleAddToCart(item)}
                                                                        >
                                                                            <AddShoppingCartIcon />
                                                                        </IconButton>
                                                                    </CardActions>
                                                            </Card>
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        }                                        
                                    </Paper>
                                </ListItem>
                            )
                        })}
                    </List>                    
                }               
            </React.Fragment>               
        )
    }
}

export default ShopWidget;
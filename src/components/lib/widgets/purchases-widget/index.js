import React, { Component} from "react";
import moment from "moment";
import { CustomCircularProgress } from "../../../common";

// Material UI imports
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import HistoryIcon from '@mui/icons-material/History';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { cyan, lightBlue } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Chip from '@mui/material/Chip';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


// Services Imports
import { getAllTransaction, getFrequentItems, getStockMedia } from '../../../../services';

class PurchasesWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
          listModal:{open: false},
          viewModal: {open: false},
          selectedTab: "ALL",
          transactionData: {count: 0, data: []},
          selectedTransaction: {isSelected: false, data: {}},
          itemHistory: [],
          mediaDictionary: [],
          selectedHistory: {isSelected: false, data: {}},
          anchor: { open: false, el: null}
        };
    }

    componentDidMount() {
        this.populateTransaction();
        try {
            getFrequentItems(JSON.parse(localStorage.user)['_id']).subscribe({
                next: (response)=> {
                    if(response.success === true) {
                        this.setState({
                            ...this.state,
                            itemHistory: response.data
                        }, ()=> {
                            this.state.itemHistory.forEach((element)=> {
                                element.stock.forEach((item)=> {
                                    if(item.mediaPresent === true) {
                                        getStockMedia(item.mediaUrl).subscribe({
                                            next: (response)=> {
                                                this.setState({
                                                    ...this.state,
                                                    mediaDictionary: [
                                                        ...this.state.mediaDictionary,
                                                        {
                                                            stockId: item._id,
                                                            mediaPresent: item.mediaPresent,
                                                            mediaUrl: URL.createObjectURL(response)
                                                        }
                                                    ]
                                                });
                                            }, 
                                            error: (error)=> {
                                                console.log(error);
                                            }
                                        })
                                    }else {
                                        this.setState({
                                            ...this.state,
                                            mediaDictionary: [
                                                ...this.state.mediaDictionary,
                                                {
                                                    stockId: item._id,
                                                    mediaPresent: item.mediaPresent,
                                                    mediaUrl: item.mediaUrl
                                                }
                                            ]
                                        });
                                    }
                                })
                            })
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
        console.log("Home Widget mounted");
        console.log(this.state);
    }

    populateTransaction = ()=> {
        let requestData = {
            userId: JSON.parse(localStorage.user)['_id'],
            isCompletedRequested: false 
        };
        if(this.state.selectedTab !== "ALL") {
            requestData['completedStatus'] = this.state.selectedTab === "PENDING"? false: true;
            requestData = {...requestData, isCompletedRequested: true};
        }
        try {
            getAllTransaction(requestData).subscribe({
                next: (response)=> {
                    if(response.success === true) {
                        this.setState({
                            ...this.state,
                            transactionData: response.data
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

    handleListModalOpen = ()=> {
        this.setState({...this.state, listModal: {...this.state.listModal, open: true}});
    }

    handleListModalClose = ()=> {
        this.setState({...this.state, listModal: {...this.state.listModal, open: false}});
    }

    handleViewModalOpen = ()=> {
        this.setState({...this.state, viewModal: {...this.state.viewModal, open: true}});
    }

    handleViewModalClose = ()=> {
        this.setState({
            ...this.state, 
            viewModal: {...this.state.viewModal, open: false},
            selectedTransaction: {isSelected: false, data: {}}
        });
    }

    handleTabSelect = (event, newValue)=> {
        this.setState({...this.state, selectedTab: newValue}, ()=> this.populateTransaction());
    }

    handleSelectTransaction = (data)=> {
        this.setState({
            ...this.state, 
            selectedTransaction: {isSelected: true, data: data}
        }, ()=> {
            this.handleViewModalOpen()
        })
    }

    handleOpenMenu = (event) => {
        this.setState({
            ...this.state, 
            anchor: {
                ...this.state.anchor, 
                open: true, 
                el: event.currentTarget}
        });        
    };

    handleSelectHistoryItem = (data)=> {
        console.log(data);
        if(
            data &&
            data.stock &&
            Array.isArray(data.stock) &&
            data.surplus
        ) {
            this.setState({
                ...this.state, 
                anchor: {
                    ...this.state.anchor, 
                    open: false, 
                    el: null},
                selectedHistory: {
                    ...this.state.selectedHistory,
                    isSelected: true, 
                    data: data
                }    
            });   
        }else {
            this.setState({
                ...this.state, 
                anchor: {
                    ...this.state.anchor, 
                    open: false, 
                    el: null}
            });   
        }
        
    }

    render() {
        return(
            <React.Fragment>
                {/* Menu f history items */}
                <Menu
                    id="basic-menu"
                    anchorEl={this.state.anchor.el}
                    open={this.state.anchor.open}
                    onClose={this.handleSelectHistoryItem}
                    MenuListProps={{'aria-labelledby': 'basic-button',}}
                >
                    {this.state.itemHistory.map((element)=> {
                        return(
                            <MenuItem 
                                key={element.surplus._id}
                                onClick={()=>{                                    
                                    this.handleSelectHistoryItem(element);
                                }}
                            >
                                {element.surplus.name}
                            </MenuItem>
                        )
                    })}
                </Menu>
                {/* small layout frequently bought list */}
                <Dialog
                    open={this.state.listModal.open}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'left'}}
                    keepMounted
                    fullWidth
                    scroll="paper"
                    onClose={this.handleListModalClose}
                    aria-describedby="alert-dialog-slide-description"
                    sx={{display: {xs: 'block', lg: 'none'}}}
                >
                    <DialogTitle>
                        Frequently bought items
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {this.state.itemHistory.map((element)=> {
                            return (
                                <Card
                                    key={`MODAL@${element.surplus._id}`} 
                                    sx={{ width: '100%', my:2 }} 
                                    raised
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: lightBlue[500] }} aria-label="recipe">
                                                {element.surplus.name[0]}
                                            </Avatar>
                                        }
                                        title={element.surplus.name}
                                        subheader={element.surplus.type}
                                    />
                                    <Divider/>
                                    <CardContent>
                                        <List sx={{ width: 'auto'}}>
                                            {element.stock.map((item)=> {
                                                return (
                                                    <Box 
                                                        key={`MODAL@${item._id}`}
                                                        sx={{width: '100%'}}
                                                    >
                                                        <ListItem 
                                                            key={`LIST@${item._id}`}
                                                            alignItems="flex-start"
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar 
                                                                    alt="Fresh Harvest" 
                                                                    src={item.mediaPresent === true? 
                                                                        this.state.mediaDictionary.find((stock)=> {
                                                                            return stock?.stockId === item._id
                                                                        })?.mediaUrl
                                                                        :
                                                                        ''
                                                                    } 
                                                                />
                                                            </ListItemAvatar>
                                                            <ListItemText 
                                                                primary={item.farmName}
                                                            />                                                            
                                                        </ListItem>
                                                        <Divider variant="inset" component="li" />
                                                    </Box>
                                                );
                                            })}
                                        </List>                              
                                        
                                    </CardContent>
                                </Card>
                            )
                        })}                                
                    </DialogContent>                                    
                </Dialog>

                {/* Transaction Review Modal */}
                <Dialog
                    open={this.state.viewModal.open}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'left'}}
                    keepMounted
                    fullWidth
                    scroll="paper"
                    onClose={this.handleViewModalClose}
                    aria-describedby="alert-dialog-slide-description"
                    // sx={{display: {xs: 'block', md: 'none'}}}
                >
                    <DialogTitle>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography 
                                    variant="subtitle2" 
                                    gutterBottom
                                >
                                    {this.state.selectedTransaction.isSelected === true? 
                                        `Created: ${moment(this.state.selectedTransaction.data.createdAt).format('ll')}`
                                        :
                                        `Nothing to show`
                                    }                                    
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    gutterBottom
                                >
                                    {this.state.selectedTransaction.isSelected === true?
                                        `Status: ${this.state.selectedTransaction.data.completed === false? "Processing": "Delivered"}`
                                        :
                                        ''
                                    }                                    
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                {this.state.selectedTransaction.isSelected === true?
                                    <Stack spacing={1} direction="row">
                                        <Box>
                                            <Chip 
                                                label={`${this.state.selectedTransaction.data.orders.length} Orders`} 
                                                color="primary" 
                                                variant="filled" 
                                            />
                                        </Box>
                                        <Box>
                                            <Chip 
                                                label={this.state.selectedTransaction.data.orders.reduce((prev, curr)=> {
                                                    return prev + curr.cart.reduce((p,c)=> {
                                                        return p + c.itemCost
                                                    }, 0)
                                                }, 0)} 
                                                color="primary"
                                                avatar={<Avatar sx={{ bgcolor: lightBlue[500] }}><CurrencyRupeeIcon /></Avatar>} 
                                                variant="outlined" 
                                            />
                                        </Box>
                                    </Stack>                                    
                                    :
                                    ''
                                }                                
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {this.state.selectedTransaction.isSelected === true?
                            this.state.selectedTransaction.data.orders.map((element)=> {
                                return(
                                    <Card 
                                        raised
                                        sx={{ width: 'auto', my: 2 }} 
                                        key={element._id}
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar 
                                                    sx={{ bgcolor: cyan[500] }} 
                                                    aria-label="recipe"
                                                >
                                                    {element.farmId.name[0]}
                                                </Avatar>
                                            }
                                            action={
                                                <Stack spacing={1}>
                                                    <Box>
                                                        <Chip 
                                                            label={`${element.cart.length} Items`} 
                                                            color="primary" 
                                                            variant="filled" 
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Chip 
                                                            label={element.cart.reduce((prev, curr)=> {
                                                                    return prev + curr.itemCost
                                                                }, 0)
                                                            } 
                                                            color="primary"
                                                            avatar={<Avatar sx={{ bgcolor: lightBlue[500] }}><CurrencyRupeeIcon /></Avatar>} 
                                                            variant="outlined" 
                                                        />
                                                    </Box>
                                                </Stack>
                                            }
                                            title={element.farmId.name}
                                            subheader={element.delivered === true ? "Delivered": "Processing"}
                                            sx={{mr: 3}}
                                        />
                                        <Divider/>
                                        <CardContent>
                                            <List sx={{ width: 'auto', my: 2}}>
                                                {element.cart.map((item)=> {
                                                    return (
                                                        <ListItem 
                                                            key={item._id}
                                                            secondaryAction={
                                                                <Chip 
                                                                    label={item?.itemCost} 
                                                                    color="primary"
                                                                    avatar={<Avatar sx={{ bgcolor: lightBlue[500] }}><CurrencyRupeeIcon /></Avatar>} 
                                                                    variant="outlined" 
                                                                />
                                                            }
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar 
                                                                    alt="Fresh Harvest" 
                                                                    src={item.stock.mediaPresent === true? 
                                                                        this.state.mediaDictionary.find((stock)=> {
                                                                            return stock?.stockId === item.stock._id
                                                                        })['mediaUrl']
                                                                        :
                                                                        ''
                                                                    } 
                                                                />
                                                            </ListItemAvatar>
                                                            <ListItemText 
                                                                primary={item?.stock?.surplusId?.name} 
                                                                secondary={`Quantity : ${item?.quantity}`} 
                                                            />
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )
                            })
                            :
                            <Typography 
                                variant="subtitle2" 
                                gutterBottom
                            >
                                Nothing to show
                            </Typography>
                        }                                     
                    </DialogContent>                                    
                </Dialog>


                <Box sx={{mt: 2}}>
                <Stack direction="row" spacing={2}>
                    <Typography 
                        variant="h5" 
                        // gutterBottom 
                        component="div"
                    >
                        My Orders
                    </Typography>
                    <Fab 
                        color="primary" 
                        variant="circular"
                        size="small"
                        sx={{
                            display:{xs: 'flex', lg: 'none'}, 
                            alignItems: 'center', 
                            justifyContent: 'center'
                        }}
                        onClick={this.handleListModalOpen}
                    >
                        <HistoryIcon/>                        
                    </Fab>
                </Stack>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={8}>
                        <Box sx={{ width: '100%', my: 3 }}>
                            <Tabs
                                value={this.state.selectedTab}
                                onChange={this.handleTabSelect}
                                textColor="secondary"
                                indicatorColor="secondary"
                                aria-label="secondary tabs example"
                            >
                                <Tab value="ALL" label="All" />
                                <Tab value="PENDING" label="Pending" />
                                <Tab value="DELIVERED" label="Delivered" />
                            </Tabs>
                            <Divider />
                            <Box sx={{mt: 2}}>
                                {this.state.transactionData.count === 0?
                                    <Alert 
                                        variant="outlined" 
                                        severity="error"
                                    >
                                        No transactions to show
                                    </Alert>
                                    :
                                    <List sx={{width: 'auto', mt: 2}}>
                                        {this.state.transactionData.data.map((element)=> {
                                            return(
                                                <ListItem 
                                                    disablePadding 
                                                    key={element._id}
                                                    secondaryAction={
                                                        <IconButton 
                                                            edge="end" 
                                                            aria-label="delete"
                                                            onClick = {()=>this.handleSelectTransaction(element)}
                                                        >
                                                            <VisibilityOutlinedIcon />
                                                        </IconButton>                                                        
                                                    }
                                                    sx={{borderBottom: '1px solid #ececec'}}
                                                >
                                                    <ListItemAvatar>
                                                        <CustomCircularProgress 
                                                            value={element.orders.reduce((prev, curr)=> {
                                                                if(curr.delivered === false) {
                                                                    return prev + 0
                                                                }else {
                                                                    return prev + 1
                                                                }
                                                            }, 0)/ element.orders.length*100}
                                                        />
                                                    </ListItemAvatar>
                                                    
                                                    <ListItemText                                                    
                                                        primary={moment(element.createdAt).format("ll") } 
                                                        secondary={element.completed === true? "Delivered": "Processing"} 
                                                    />
                                                    <ListItemText primary={`${element.orders.length} Orders`}/>

                                                    
                                                </ListItem>
                                            );
                                        })}                                        
                                    </List>
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid 
                        item
                        xs={4} 
                        sx={{
                            display: {xs: 'none', lg: 'flex'},
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <Paper elevation={3} sx={{p: 2, width: '100%'}}>
                            <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                                <Chip 
                                    avatar={<Avatar ><HistoryIcon /></Avatar>} 
                                    label="Freqently Ordered" 
                                    variant="outlined"
                                    color='info'
                                />
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'flex-start', mt: 2}}>
                                <Card sx={{ width: '100%' }} raised>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: lightBlue[500] }} aria-label="recipe">
                                                {this.state.selectedHistory.isSelected === false? 
                                                    `FH`
                                                    : 
                                                    this.state.selectedHistory.data.surplus.name[0]
                                                }
                                            </Avatar>
                                        }
                                        action={
                                        <IconButton 
                                            aria-label="settings"
                                            onClick= {this.handleOpenMenu}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        }
                                        title={this.state.selectedHistory.isSelected === false?
                                            `${this.state.itemHistory.length} items to view`
                                            :
                                            this.state.selectedHistory.data.surplus.name
                                        }
                                        subheader={this.state.selectedHistory.isSelected === false?
                                            ''
                                            :
                                            this.state.selectedHistory.data.surplus.type
                                        }
                                    />
                                    <Divider/>
                                    <CardContent>
                                        {this.state.selectedHistory.isSelected === false? 
                                            <Alert 
                                                variant="outlined" 
                                                severity="info"
                                            >
                                                Select item from options to view preferred choice of farm 
                                            </Alert>
                                            :
                                            <List sx={{ width: 'auto'}}>
                                                {this.state.selectedHistory.data.stock.map((element)=> {
                                                    return(
                                                        <Box 
                                                            key={`CANVAS@${element._id}`}
                                                            sx={{width: '100%'}}
                                                        >
                                                            <ListItem 
                                                                key={element._id}
                                                                alignItems="flex-start"
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar 
                                                                        alt="Fresh Harvest" 
                                                                        src={element.mediaPresent === true? 
                                                                            this.state.mediaDictionary.find((stock)=> {
                                                                                return stock?.stockId === element._id
                                                                            })['mediaUrl']
                                                                            :
                                                                            ''
                                                                        } 
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText 
                                                                    primary={element.farmName}
                                                                />                                                            
                                                            </ListItem>
                                                            <Divider variant="inset" component="li" />
                                                        </Box>                                                        
                                                    )
                                                })}
                                            </List>
                                        }
                                    </CardContent>
                                </Card>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>                
            </React.Fragment>              
        )
    }
}

export default PurchasesWidget;
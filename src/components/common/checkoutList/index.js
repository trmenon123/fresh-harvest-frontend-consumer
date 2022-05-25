import React from "react";
import PropTypes from 'prop-types';
import Thumbnail from '../thumbnail';


// Material UI imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import { green } from '@mui/material/colors';


const CheckoutList = (props)=> {
    console.log(props.list);
    return (
        <Box>
            <List dense sx={{ width: '100%'}}>
                {props.list.map((element)=> {
                    return(
                        <ListItem
                            key={`custom-list-item-${element._id}`}
                            disablePadding
                            divider
                            secondaryAction={
                                <Stack direction="row" spacing={2} sx={{display: 'flex', alignItems: 'center'}}>
                                    <Chip 
                                        label={`${element.stock.stock} Available`}
                                        color="warning" 
                                        variant="filled"
                                        size="small"                                            
                                    />
                                    <IconButton 
                                        aria-label="delete"
                                        onClick= {()=>props.clickHandler({
                                            type: "DECREMENT",
                                            cartId: element._id,
                                            stockId: element.stock._id
                                        })}
                                        disabled={element.quantity === 0? true: false}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Avatar 
                                        sx={{ bgcolor: green[500] }} 
                                        variant="square"
                                    >
                                        {element.quantity}
                                    </Avatar>
                                    <IconButton 
                                        aria-label="delete"
                                        onClick= {()=>props.clickHandler({
                                            type: "INCREMENT",
                                            cartId: element._id,
                                            stockId: element.stock._id
                                        })}
                                        disabled={element.quantity === element.stock.stock? true: false}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Stack>                                    
                            }
                        >                                
                            <ListItemAvatar> 
                                {element.stock.mediaPresent === true? 
                                    <Avatar 
                                        alt={element._id} 
                                        src={element.mediaUrl}
                                    />
                                    :
                                    <Thumbnail width="100px" height="60px"/>
                                }                               
                                
                            </ListItemAvatar>
                            <ListItemText
                                primary={element.stock.surplusId.name} 
                                secondary={element.stock.farmId.name}
                            />
                        </ListItem>
                    );
                })}                
            </List>
        </Box>
    );
}

CheckoutList.propTypes= {
    list: PropTypes.array.isRequired,
    clickHandler: PropTypes.func.isRequired,
}

CheckoutList.defaultProps = {
    test: [],
    clickHandler: ()=> {},
}

export default CheckoutList;
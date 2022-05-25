import React, { Component} from "react";
import media from '../../../../assets/180.jpg';

// Material UI imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import FlagCircleOutlinedIcon from '@mui/icons-material/FlagCircleOutlined';

class HomeWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
          test: ""
        };
    }

    componentDidMount() {
        console.log("Home Widget mounted");
    }

    componentDidUpdate() {
        console.log("Home Widget updated");
    }

    render() {
        return(
            <React.Fragment>
                <Card 
                    sx={{ width: '100%', my: 4 }}
                >
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: deepPurple[500] }} aria-label="recipe">
                                {JSON.parse(localStorage.user)['name'][0]}
                            </Avatar>
                        }
                        action={
                            <Chip 
                                icon={<FlagCircleOutlinedIcon />} 
                                label="I support farmers" 
                                variant="outlined" 
                                color="secondary"
                            />
                        }
                        title={JSON.parse(localStorage.user)['name']}
                        subheader={JSON.parse(localStorage.user)['email']}
                    />
                    <CardMedia
                        component="img"
                        height="460"
                        image={media}
                        alt="assortment"
                    />
                </Card>
            </React.Fragment>             
        )
    }
}

export default HomeWidget;
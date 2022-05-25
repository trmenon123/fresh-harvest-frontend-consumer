import React from 'react';
import { NavigationBar} from '../../common';
import { Outlet, Navigate} from 'react-router-dom';
import { getCookie, userIsAuth } from '../../../authentication';
import '../../../responsive.css';

function UserComponent() {
    const cookieInformation = getCookie('token');
    const sessionCheck = userIsAuth();
    console.log(cookieInformation);

    if (!sessionCheck || sessionCheck === false) {        
        return (
            <Navigate to="/" replace />
        )        
    }

    return (        
        <div className="min-vh-100">
            <NavigationBar showControls={true} />
            <div className="content">  
                <Outlet/>
            </div>            
        </div>
    );
}


export default UserComponent;
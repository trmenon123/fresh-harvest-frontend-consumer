import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import {
    HomeWidget, 
    ChatWidget, 
    PurchasesWidget, 
    ShopWidget,
    CheckoutWidget,
    Gate,
    UserComponent,
    
} from '../lib';
// import { UserComponent } from '../lib'
// Components
// Components CSS

function FreshHarvest(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Gate/> }/>
                <Route path="/user" element={<UserComponent/>}>
                    <Route path="home" element={<HomeWidget/>}/>
                    <Route path="mail" element={<ChatWidget/>}/>
                    <Route path="purchases" element={<PurchasesWidget/>}/>
                    <Route path="shop" element={<ShopWidget/>}/>
                    <Route path="checkout" element={<CheckoutWidget/>}/>
                </Route>
            </Routes>        
        </BrowserRouter>
    );
}


export default FreshHarvest;
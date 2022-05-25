import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Get all stocks
const getAllStocks = (data)=> 
    fetchCall(
        "/consumer/getAllStock",
        config.requestMethod.POST,
        data,
        true
    );

// Get Active Carts
const getActiveCarts = (data)=> 
    fetchCall(
        "/consumer/getCart",
        config.requestMethod.POST,
        data,
        true
    );

// Get Active Carts
const addCartItem = (data)=> 
    fetchCall(
        "/consumer/addNewCart",
        config.requestMethod.POST,
        data,
        true
    );

// Get addresses of user
const getAddress = (id)=> 
    fetchCall(
        `/consumer/getAddress/${id}`,
        config.requestMethod.GET,
        {},
        true
    );

// User add address
const addAddress = (data)=> 
    fetchCall(
        `/consumer/addAddress`,
        config.requestMethod.POST,
        data,
        true
    );

// Cart Management
const manageCart = (data)=> 
    fetchCall(
        `/consumer/manageCart`,
        config.requestMethod.POST,
        data,
        true
    );

// Confirm transaction
const confirmTransaction = (data)=> 
    fetchCall(
        `/consumer/confirmTransaction`,
        config.requestMethod.POST,
        data,
        true
    );

// Retreive Transactions
const getAllTransaction = (data)=> 
    fetchCall(
        `/consumer/getAllTransaction`,
        config.requestMethod.POST,
        data,
        true
    );

// Get frequently ordered items of user
const getFrequentItems = (id)=> 
    fetchCall(
        `/consumer/getFrequentItems/${id}`,
        config.requestMethod.GET,
        {},
        true
    );

export {
    getAllStocks,
    getActiveCarts,
    addCartItem,
    getAddress,
    addAddress,
    manageCart,
    confirmTransaction,
    getAllTransaction,
    getFrequentItems
};
import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Getting stock media
const getStockMedia = (data)=> 
    fetchCall(
        `/asset/getStockMedia/${data}`,
        config.requestMethod.GET,
        {},
        true
    );

export {
    getStockMedia
}
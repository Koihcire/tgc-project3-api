const cartDataLayer = require('../dal/cart')

async function addToCart(customerId, productVariantId, quantity){
    const cart_item = await cartDataLayer.getCartItemByUserAndProduct(customerId, productVariantId)
    if (!cart_item){
        await cartDataLayer.createCartItem(customerId, productVariantId, quantity)
    } else {
        await cartDataLayer.updateQuantity(customerId, productVariantId, cart_item.get('quantity')+1)
    }
    return true;
}

async function getCart(customerId){
    return cartDataLayer.getCart(customerId);
}

async function updateQuantity(customerId, productVariantId, newQuantity){
    //TODO check if the quantity matches the business rule
    return cartDataLayer.updateQuantity(customerId, productVariantId, newQuantity)
}

async function removeCartItem(customerId, productVariantId){
    return cartDataLayer.removeCartItem(customerId, productVariantId)
}

module.exports = {addToCart, getCart, updateQuantity,removeCartItem}
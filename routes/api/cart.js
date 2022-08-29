const express = require('express');
const router = express.Router();
const cartServices = require('../../services/cart')

router.get('/', async function (req,res){
    const cartItems = await cartServices.getCart(req.customer.id);
    res.json(cartItems)
})

router.post('/:product_variant_id/add', async function(req,res){
    const customerId = req.customer.id
    const productVariantId = req.params.product_variant_id;
    const quantity = req.body.quantity
    console.log('quantity at api: ', quantity)

    let addToCart = await cartServices.addToCart(customerId, productVariantId, quantity);
    if (addToCart){
        res.json({
            'success': 'item added'
        })
    } else {
        res.status(400)
        res.json({
            'error': "item not added"
        })
    }
    
})

router.post('/:product_variant_id/update', async function(req,res){
    const customerId = req.customer.id
    const productVariantId = req.params.product_variant_id;
    
    if (req.body.newQuantity > 0){
        await cartServices.updateQuantity(customerId, productVariantId, req.body.newQuantity);
        res.json({
            'success': 'quantity updated'
        })
    } else {
        res.json({
            'error': 'quantity must be greater than 0'
        })
    }
})

router.delete('/:product_variant_id/delete', async function(req,res){
    await cartServices.removeCartItem(req.customer.id, req.params.product_variant_id)
    res.json({
        'success': 'cart item deleted'
    })
})

module.exports = router;
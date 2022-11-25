const Publishable_key = "pk_test_51I0lW6GUTQA59BvJ0OBmLxv5yBWrkLqhleaJpDSoDtXNmW6IqcacQ8DX0UlnzCsHE22n3aGro54TgYjGVdGLk4yw00WgGoTsf5";
const Secret_key = "sk_test_51I0lW6GUTQA59BvJ4rAFX4VNB9j8emp4FYAKYYiHtCLa96Q8Lj8sm4pjeIZKqOAEDAT21fo8DOjsObNEkCSW1k6R007ttH4s14";
const stripe = require("stripe")(Secret_key)

// Create Charge but doesnot capture Money
const  paymentTransfer = async(amount  , description  ,customer_id  , source  )=>{
    try{
        let payment = await stripe.charges.create({
            amount: amount,
            description: description,
            currency: "usd",
            customer:customer_id,
            source: source  ,
            capture : false
        });
        return payment
    }
    catch(err){
        return err
    }
  
    
}

// capture charge amount 
const  captureAmount = async(amount  ,charge_id  )=>{
    try{
        let payment = await stripe.charges.capture(
           charge_id   ,
           {amount : amount}
        );
        return payment
    }
    catch(err){
        return err
    }
  
    
}


// Get user all Cards
const getAllCardDetails = async(customer_id)=>{
    try{
        const cards = await stripe.customers.listSources(
            customer_id,
            { object: 'card', limit: 30 }
        );
        return cards
    }
    catch(err){
        return err
    }
    
}

// Add Card details On stripe
const addCardDetails = async(customer_id , card_token)=>{
    try{
        const card = await stripe.customers.createSource(
            customer_id,
            { source: card_token }
        );
        return card
    }
    catch(err){
        return  err
    }
}

//Cannot send Card details directly use token for card details
const cardToken = async(data)=>{
    try{
        const token = await stripe.tokens.create({
            card: data
        });
        return token
    }catch(err){
        return err
    }
}

const createStripeCustomer = async(data)=>{
    try{
        let user = await stripe.customers.create(data)
        if(user){
            return user
        }
    }catch(err){
        return err
    }
}

const deleteCard = async(data)=>{
    try{
        let card = await stripe.customers.deleteSource(
            data.user_id,
           data.card_id
          ); 
          if(card){
              return card
          }
    }catch(err){
        return err
    }
}

module.exports = {paymentTransfer : paymentTransfer , captureAmount , getAllCardDetails , addCardDetails  , cardToken , createStripeCustomer , deleteCard }
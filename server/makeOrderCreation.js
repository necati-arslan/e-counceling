function makeOrderCreation(req, res, next, charge) {
      return createOrder(req, res, next).then(order => {
         res.status(200).json(order).end();
         stripe.charges.capture(charge.id)
            .then(res => res)
            .catch(err => err)
      }
   }).catch((err) => {
});
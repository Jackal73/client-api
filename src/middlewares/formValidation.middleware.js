const Joi = require('joi');

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net', 'digital'] }
});

const pin = Joi.number().min(10000).max(999999).required();
const phone = Joi.number().min(1000000001).max(9000000001).required();
const newPassword = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required();
const shortStr = Joi.string().min(2).max(50);
const shortStrZero = Joi.string().min(2).max(50);
const longStr = Joi.string().min(2).max(1000);
const dt = Joi.date();
const num= Joi.number().min(0).max(999999999999999).required();
const bool = Joi.boolean()
const num1= Joi.number().min(0).max(999999999999999);



const resetPassReqValidation = (req, res, next) => {
  const schema = Joi.object({email});
  const value = schema.validate(req.body);
  if(value.error) {
    return res.json({status:"error", message: value.error.message})
  }
  next();
};

const updatePassValidation = (req, res, next) => {

  const schema = Joi.object({ email, pin, newPassword });
  const value = schema.validate(req.body);
  if(value.error) {
    return res.json({status:"error", message: value.error.message})
  }
  next();
};

const createNewTicketValidation = (req, res, next) => {

    const schema = Joi.object({
      fileNo: shortStr.required(),
      closeDate: dt.required(),
      fundDate: dt.required(),
      dealType: shortStr.required(),
      closerOne: shortStr.required(),
      commishClOne: num.required(),
      closerTwo: shortStr,
      commishClTwo: num1,
      mobCloser: shortStr,
      mobFee: num1,
      overage: num1.required(),
      processorOne: shortStr.required(),
      commishPrOne: num1.required(),
      processorTwo: shortStr,
      commishPrTwo: num1,
      clientRefOne: shortStr.required(),
      clientRefTwo: shortStr,
      realAgentOne: shortStr.required(),
      realAgentTwo: shortStr,
      lnOfficer: shortStr.required(),
      salesRepOne: shortStr.required(),
      salesTypeOne: shortStr.required(),
      salesRepTwo: shortStr,
      salesTypeTwo: shortStr,
      discount: shortStr.required(),
      discountApproval: shortStr,
      freedomCheck: num.required(),
      message: longStr,
    });

    const value = schema.validate(req.body);

    if (value.error) {
      return res.json({status: "error", message: value.error.message});
    }
    next();
};

const replyTicketMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    // sender: shortStr.required(),
    // message: longStr.required()
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({status: "error", message: value.error.message});
  };
  next();
};

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortStr.required(),
    company: shortStr.required(),
    address: shortStr.required(),
    phone: phone,
    email: shortStr.required(),
    password: shortStr.required(),
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({status: "error", message: value.error.message});
  }

  next();
};

module.exports = {
  resetPassReqValidation,
  updatePassValidation,
  createNewTicketValidation,
  replyTicketMessageValidation,
  newUserValidation,
};
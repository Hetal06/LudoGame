var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    default:'',
    required:true,
  },
  password: {
    type: String,
    default:'',
    required:true
  },
  email:  {
     type: String,
     default: '',
     required: true,
     index: {unique: true}
   },
  contactNo: {
     type: String,
     default: ''
   },
  firstName: {
    type: String,
    default:'',
    required:true
  },
  lastName: {
    type: String,
    default:''
  },
  spinId: {
    type: String,
    default: '0',
    required: true ,
    index: {unique: true}
  },
  videoId: {
    type: String,
    default: '0',
    required: true ,
    index: {unique: true}
  },
  coinId: {
    type: Number,
    default: '2000',
    required: true ,
    index: {unique: true}
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isConfigured : {
    type: Boolean,
    default: false
   },
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');

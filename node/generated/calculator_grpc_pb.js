// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var calculator_pb = require('./calculator_pb.js');

function serialize_calculator_Number(arg) {
  if (!(arg instanceof calculator_pb.Number)) {
    throw new Error('Expected argument of type calculator.Number');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_Number(buffer_arg) {
  return calculator_pb.Number.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_TwoNumbers(arg) {
  if (!(arg instanceof calculator_pb.TwoNumbers)) {
    throw new Error('Expected argument of type calculator.TwoNumbers');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_TwoNumbers(buffer_arg) {
  return calculator_pb.TwoNumbers.deserializeBinary(new Uint8Array(buffer_arg));
}


var CalculatorService = exports.CalculatorService = {
  add: {
    path: '/calculator.Calculator/Add',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.TwoNumbers,
    responseType: calculator_pb.Number,
    requestSerialize: serialize_calculator_TwoNumbers,
    requestDeserialize: deserialize_calculator_TwoNumbers,
    responseSerialize: serialize_calculator_Number,
    responseDeserialize: deserialize_calculator_Number,
  },
  subtract: {
    path: '/calculator.Calculator/Subtract',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.TwoNumbers,
    responseType: calculator_pb.Number,
    requestSerialize: serialize_calculator_TwoNumbers,
    requestDeserialize: deserialize_calculator_TwoNumbers,
    responseSerialize: serialize_calculator_Number,
    responseDeserialize: deserialize_calculator_Number,
  },
  multiply: {
    path: '/calculator.Calculator/Multiply',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.TwoNumbers,
    responseType: calculator_pb.Number,
    requestSerialize: serialize_calculator_TwoNumbers,
    requestDeserialize: deserialize_calculator_TwoNumbers,
    responseSerialize: serialize_calculator_Number,
    responseDeserialize: deserialize_calculator_Number,
  },
  divide: {
    path: '/calculator.Calculator/Divide',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.TwoNumbers,
    responseType: calculator_pb.Number,
    requestSerialize: serialize_calculator_TwoNumbers,
    requestDeserialize: deserialize_calculator_TwoNumbers,
    responseSerialize: serialize_calculator_Number,
    responseDeserialize: deserialize_calculator_Number,
  },
  modulus: {
    path: '/calculator.Calculator/Modulus',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.TwoNumbers,
    responseType: calculator_pb.Number,
    requestSerialize: serialize_calculator_TwoNumbers,
    requestDeserialize: deserialize_calculator_TwoNumbers,
    responseSerialize: serialize_calculator_Number,
    responseDeserialize: deserialize_calculator_Number,
  },
  exponentiate: {
    path: '/calculator.Calculator/Exponentiate',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.TwoNumbers,
    responseType: calculator_pb.Number,
    requestSerialize: serialize_calculator_TwoNumbers,
    requestDeserialize: deserialize_calculator_TwoNumbers,
    responseSerialize: serialize_calculator_Number,
    responseDeserialize: deserialize_calculator_Number,
  },
};

exports.CalculatorClient = grpc.makeGenericClientConstructor(CalculatorService, 'Calculator');

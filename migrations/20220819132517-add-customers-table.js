'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('customers', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    username: {
      type: 'string',
      length: 100
    },
    first_name: {
      type: 'string',
      length: 100
    },
    last_name: {
      type: 'string',
      length: 100
    },
    email: {
      type: 'string',
      length: 100
    },
    password: {
      type: 'string',
      length: 100
    },
    contact_number: {
      type: 'string',
      length: 20
    },
    created_date: 'date'
  })
};

exports.down = function(db) {
  return db.dropTable('customers');
};

exports._meta = {
  "version": 1
};

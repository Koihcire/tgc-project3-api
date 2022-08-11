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
  return db.createTable('brands', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    brand: {
      type: 'string',
      length: 50,
    },
    brand_description: {
      type: 'text'
    },
    brand_logo_url : {
      type: 'string',
      length: 255
    }
  })
};

exports.down = function(db) {
  return db.dropTable('brands');
};

exports._meta = {
  "version": 1
};

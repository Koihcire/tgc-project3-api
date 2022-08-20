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

exports.up = async function(db) {
  await db.addColumn('cart_items', 'quantity', {
    type: 'int',
    unsigned: true
  })
  await db.addColumn('order_items', 'quantity', {
    type: 'int',
    unsigned: true
  })
  
  return;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

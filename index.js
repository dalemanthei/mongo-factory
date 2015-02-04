/**
 * Creates and manages the Mongo connection pool
 *
 * @type {exports}
 */
var Q = require('q');
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

var connections = [];
var dbPromise = null;

module.exports = function() {
  'use strict';

  return {

    /**
     * Gets a connection to Mongo from the pool. If the pool has not been instantiated it,
     *    instantiates it and returns a connection. Else it just returns a connection from the pool
     *
     * @returns {*}   - A promise object that will resolve to a mongo db object
     */
    getConnection: function getConnection(connectionString) {

      var pool;

      return Q.Promise(function (resolve, reject, notify) {

        if(connectionString === undefined || connectionString === null || _.isEmpty(connectionString.trim())) {
         return reject(new Error('Connection string is required parameter'));
        }

        // Check if connections contains an object with connectionString equal to the connectionString passed in and set the var to it
        pool = _.findWhere(connections, {connectionString: connectionString});

        // If no conneciton pool has been instantiated, instantiate it, else return a connection from the pool
        if (_.isUndefined(pool)) {

          // Initialize connection once
          MongoClient.connect(connectionString, function (err, database) {

            if (err) {
              return reject(err);
            }

            connections.push({connectionString: connectionString, db: database});

            resolve(database);

          });

        } else {  // Else we have not instantiated the pool yet and we need to

          resolve(pool.db);

        }

      });

    }
  };
}();

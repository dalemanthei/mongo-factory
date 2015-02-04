var chai = require('chai');
var expect = chai.expect;

describe('mongoFactory', function() {

	it('can be required without blowing up', function() {
		var mongoFactory = require('../');
		expect(mongoFactory).to.exist();
	});

	describe('getConnection()', function() {

		var mongoFactory;

		beforeEach(function() {
			mongoFactory = require('../');
		});

		it('should reject when no connection string', function() {
			return mongoFactory.getConnection()
				.fail(function (error) {
					expect(error.message).to.equal('Connection string is required parameter');
				});
		});

		it('should reject when empty connection string', function() {
			return mongoFactory.getConnection(' ')
				.fail(function (error) {
					expect(error.message).to.equal('Connection string is required parameter');
				});
		});

		it('should reject when null connection string', function() {
			return mongoFactory.getConnection(null)
				.fail(function (error) {
					expect(error.message).to.equal('Connection string is required parameter');
				});
		});

		it('should reject when undefined connection string', function() {
			return mongoFactory.getConnection(undefined)
				.catch(function (error) {
					expect(error.message).to.equal('Connection string is required parameter');
				});
		});

		it('should reject when connection fails for bad port', function() {
			return mongoFactory.getConnection('mongodb://localhost:99999')
				.catch(function (error) {
					expect(error.message).to.equal('failed to connect to [localhost:99999]');
				});
			});

		it('should reject when connection fails for bad host', function() {
			return mongoFactory.getConnection('mongodb://not-real-host:27017')
				.catch(function (error) {
					expect(error.message).to.equal('failed to connect to [not-real-host:27017]');
				});
			});

		it('should return new database connection first time', function() {
			return mongoFactory.getConnection('mongodb://localhost:27017')
				.then(function (connection) {
					expect(connection.serverConfig.host).to.equal('localhost');
					expect(connection.serverConfig.port).to.equal(27017);
				});
			});

		it('should return existing database connection second time', function() {
			// pool doesn't get reset each iteration
			return mongoFactory.getConnection('mongodb://localhost:27017')
				.then(function (connection) {
					expect(connection.serverConfig.host).to.equal('localhost');
					expect(connection.serverConfig.port).to.equal(27017);
				});
			});

	});
});

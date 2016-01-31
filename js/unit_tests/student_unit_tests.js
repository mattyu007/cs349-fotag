'use strict';

var expect = chai.expect;

describe('Student Unit Tests', function() {
	
	// Instantiate our model module
	var models = createModelModule();
	
	// Test for ImageModel
	describe('ImageModel', function() {
		
		var imPath = 'images/GOPR0042-small.jpg';
		var imDate = new Date(2014, 1, 1, 1, 1, 1); 
		var imCaption = 'caption 1';
		var imRating = 2;
		
		// Recreate the model before each test
		var imageModel;
		
		beforeEach(function() {
			imageModel = new models.ImageModel(imPath, imDate, imCaption, imRating);
		});
		
		afterEach(function() {
			imageModel = undefined;
		});
		
		it('should instantiate correctly', function() {
			expect(imageModel.getCaption(), 'caption should be set correctly using constructor paramter')
				.to.equal(imCaption);
			expect(imageModel.getRating(), 'rating should be set correctly using constructor paramter')
				.to.equal(imRating);
			expect(imageModel.getPath(), 'path should be set correctly using constructor paramter')
				.to.equal(imPath);
			expect(imageModel.getModificationDate(), 'modification date should be set correctly using constructor paramter')
				.to.equal(imDate);
		});
		
		it('should set caption correctly', function() {
			expect(imageModel.getCaption(), 'caption should be set correctly using constructor paramter')
				.to.equal(imCaption);
			
			imageModel.setCaption('hello, world!');
			
			expect(imageModel.getCaption(), 'caption should be set correctly using the setter')
				.to.equal('hello, world!');
		});
		
		it('should set rating correctly', function() {
			expect(imageModel.getRating(), 'rating should be set correctly using constructor paramter')
				.to.equal(imRating);
			
			imageModel.setRating(1);
			
			expect(imageModel.getRating(), 'rating should be set correctly using the setter')
				.to.equal(1);
		});
		
		it('should add and then remove a listener correctly', function() {
			var listener1 = sinon.spy();
			var listener2 = sinon.spy();
			var addListenerSpy = sinon.spy(imageModel, 'addListener');
			var removeListenerSpy = sinon.spy(imageModel, 'removeListener');
			
			// Add a listener
			imageModel.addListener(listener1);
			
			expect(addListenerSpy.calledWith(listener1), 'addListener should have been called with listener1')
				.to.be.true;
			expect(addListenerSpy.calledOnce, 'addListener should have been called once')
				.to.be.true;
			expect(imageModel.listeners, 'imagemodel.listeners should have length 1')
				.to.have.length(1);
			
			// Removing a listener which doesn't exist shouldn't do anything
			imageModel.removeListener(listener2);
			
			expect(removeListenerSpy.calledWith(listener2), 'removeListener should have been called with listener2')
				.to.be.true;
			expect(removeListenerSpy.calledOnce, 'removeListener should have been called once')
				.to.be.true;
			expect(imageModel.listeners, 'imagemodel.listeners should have length 1')
				.to.have.length(1);
			
			// Remove a listener
			removeListenerSpy.reset();
			imageModel.removeListener(listener1);
			
			expect(removeListenerSpy.calledWith(listener1), 'removeListener should have been called with listener1')
				.to.be.true;
			expect(removeListenerSpy.calledOnce, 'removeListener should have been called once')
				.to.be.true;
			expect(imageModel.listeners, 'imagemodel.listeners should have length 0')
				.to.have.length(0);
		});
		
		it('should notify its listeners when its caption changes', function() {
			var callback1 = sinon.spy();
			var callback2 = sinon.spy();
			
			// Add the callbacks to the imageModel
			imageModel.addListener(callback1);
			imageModel.addListener(callback2);
			
			// Change the caption
			imageModel.setCaption('hello, world!');
			var measuredTime = new Date();
			
			// Verify that both listeners were called once
			expect(callback1.called, 'callback1 should be called').to.be.ok;
			expect(callback2.called, 'callback2 should be called').to.be.ok;
			
			expect(callback1.callCount, 'callback1 should have been called once').to.equal(1);
			expect(callback2.callCount, 'callback2 should have been called once').to.equal(1);
			
			// Verify that the arguments were correct
			expect(callback1.calledWith(imageModel), 'callback1 should have been called with the imageModel').to.be.ok;
			expect(callback1.getCall(0).args[1].getDate(), 'callback1 should have been called with a timestamp close (+/- 5s) to the measured timestamp')
				.to.be.at.least(measuredTime.getDate() - 5 * 1000)
				.and
				.to.be.at.most(measuredTime.getDate() + 5 * 1000);
			
			expect(callback2.calledWith(imageModel), 'callback2 should have been called with the imageModel').to.be.ok;
			expect(callback2.getCall(0).args[1].getDate(), 'callback2 should have been called with the same timestamp as callback1')
				.to.equal(callback1.getCall(0).args[1].getDate());
		});
		
		it('should notify its listeners when its rating changes', function() {
			var callback1 = sinon.spy();
			var callback2 = sinon.spy();
			
			// Add the callbacks to the imageModel
			imageModel.addListener(callback1);
			imageModel.addListener(callback2);
			
			// Change the rating
			imageModel.setRating(1);
			var measuredTime = new Date();
			
			// Verify that both listeners were called once
			expect(callback1.called, 'callback1 should be called').to.be.ok;
			expect(callback2.called, 'callback2 should be called').to.be.ok;
			
			expect(callback1.callCount, 'callback1 should have been called once').to.equal(1);
			expect(callback2.callCount, 'callback2 should have been called once').to.equal(1);
			
			// Verify that the arguments were correct
			expect(callback1.calledWith(imageModel), 'callback1 should have been called with the imageModel').to.be.ok;
			expect(callback1.getCall(0).args[1].getDate(), 'callback1 should have been called with a timestamp +/- 5s of the measured timestamp')
				.to.be.at.least(measuredTime.getDate() - 5 * 1000)
				.and
				.to.be.at.most(measuredTime.getDate() + 5 * 1000);
			
			expect(callback2.calledWith(imageModel), 'callback2 should have been called with the imageModel').to.be.ok;
			expect(callback2.getCall(0).args[1].getDate(), 'callback2 should have been called with the same timestamp as callback1')
				.to.equal(callback1.getCall(0).args[1].getDate());
		});
	});
	
	
	// Test ImageCollectionModel
	describe('ImageCollectionModel', function() {
		
		// Recreate the models before each test
		var imageCollectionModel, imageModel1, imageModel2, imageModel3;
		
		beforeEach(function() {
			imageCollectionModel = new models.ImageCollectionModel();
			imageModel1 = new models.ImageModel(
				'images/GOPR0042-small.jpg',
				new Date(2014, 1, 1, 1, 1, 1),
				'caption 1',
				2
			);
			imageModel2 = new models.ImageModel(
				'images/GOPR0074-small.jpg',
				new Date(2015, 2, 2, 2, 2, 2),
				'caption 2',
				5
			);
			imageModel3 = new models.ImageModel(
				'images/GOPR0052-small.jpg',
				new Date(2016, 3, 3, 3, 3, 3),
				'caption 3',
				4
			);
		});
		
		afterEach(function() {
			imageCollectionModel = undefined;
			imageModel1 = undefined;
			imageModel2 = undefined;
			imageModel3 = undefined;
		});
		
		// Tests
		it('should initialize with an empty list of ImageModel objects', function() {
			var imageModelCount = imageCollectionModel.getImageModels().length;
			
			expect(imageModelCount, 'imageModelCount should be 0').to.be.equal(0);
		});
		
		it('should add, retrieve, and remove a single ImageModel object correctly', function() {
			imageCollectionModel.addImageModel(imageModel1);
			
			var addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 1').to.have.length(1);
			expect(addedImageModels[0], 'addedImageModels should retrieve the added ImageModel object').to.eql(imageModel1);
		});
		
		it('should add, retrieve, and remove multiple ImageModel objects correctly', function() {
			// Add 2 activities to the model
			imageCollectionModel.addImageModel(imageModel1);
			imageCollectionModel.addImageModel(imageModel2);
			
			// Verify that they are retrieved correctly
			var addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 2').to.have.length(2);
			expect(addedImageModels[0], 'addedImageModels[0] should be imageModel1').to.eql(imageModel1);
			expect(addedImageModels[1], 'addedImageModels[1] should be imageModel2').to.eql(imageModel2);
			
			// Removing one shouldn't remove the other
			imageCollectionModel.removeImageModel(imageModel1);
			addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 1').to.have.length(1);
			expect(addedImageModels[0], 'addedImageModels[0] should be imageModel2').to.eql(imageModel2);
			
			// Trying to remove the same element twice shouldn't remove anything else
			imageCollectionModel.removeImageModel(imageModel1);
			addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 1').to.have.length(1);
			expect(addedImageModels[0], 'addedImageModels[0] should be imageModel2').to.eql(imageModel2);
			
			// Add back the first one
			imageCollectionModel.addImageModel(imageModel1);
			addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 2').to.have.length(2);
			expect(addedImageModels[0], 'addedImageModels[0] should be imageModel2').to.eql(imageModel2); // Note: swapped!
			expect(addedImageModels[1], 'addedImageModels[1] should be imageModel1').to.eql(imageModel1);
			
			// Remove the second one
			imageCollectionModel.removeImageModel(imageModel2);
			addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 1').to.have.length(1);
			expect(addedImageModels[0], 'addedImageModels[0] should be imageModel1').to.eql(imageModel1);
			
			// Remove the last one
			imageCollectionModel.removeImageModel(imageModel1);
			addedImageModels = imageCollectionModel.getImageModels();
			
			expect(addedImageModels, 'addedImageModels should have length 0').to.have.length(0);
		});
		
		it('should add and then remove a listener correctly', function() {
			var listener1 = sinon.spy();
			var listener2 = sinon.spy();
			var addListenerSpy = sinon.spy(imageCollectionModel, 'addListener');
			var removeListenerSpy = sinon.spy(imageCollectionModel, 'removeListener');
			
			// Add a listener
			imageCollectionModel.addListener(listener1);
			
			expect(addListenerSpy.calledWith(listener1), 'addListener should have been called with listener1')
				.to.be.true;
			expect(addListenerSpy.calledOnce, 'addListener should have been called once')
				.to.be.true;
			expect(imageCollectionModel.listeners, 'imageCollectionModel.listeners should have length 1')
				.to.have.length(1);
			
			// Removing a listener which doesn't exist shouldn't do anything
			imageCollectionModel.removeListener(listener2);
			
			expect(removeListenerSpy.calledWith(listener2), 'removeListener should have been called with listener2')
				.to.be.true;
			expect(removeListenerSpy.calledOnce, 'removeListener should have been called once')
				.to.be.true;
			expect(imageCollectionModel.listeners, 'imageCollectionModel.listeners should have length 1')
				.to.have.length(1);
			
			// Remove a listener
			removeListenerSpy.reset();
			imageCollectionModel.removeListener(listener1);
			
			expect(removeListenerSpy.calledWith(listener1), 'removeListener should have been called with listener1')
				.to.be.true;
			expect(removeListenerSpy.calledOnce, 'removeListener should have been called once')
				.to.be.true;
			expect(imageCollectionModel.listeners, 'imageCollectionModel.listeners should have length 0')
				.to.have.length(0);
		});
		
		// (eventType, imageModelCollection, imageModel, eventDate)
		it('should notify its listeners when a new ImageModel object is added', function() {
			var callback1 = sinon.spy();
			var callback2 = sinon.spy();
			
			// Add the callbacks to the imageCollectionModel
			imageCollectionModel.addListener(callback1);
			imageCollectionModel.addListener(callback2);
			
			// Add an ImageModel
			imageCollectionModel.addImageModel(imageModel1);
			var measuredTime = new Date();
			
			// Verify that both listeners were called once
			expect(callback1.called, 'callback1 should be called').to.be.ok;
			expect(callback2.called, 'callback2 should be called').to.be.ok;
			
			expect(callback1.callCount, 'callback1 should have been called once').to.equal(1);
			expect(callback2.callCount, 'callback2 should have been called once').to.equal(1);
			
			// Verify that the arguments were correct
			expect(
				callback1.getCall(0).args[0],
				'callback1 should have been called with IMAGE_ADDED_TO_COLLECTION_EVENT as args[0]')
				.to.equal(models.IMAGE_ADDED_TO_COLLECTION_EVENT);
			expect(
				callback1.getCall(0).args[1],
				'callback1 should have been called with imageCollectionModel as args[1]')
				.to.eql(imageCollectionModel);
			expect(
				callback1.getCall(0).args[2],
				'callback1 should have been called with imageModel1 as args[2]')
				.to.eql(imageModel1);
			expect(
				callback1.getCall(0).args[3].getDate(),
				'callback1 should have been called with a timestamp +/- 5s of the measured timestamp as args[3]')
				.to.be.at.least(measuredTime.getDate() - 5 * 1000)
				.and
				.to.be.at.most(measuredTime.getDate() + 5 * 1000);
			
			expect(callback2.getCall(0).args, 'callback2 should have been called with the same args as callback1')
				.to.eql(callback1.getCall(0).args);
		});
		
		it('should notify its listeners when an ImageModel object is removed', function() {
			// Add an ImageModel to remove later
			imageCollectionModel.addImageModel(imageModel1);
			
			var callback1 = sinon.spy();
			var callback2 = sinon.spy();
			
			// Add the callbacks to the imageCollectionModel
			imageCollectionModel.addListener(callback1);
			imageCollectionModel.addListener(callback2);
			
			// Remove the ImageModel
			imageCollectionModel.removeImageModel(imageModel1)
			var measuredTime = new Date();
			
			// Verify that both listeners were called once
			expect(callback1.called, 'callback1 should be called').to.be.ok;
			expect(callback2.called, 'callback2 should be called').to.be.ok;
			
			expect(callback1.callCount, 'callback1 should have been called once').to.equal(1);
			expect(callback2.callCount, 'callback2 should have been called once').to.equal(1);
			
			// Verify that the arguments were correct
			expect(
				callback1.getCall(0).args[0],
				'callback1 should have been called with IMAGE_REMOVED_FROM_COLLECTION_EVENT as args[0]')
				.to.equal(models.IMAGE_REMOVED_FROM_COLLECTION_EVENT);
			expect(
				callback1.getCall(0).args[1],
				'callback1 should have been called with imageCollectionModel as args[1]')
				.to.eql(imageCollectionModel);
			expect(
				callback1.getCall(0).args[2],
				'callback1 should have been called with imageModel1 as args[2]')
				.to.eql(imageModel1);
			expect(
				callback1.getCall(0).args[3].getDate(),
				'callback1 should have been called with a timestamp +/- 5s of the measured timestamp as args[3]')
				.to.be.at.least(measuredTime.getDate() - 5 * 1000)
				.and
				.to.be.at.most(measuredTime.getDate() + 5 * 1000);
			
			expect(callback2.getCall(0).args, 'callback2 should have been called with the same args as callback1')
				.to.eql(callback1.getCall(0).args);
		});
		
		it('should notify its listeners when an ImageModel object in the collection is changed', function() {
			// Add an ImageModel to change later
			imageCollectionModel.addImageModel(imageModel1);
			
			var callback1 = sinon.spy();
			var callback2 = sinon.spy();
			
			// Add the callbacks to the imageCollectionModel
			imageCollectionModel.addListener(callback1);
			imageCollectionModel.addListener(callback2);
			
			// Change the ImageModel
			imageModel1.setRating(5);
			var measuredTime = new Date();
			
			// Verify that both listeners were called once
			expect(callback1.called, 'callback1 should be called').to.be.ok;
			expect(callback2.called, 'callback2 should be called').to.be.ok;
			
			expect(callback1.callCount, 'callback1 should have been called once').to.equal(1);
			expect(callback2.callCount, 'callback2 should have been called once').to.equal(1);
			
			// Verify that the arguments were correct
			expect(
				callback1.getCall(0).args[0],
				'callback1 should have been called with IMAGE_META_DATA_CHANGED_EVENT as args[0]')
				.to.equal(models.IMAGE_META_DATA_CHANGED_EVENT);
			expect(
				callback1.getCall(0).args[1],
				'callback1 should have been called with imageCollectionModel as args[1]')
				.to.eql(imageCollectionModel);
			expect(
				callback1.getCall(0).args[2],
				'callback1 should have been called with imageModel1 as args[2]')
				.to.eql(imageModel1);
			expect(
				callback1.getCall(0).args[3].getDate(),
				'callback1 should have been called with a timestamp +/- 5s of the measured timestamp as args[3]')
				.to.be.at.least(measuredTime.getDate() - 5 * 1000)
				.and
				.to.be.at.most(measuredTime.getDate() + 5 * 1000);
			
			expect(callback2.getCall(0).args, 'callback2 should have been called with the same args as callback1')
				.to.eql(callback1.getCall(0).args);
		});
	});
});

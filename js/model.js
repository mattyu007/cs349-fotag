'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
 */
function createModelModule() {

    var IMAGE_ADDED_TO_COLLECTION_EVENT = 'IMAGE_ADDED_TO_COLLECTION_EVENT';
    var IMAGE_REMOVED_FROM_COLLECTION_EVENT = 'IMAGE_REMOVED_FROM_COLLECTION_EVENT';
    var IMAGE_META_DATA_CHANGED_EVENT = 'IMAGE_META_DATA_CHANGED_EVENT';
    /**
     * An ImageModel represents a reference to an image on the local file system. You should assume
     * that all images are within the ./images directory.
     * @param pathToFile The relative path to the image. A string.
     * @param modificationDate The modification date of the file. A Date.
     * @param caption A user-supplied caption. Users may not provide a caption. A string.
     * @param rating The rating, from 0-5, the user has provided for the image. The rating is an integer.
     *               A rating of 0 indicates that the user has not yet supplied a rating for the image.
     * @constructor
     */
    var ImageModel = function(
        pathToFile,
        modificationDate,
        caption,
        rating
    ) {
        if (!(
                _.isString(pathToFile)
                && _.isString(caption)
                && (modificationDate instanceof Date)
                && (_.isNumber(rating) && rating >= 0 && rating <= 5)
            ))
        {
            throw new Error("Invalid arguments supplied to ImageModel: " + JSON.stringify(arguments));
        }
        this.path = pathToFile;
        this.modificationDate = modificationDate;
        this.caption = caption;
        this.rating = rating;
        
        this.listeners = [];
    };

    _.extend(ImageModel.prototype, {
        _notify: function(imageModel, eventTime) {
            if (!eventTime) eventTime = new Date();
            
            _.each(this.listeners, function(listener) {
                listener(imageModel, eventTime);
            });
        },
        
        /**
         * Adds a listener to be notified of when the model changes.
         * @param listener_fn A function with the signature: (imageModel, eventTime),
         * where imageModel is a reference to this object, and eventTime is a Date
         * object indicating the time of the event.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageModel.addListener: " + JSON.stringify(arguments));
            }
            
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageModel.removeListener: " + JSON.stringify(arguments));
            }
            
            var index = this.listeners.indexOf(listener_fn);
            
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        },

        /**
         * Returns a string representing the caption. Must return an empty string if the
         * user has not supplied a caption for the image.
         */
        getCaption: function() {
            return this.caption;
        },

        /**
         * Sets the caption for this image.
         * @param caption A string representing a user caption.
         */
        setCaption: function(caption) {
            this.caption = caption;
            this._notify(this);
        },

        /**
         * Returns the user-supplied rating of the image. A user can provide a rating between 1-5.
         * If no rating has been given, should return 0.
         */
        getRating: function() {
            return this.rating;
        },

        /**
         * Sets the user-supplied rating of the image.
         * @param rating An integer in the range [0,5] (where a 0 indicates the user is clearing their rating)
         */
        setRating: function(rating) {
            this.rating = rating;
            this._notify(this);
        },

        /**
         * Returns a complete path to the image suitable for inserting into an img tag.
         */
        getPath: function() {
            return this.path;
        },

        /**
         * Returns the modification date (a Date object) for this image.
         */
        getModificationDate: function() {
            return this.modificationDate;
        }
    });

    /**
     * Manages a collection of ImageModel objects.
     */
    var ImageCollectionModel = function() {
        this.imageModels = [];
        this.listeners = [];
    };

    _.extend(ImageCollectionModel.prototype, {
        _notify: function(eventType, imageModelCollection, imageModel, eventDate) {
            if (!eventDate) eventDate = new Date();
            
            _.each(this.listeners, function(listener) {
                listener(eventType, imageModelCollection, imageModel, eventDate);
            });
        },

        /**
         * Adds a listener to the collection to be notified of when the collection or an image
         * in the collection changes.
         * @param listener_fn A function with the signature (eventType, imageModelCollection, imageModel, eventDate),
         *                    where eventType is a string of either
         *                    - IMAGE_ADDED_TO_COLLECTION_EVENT,
         *                    - IMAGE_REMOVED_FROM_COLLECTION_EVENT, or
         *                    - IMAGE_META_DATA_CHANGED_EVENT.
         *                    imageModelCollection is a reference to this object, imageModel is the imageModel
         *                    that was added, removed, or changed, and eventDate is a Date object representing the
         *                    time when the change occurred.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageCollectionModel.addListener: " + JSON.stringify(arguments));
            }
            
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageCollectionModel.removeListener: " + JSON.stringify(arguments));
            }
            
            var index = this.listeners.indexOf(listener_fn);
            
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        },

        /**
         * Adds an ImageModel object to the collection. When adding an ImageModel, this object should
         * register as a listener for that object, and notify its own (i.e., the ImageCollectionModel's listeners)
         * when that ImageModel changes.
         * @param imageModel
         */
        addImageModel: function(imageModel) {
            var self = this;
            
            this.imageModels.push(imageModel);
            
            this._notify(IMAGE_ADDED_TO_COLLECTION_EVENT, this, imageModel);
            
            // Add a listener to the imageModel for any updates
            // Needs to be after this._notify to avoid infinite recursion
            imageModel.addListener(function(changedImageModel, eventTime) {
//                // Find and update the imageModel which changed
//                var modelToUpdate = _.find(self.imageModels, function(model) {
//                    return model.getPath() === changedImageModel.getPath();
//                });
//                
//                modelToUpdate.setRating(changedImageModel.getRating());
                
                // Notify our listeners that some metadata has been changed
                self._notify(IMAGE_META_DATA_CHANGED_EVENT, self, changedImageModel);
            });
        },

        /**
         * Removes the given ImageModel object from the collection and removes any listeners it has
         * registered with the ImageModel.
         * @param imageModel
         */
        removeImageModel: function(imageModel) {
            var index = this.imageModels.indexOf(imageModel);
            
            if (index !== -1) {
                this.imageModels.splice(index, 1);
                
                this._notify(IMAGE_REMOVED_FROM_COLLECTION_EVENT, this, imageModel);
            }
        },

        /**
         * Returns an array of all ImageModel objects currently in this collection.
         */
        getImageModels: function() {
            return this.imageModels.slice();
        }

    });

    /**
     * Given an ImageCollectionModel, stores all of its contents in localStorage.
     */
    function storeImageCollectionModel(imageCollectionModel) {
        var models = _.map(
            imageCollectionModel.getImageModels(),
            function(imageModel) {
                return {
                    path: imageModel.getPath(),
                    modificationDate: imageModel.getModificationDate(),
                    caption: imageModel.getCaption(),
                    rating: imageModel.getRating()
                };
            }
        );
        localStorage.setItem('imageCollectionModel', JSON.stringify(models));
    }

    /**
     * Returns a new ImageCollectionModel object with contents loaded from localStorage.
     */
    function loadImageCollectionModel() {
        var imageCollectionModel = new ImageCollectionModel();
        var modelsJSON = localStorage.getItem('imageCollectionModel');
        if (modelsJSON) {
            var models = JSON.parse(modelsJSON);
            _.each(
                models,
                function(model) {
                    try {
                        var imageModel = new ImageModel(
                            model.path,
                            new Date(model.modificationDate),
                            model.caption,
                            model.rating
                        );
                        imageCollectionModel.addImageModel(imageModel);
                    } catch (err) {
                        console.log("Error creating ImageModel: " + err);
                    }
                }
            );
        }
        return imageCollectionModel;
    }
    
    
    /**
     * A RatingsModel represents a rating from 0 to 5.
     * @constructor
     */
     var RatingsModel = function() {
         this.rating = 0;
         this.listeners = [];
         
         this.notify = function(ratingsModel, eventTime) {
             if (!eventTime) eventTime = new Date();
             
             _.each(this.listeners, function(listener) {
                 listener(ratingsModel, eventTime);
             });
         };
     }
     
     _.extend(RatingsModel.prototype, {
        /**
        * Adds a listener to be notified when the rating changes.
        * @param listener_fn A function with the signature: (ratingsModel, eventTime)
        */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to RatingsModel.addListener: " + JSON.stringify(arguments));
            }
            
            this.listeners.push(listener_fn);
        },
        
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to RatingsModel.removeListener: " + JSON.stringify(arguments));
            }
            
            var index = this.listeners.indexOf(listener_fn);
            
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        },
        
        /**
        * Returns the current rating
        */
        getRating: function() {
            return this.rating;
        },
        
        /**
        * Sets the current rating, must be in the range: [0, 5]
        */
        setRating: function(newRating) {
            if (newRating < 0 || newRating > 5) {
                throw new Error("Rating out of range for RatingsModel.setRating: " + newRating);
            }
            
            this.rating = newRating;
            this.notify(this);
        }
     });
    

    // Return an object containing all of our classes and constants
    return {
        ImageModel: ImageModel,
        ImageCollectionModel: ImageCollectionModel,
        
        RatingsModel: RatingsModel,

        IMAGE_ADDED_TO_COLLECTION_EVENT: IMAGE_ADDED_TO_COLLECTION_EVENT,
        IMAGE_REMOVED_FROM_COLLECTION_EVENT: IMAGE_REMOVED_FROM_COLLECTION_EVENT,
        IMAGE_META_DATA_CHANGED_EVENT: IMAGE_META_DATA_CHANGED_EVENT,

        storeImageCollectionModel: storeImageCollectionModel,
        loadImageCollectionModel: loadImageCollectionModel
    };
}
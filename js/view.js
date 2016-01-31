'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';


    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        var self = this;
        
        // Constants
        this.unavailablePath = 'unavailable.svg';
        this.unavailableName = '(image not available)';
        this.unavailableCaption = '(click to add caption)';
        
        // Save the incoming image model
        this.imageModel = imageModel;
        this.currentView = GRID_VIEW;
        
        // Register as a listener to the image model
        this.modelDidChangeListenerFunction = function(imageModel, eventTime) {
            self.setImageModel(imageModel);
        };
        
        // Clone the template
        var imageTemplate = document.getElementById('image-item-template').content;
        this.imageOuterDiv = document.createElement('div'); 
        this.imageOuterDiv.appendChild(document.importNode(imageTemplate, true));
        
        this.imageDiv = this.imageOuterDiv.querySelector('.ft-item');
        
        this.imageContainer = this.imageDiv.querySelector('.ft-item-image-container');
        this.metadataContainer = this.imageDiv.querySelector('.ft-item-metadata-container');
        
        this.imageField = this.imageDiv.querySelector('.ft-item-image');
        this.captionField = this.imageDiv.querySelector('.ft-item-caption');
        this.nameField = this.imageDiv.querySelector('.ft-item-name');
        this.dateField = this.imageDiv.querySelector('.ft-item-date');
        
        // Add a RatingsView instance to it
        this.ratingsInstance = new RatingsView(this.imageModel);
        this.imageDiv.querySelector('.ft-item-metadata-container').appendChild(this.ratingsInstance.getElement());
        
        // Add an event listener to the image to catch load errors
        this.imageField.addEventListener('error', function(event) {
            event.stopPropagation();
            event.preventDefault();
            
            // base64-encoded version of unavailable.svg
            // Using this in case unavailable.svg goes missing, otherwise we get stuck in an infinite loop
            this.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyODBweCINCgkgaGVpZ2h0PSIyODBweCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI4MCAyODAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IkxheWVyXzJfMl8iPg0KCTxyZWN0IGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIi8+DQo8L2c+DQo8ZyBpZD0iTGF5ZXJfMSI+DQoJPGcgaWQ9IkxheWVyXzJfMV8iPg0KCQk8ZyBpZD0iTGF5ZXJfMiIgZGlzcGxheT0ibm9uZSI+DQoJCQkNCgkJCQk8Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0RERERERCIgc3Ryb2tlPSIjQkZCRkJGIiBzdHJva2Utd2lkdGg9IjE0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSIxMTcuMzk4IiBjeT0iOTYuMDU5IiByPSI1My43OTciLz4NCgkJCQ0KCQkJCTxsaW5lIGRpc3BsYXk9ImlubGluZSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQkZCRkJGIiBzdHJva2Utd2lkdGg9IjE0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHgxPSIxNTUuODAxIiB5MT0iMTMzLjcyIiB4Mj0iMjI2LjQ2NiIgeTI9IjIwNC4zODciLz4NCgkJCTxnIGRpc3BsYXk9ImlubGluZSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiPg0KCQkJCTxwYXRoIGZpbGw9IiM3RjdGN0YiIGQ9Ik0yMzEuOTkzLDIwNi43ODRjMC0yMy4zOTcsMzMuMTYxLTI1LjIzOSwzMy4xNjEtNDQuNzcxYzAtOS4yMTEtNy4xODQtMTcuMTM0LTIxLjU1NS0xNy4xMzQNCgkJCQkJYy0xNC4wMDIsMC0yMi42NjIsNS44OTYtMjkuNDc5LDE1LjEwOGwtOS4yMTItOS45NDljOC44NDQtMTEuNjA3LDIyLjQ3OC0xOC43OTIsMzkuOTc5LTE4Ljc5Mg0KCQkJCQljMjIuNDc3LDAsMzYuMTA5LDEyLjcxMiwzNi4xMDksMjguNTU4YzAsMjcuODE3LTM1LjU1OSwzMC4yMTMtMzUuNTU5LDQ4LjI3YzAsMi45NDcsMS42NTgsNi42MzMsNC43OTEsOC44NDRsLTExLjIzOCw0Ljk3NQ0KCQkJCQlDMjM0LjAyLDIxNy42NTQsMjMxLjk5MywyMTIuNDk1LDIzMS45OTMsMjA2Ljc4NHogTTIzMi43MywyNDcuNjg2YzAtNS41MjYsNC42MDQtMTAuMTM0LDEwLjEzMy0xMC4xMzQNCgkJCQkJYzUuNTI3LDAsMTAuMTMzLDQuNjA2LDEwLjEzMywxMC4xMzRjMCw1LjUyNi00LjYwNSwxMC4xMzMtMTAuMTMzLDEwLjEzM0MyMzcuMzM1LDI1Ny44MTgsMjMyLjczLDI1My4yMTIsMjMyLjczLDI0Ny42ODZ6Ii8+DQoJCQk8L2c+DQoJCTwvZz4NCgkJPGNpcmNsZSBmaWxsPSIjREREREREIiBzdHJva2U9IiNCRkJGQkYiIHN0cm9rZS13aWR0aD0iMTQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgY3g9IjExNS41OTciIGN5PSI5Ni40NjciIHI9IjUwLjUyMiIvPg0KCQkNCgkJCTxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0JGQkZCRiIgc3Ryb2tlLXdpZHRoPSIxNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiB4MT0iMTUwLjU2MSIgeTE9IjEzMS40MzMiIHgyPSIyMTYuODg3IiB5Mj0iMTk3Ljc1NyIvPg0KCTwvZz4NCgk8ZyBpZD0iTGF5ZXJfMyI+DQoJCTxnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIj4NCgkJCTxwYXRoIGZpbGw9IiNCRkJGQkYiIGQ9Ik0yMDYuMTkzLDkzLjE1M2MwLTE3LjY4NiwyNS4wNjUtMTkuMDc4LDI1LjA2NS0zMy44MzljMC02Ljk2My01LjQzMi0xMi45NTEtMTYuMjk0LTEyLjk1MQ0KCQkJCWMtMTAuNTg0LDAtMTcuMTI4LDQuNDU3LTIyLjI3OSwxMS40MTlsLTYuOTYzLTcuNTJjNi42ODUtOC43NzQsMTYuOTg4LTE0LjIwNCwzMC4yMTktMTQuMjA0DQoJCQkJYzE2Ljk4OCwwLDI3LjI5NSw5LjYwOSwyNy4yOTUsMjEuNTg1YzAsMjEuMDI4LTI2Ljg3OSwyMi44MzctMjYuODc5LDM2LjQ4NWMwLDIuMjI5LDEuMjU0LDUuMDE0LDMuNjIzLDYuNjg1bC04LjQ5NCwzLjc2DQoJCQkJQzIwNy43MjUsMTAxLjM2OCwyMDYuMTkzLDk3LjQ3LDIwNi4xOTMsOTMuMTUzeiBNMjA2Ljc1MSwxMjQuMDY3YzAtNC4xNzcsMy40NzktNy42NTgsNy42NTgtNy42NTgNCgkJCQljNC4xNzcsMCw3LjY1OSwzLjQ4MSw3LjY1OSw3LjY1OGMwLDQuMTc5LTMuNDgyLDcuNjYtNy42NTksNy42NkMyMTAuMjMsMTMxLjcyOCwyMDYuNzUxLDEyOC4yNDYsMjA2Ljc1MSwxMjQuMDY3eiIvPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwb2x5bGluZSBmaWxsPSJub25lIiBzdHJva2U9IiNEREREREQiIHN0cm9rZS13aWR0aD0iMTQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSIyNzMsMjU1IDI3MywyNzMgMjU1LDI3MyAJCQkiLz4NCgkJCQ0KCQkJCTxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0RERERERCIgc3Ryb2tlLXdpZHRoPSIxNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSI0MC41ODgyLDI3LjA1ODgiIHgxPSIyMjcuOTQxIiB5MT0iMjczIiB4Mj0iMzguNTI5IiB5Mj0iMjczIi8+DQoJCQk8cG9seWxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjREREREREIiBzdHJva2Utd2lkdGg9IjE0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iMjUsMjczIDcsMjczIDcsMjU1IAkJCSIvPg0KCQkJDQoJCQkJPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjREREREREIiBzdHJva2Utd2lkdGg9IjE0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IjQwLjU4ODIsMjcuMDU4OCIgeDE9IjciIHkxPSIyMjcuOTQxIiB4Mj0iNyIgeTI9IjM4LjUyOSIvPg0KCQkJPHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0RERERERCIgc3Ryb2tlLXdpZHRoPSIxNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludHM9IjcsMjUgNyw3IDI1LDcgCQkJIi8+DQoJCQkNCgkJCQk8bGluZSBmaWxsPSJub25lIiBzdHJva2U9IiNEREREREQiIHN0cm9rZS13aWR0aD0iMTQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iNDAuNTg4MiwyNy4wNTg4IiB4MT0iNTIuMDU5IiB5MT0iNyIgeDI9IjI0MS40NzEiIHkyPSI3Ii8+DQoJCQk8cG9seWxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjREREREREIiBzdHJva2Utd2lkdGg9IjE0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iMjU1LDcgMjczLDcgMjczLDI1IAkJCSIvPg0KCQkJDQoJCQkJPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjREREREREIiBzdHJva2Utd2lkdGg9IjE0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IjQwLjU4ODIsMjcuMDU4OCIgeDE9IjI3MyIgeTE9IjUyLjA1OSIgeDI9IjI3MyIgeTI9IjI0MS40NzEiLz4NCgkJPC9nPg0KCTwvZz4NCgk8dGV4dCB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDI3LjQ5MDIgMjQzKSIgZmlsbD0iIzdGN0Y3RiIgZm9udC1mYW1pbHk9IidQcm94aW1hTm92YS1SZWd1bGFyJyIgZm9udC1zaXplPSIzMiI+cGhvdG8gbm90IGZvdW5kPC90ZXh0Pg0KPC9nPg0KPC9zdmc+DQo=";
            
//            try {
//                this.src = self.unavailablePath;
//            }
//            catch (err) {
//                this.src = "";
//            }
        });
        
        // Add an event listener to the image to allow users to click it to zoom in
        this.imageContainer.addEventListener('click', function(event) {
            var lightbox = new Lightbox();
            lightbox.showImage(self.imageField.src);
        });
        
        // Add event listeners to activate the edit caption fields
        this.editCaptionContainer = this.imageDiv.querySelector('.ft-item-caption-input-container');
        this.editCaptionInputField = this.imageDiv.querySelector('.ft-item-caption-input');
        this.editCaptionSaveButton = this.imageDiv.querySelector('.ft-item-caption-save-btn');
        this.editCaptionCancelButton = this.imageDiv.querySelector('.ft-item-caption-cancel-btn');
        
        this.captionField.addEventListener('click', function(event) {
            // Toggle the two fields
            self.captionField.classList.add('nodisplay');
            self.editCaptionContainer.classList.remove('nodisplay');
            
            // Fill in the text box with whatever was previously there
            if (self.captionField.innerText != self.unavailableCaption) {
                self.editCaptionInputField.value = self.captionField.innerText;
            }
            else {
                self.editCaptionInputField.value = "";
            }
            
            // Focus the text box
            self.editCaptionInputField.focus();
            
            // Allow users to save by pressing Enter and cancel by pressing Escape
            self.editCaptionInputField.addEventListener('keypress', function(event) {
                if (event.keyCode == 13) {
                    self.editCaptionSaveButton.dispatchEvent(new Event('click'));
                }
                else if (event.keyCode == 27) {
                    self.editCaptionCancelButton.dispatchEvent(new Event('click'));
                }
            });
            
            // Add event listeners to activate the Save and Cancel buttons
            self.editCaptionSaveButton.addEventListener('click', function(event) {
                self.imageModel.setCaption(self.editCaptionInputField.value.trim());
                
                self.captionField.classList.remove('nodisplay');
                self.editCaptionContainer.classList.add('nodisplay');
            });
            self.editCaptionCancelButton.addEventListener('click', function(event) {
                self.captionField.classList.remove('nodisplay');
                self.editCaptionContainer.classList.add('nodisplay');
            });
        });
        
        this.setImageModel(imageModel);
    };

    _.extend(ImageRenderer.prototype, {
    	_formatDate: function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var AMPM = (hours < 12 ? "AM" : "PM");
            hours = hours % 12;
            hours = (hours === 0 ? 12 : hours);
            minutes = (minutes < 10 ? "0" : "") + minutes;
            
            return date.toDateString() + ", " + hours + ":" + minutes + " " + AMPM;
        },
        
        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            return this.imageOuterDiv;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            // Unregister from the old model 
            this.imageModel.removeListener(this.modelDidChangeListenerFunction);
            
            // Save the new ImageModel and update our rendering
            this.imageModel = imageModel;
            
            var imagePath = imageModel.getPath() || this.unavailablePath;
            var captionText = imageModel.getCaption();
            captionText = (captionText.length === 0 ? this.unavailableCaption : captionText);
            
            this.imageField.src = imagePath;
            this.captionField.innerText = captionText;
            this.nameField.innerText = imagePath; // (imagePath.search(/^images\//) === -1 ? (imagePath || unavailableName) : imagePath.split('/').slice(1).join('/'));
            this.dateField.innerText = this._formatDate(imageModel.getModificationDate());
            this.ratingsInstance.setModel(this.imageModel);
//            this.ratingsInstance.setRating(imageModel.getRating());
            
            // Reregister the new model
            this.imageModel.addListener(this.modelDidChangeListenerFunction);
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.currentView = viewType;
            
            if (viewType == LIST_VIEW) {
                this.imageDiv.classList.add('ft-item-list-view');
                this.imageContainer.classList.add('ft-item-image-container-list-view');
                this.metadataContainer.classList.add('ft-item-metadata-container-list-view')
            }
            else if (viewType = GRID_VIEW) {
                this.imageDiv.classList.remove('ft-item-list-view');
                this.imageContainer.classList.remove('ft-item-image-container-list-view');
                this.metadataContainer.classList.remove('ft-item-metadata-container-list-view')
            }
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
    	   return this.currentView;
        }
    });


    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            return new ImageRenderer(imageModel);
        }
    });


    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {
        var self = this;
        this.currentView = GRID_VIEW;
        
        // Clone the template
        var collectionTemplate = document.getElementById('image-collection-template').content;
        this.collectionOuterDiv = document.createElement('div');
        this.collectionOuterDiv.appendChild(document.importNode(collectionTemplate, true));
        
        this.collectionDiv = this.collectionOuterDiv.querySelector('.ft-container');
        
        this.emptyMessageDiv = this.collectionOuterDiv.querySelector('.ft-empty-container');
        
        // Keep a reference to the ImageCollectionModel
        this.imageCollectionModel = undefined;
        
        // Keep a reference to an ImageRendererFactory
        this.imageRendererFactory =  new ImageRendererFactory();
        
        // Keep a collection of ImageRenderers
        this.imageRendererDivPairs = [];
        
        // Define the listener function for model changes
        this.modelDidChangeListenerFunction = function(eventType, imageModelCollection, imageModel, eventDate) {
            if (eventType == 'IMAGE_ADDED_TO_COLLECTION_EVENT') {
                self._renderModelToView(imageModel);
            }
            else if (eventType == 'IMAGE_REMOVED_FROM_COLLECTION_EVENT') {
                self._unrenderModelFromView(imageModel);
            }
            else if (eventType == 'IMAGE_META_DATA_CHANGED_EVENT') {
                //self._refreshUpdatedModel(imageModel);
            }
        };
        
        // Define the listener function for view changes
        this.viewDidChangeListenerFunction = function(toolbar, eventType, eventDate) {
            if (eventType == LIST_VIEW || eventType == GRID_VIEW) {
                self.setToView(eventType);
            }
            else if (eventType = RATING_CHANGE) {
                self._filterByRating(toolbar.getCurrentRatingFilter());
            }
        };
    };

    _.extend(ImageCollectionView.prototype, {
        _checkInit: function() {
            if (!(this.imageCollectionModel && this.imageRendererFactory)) {
                throw new Error("ImageCollectionView has not been initialized yet.");
            }
        },
        
        /**
         * Renders a given ImageModel to the view and adds an ImageRenderer object
         * to the internal collection
         */
        _renderModelToView: function(imageModel) {
            this._checkInit();
            
            var self = this;
            
            // Create the container to hold the ImageRenderer
            var container = document.createElement('div');
            container.className = "ft-icv-item-container ft-icv-item-container-new";
            
            // Copy the delete overlay into the container
            var deleteTemplate = document.getElementById('image-item-delete-overlay-template').content;
            container.appendChild(document.importNode(deleteTemplate, true));
            
            // Add event listeners to activate the delete buttons
            var deleteMessage = container.querySelector('.ft-item-delete-overlay-content-message');
            var deleteHoverIcon = container.querySelector('.ft-item-delete-icon');
            var deleteOverlay = container.querySelector('.ft-item-delete-overlay');
            var deleteRemoveButton = deleteOverlay.querySelector('.btn-danger');
            var deleteCancelButton = deleteOverlay.querySelector('.btn-light');
            
            container.addEventListener('mouseover', function(event) {
                deleteHoverIcon.classList.remove('nodisplay');
            });
            container.addEventListener('mouseout', function(event) {
                deleteHoverIcon.classList.add('nodisplay');
            });
            
            deleteHoverIcon.addEventListener('mousemove', function(event) {
                deleteHoverIcon.classList.remove('nodisplay');
            });
            deleteHoverIcon.addEventListener('click', function(event) {
                deleteOverlay.classList.remove('nodisplay');
            });
            
            deleteRemoveButton.addEventListener('click', function(event) {
                deleteRemoveButton.disabled = true;
                deleteCancelButton.disabled = true;
                deleteMessage.innerHTML = 'Removing&hellip;';
                
                self.getImageCollectionModel().removeImageModel(imageModel);
            });
            
            deleteCancelButton.addEventListener('click', function(event) {
                deleteOverlay.classList.add('ft-item-delete-hidden');
            });
            
            deleteOverlay.addEventListener('webkitAnimationEnd', function(event) {
                if (deleteOverlay.classList.contains('ft-item-delete-hidden')) {
                    deleteOverlay.classList.add('nodisplay');
                    deleteOverlay.classList.remove('ft-item-delete-hidden');
                }
            });
            deleteOverlay.addEventListener('animationend', function(event) {
                if (deleteOverlay.classList.contains('ft-item-delete-hidden')) {
                    deleteOverlay.classList.add('nodisplay');
                    deleteOverlay.classList.remove('ft-item-delete-hidden');
                }
            });
            
            // Create an ImageRenderer for the ImageModel
            var renderer = this.imageRendererFactory.createImageRenderer(imageModel);
            
            // Append the ImageRenderer element to the container
            container.appendChild(renderer.getElement());
            
            // Add the container to the DOM
            this.emptyMessageDiv.classList.add('nodisplay');
            var divOnDom = this.collectionDiv.appendChild(container);
            
            renderer.setToView(this.currentView);
            divOnDom.classList.remove('nodisplay');
            setTimeout(function() {
                divOnDom.classList.remove('ft-icv-item-container-new');
            }, 750);
//            divOnDom.scrollIntoView(true);
            
            this.imageRendererDivPairs.push({imageRenderer: renderer, divOnDom: divOnDom});
        },
        
        /**
         * Removes a given ImageModel from the view and removes the corresponding
         * ImageRenderer object(s) from the internal collection
         */
         _unrenderModelFromView: function(imageModel) {
             this._checkInit();
             
             var self = this;
             
             var pair;
             var findImageModelPredicate = function(pair) {
                 return pair.imageRenderer.getImageModel() == imageModel;
             };
             while (pair = _.find(this.imageRendererDivPairs, findImageModelPredicate)) {
                 var divToRemove = pair.divOnDom;
                 
                 // Add the .ft-icv-item-container-deleted class to animate out
                 // the deletion before removing it from the DOM
                 divToRemove.classList.add('ft-icv-item-container-deleted');
                 
                 setTimeout(function() {
                     self.collectionDiv.removeChild(divToRemove);
                 }, 500);
                 
                 var index = this.imageRendererDivPairs.indexOf(pair);
                 if (index !== -1) {
                     this.imageRendererDivPairs.splice(index, 1);
                 }
             }
             
             setTimeout(function() {
                 if (self.imageRendererDivPairs.length === 0) {
                     self.emptyMessageDiv.classList.remove('nodisplay');
                 }
             }, 500);
         },
         
         /**
          * Convenience functions to re-render an ImageCollectionModel 
          */
        _rerenderAll: function() {
            this._checkInit();
            this._unrenderAll();
            
            var self = this;
            
            _.each(this.imageCollectionModel.getImageModels(), function(imageModel) {
                self._renderModelToView(imageModel);
            });
        },
        
        _unrenderAll: function() {
            while (this.imageRendererDivPairs.length > 0) {
                this._unrenderModelFromView(this.imageRendererDivPairs[0].imageRenderer.getImageModel());
            }
        },
        
        /**
         * Shows / hides all the currently-rendered DIVs based on the rating
         */
        _filterByRating: function(rating) {
            _.each(this.imageRendererDivPairs, function(pair) {
                if (pair.imageRenderer.getImageModel().getRating() >= rating) {
                    pair.divOnDom.classList.remove('nodisplay');
                }
                else {
                    pair.divOnDom.classList.add('nodisplay');
                }
            })
        },
        
        /**
         * Attaches the view to a toolbar for view updating the view mode and filter
         */
        attachToToolbar: function(toolbar) {
            toolbar.addListener(this.viewDidChangeListenerFunction);
            
            this.setToView(toolbar.getCurrentView());
        },
        
        /**
         * Detaches the view from a toolbar
         */
        detachFromToolbar: function(toolbar) {
            toolbar.removeListener(this.viewDidChangeListenerFunction);
        },
        
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            return this.collectionOuterDiv;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            return this.imageRendererFactory;
        },
        
        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            // Set the new image renderer factory
            this.imageRendererFactory = imageRendererFactory;
            
            // Remove and regenerate all the images if we have a model
            if (this.imageCollectionModel) {
                this._rerenderAll();
            }
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            // Unregister with the old model
            if (this.imageCollectionModel) {
                this.imageCollectionModel.removeListener(this.modelDidChangeListenerFunction);
            }
            
            // Set the new ImageCollectionModel
            this.imageCollectionModel = imageCollectionModel;
            
            // Register as a listener to the new model
            this.imageCollectionModel.addListener(this.modelDidChangeListenerFunction);
            
            // Rerender all the images
            this._rerenderAll();
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            this._checkInit();
            
            if (viewType != LIST_VIEW && viewType != GRID_VIEW) {
                throw new Error("Invalid viewType to ImageCollectionView.setToView: " + viewType);
            }
            
            this.currentView = viewType;
            
            // Change the container view
            if (viewType == LIST_VIEW) {
                this.collectionDiv.classList.add('ft-container-list-view');
            }
            else if (viewType == GRID_VIEW) {
                this.collectionDiv.classList.remove('ft-container-list-view');
            }
            
            // Notify all the ImageRenderers to update their views
            _.each(this.imageRendererDivPairs, function(pair) {
                pair.imageRenderer.setToView(viewType);
            });
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            return this.curentView;
        }
    });


    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        var self = this;
        this.listeners = [];
        
    	// Clone the template
        var toolbarTemplate = document.getElementById('toolbar-template').content;
        this.toolbarDiv = document.importNode(toolbarTemplate, true);
        
        // Attach an event listener to the ratings clear button
        var ratingsClearButton = this.toolbarDiv.querySelector('.ft-nav-options-filter-clear-btn');
        ratingsClearButton.addEventListener('click', function(event) {
            self.setRatingFilter(0);
        });
        
        // Add a live RatingsView to track the filter
        var models = createModelModule();
        this.ratingsModel = new models.RatingsModel();
        this.ratingsModel.addListener(function(ratingsModel, eventTime) {
            if (ratingsModel.getRating() === 0) {
                ratingsClearButton.classList.add('hidden');
            }
            else { 
                ratingsClearButton.classList.remove('hidden');
            }
            
            self._notify(self, RATING_CHANGE);
        });
        this.ratingsInstance = new RatingsView(this.ratingsModel, true);
        //                            true to disable the caption ^~~~
        
        // Attach the RatingsView to the div
        this.toolbarDiv.querySelector('.ft-nav-options-items-rating').appendChild(this.ratingsInstance.getElement());
        
        // Manage the view
        this.gridViewSelectButton = this.toolbarDiv.querySelectorAll('.ft-nav-options-view')[0];
        this.gridViewSelectButton.addEventListener('click', function(event) {
            self.setToView(GRID_VIEW);
        });
        this.listViewSelectButton = this.toolbarDiv.querySelectorAll('.ft-nav-options-view')[1];
        this.listViewSelectButton.addEventListener('click', function(event) {
            self.setToView(LIST_VIEW);
        });
        
        this.currentView = GRID_VIEW;
        this.setToView(this.currentView);
    };

    _.extend(Toolbar.prototype, {
        _notify: function(toolbar, eventType, eventDate) {
            _.each(this.listeners, function(listener) {
                listener(toolbar, eventType, eventDate || Date.now());
            });
        },
        
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            return this.toolbarDiv;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.addListener: " + JSON.stringify(arguments));
            }
            
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.removeListener: " + JSON.stringify(arguments));
            }
            
            var index = this.listeners.indexOf(listener_fn);
            
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            if (viewType != LIST_VIEW && viewType != GRID_VIEW) {
                throw new Error("Invalid viewType to Toolbar.setToView: " + viewType);
            }
            
            this.currentView = viewType;
            
            if (viewType == LIST_VIEW) {
                this.gridViewSelectButton.classList.remove('ft-nav-options-view-selected');
                this.listViewSelectButton.classList.add('ft-nav-options-view-selected');
            }
            else if (viewType == GRID_VIEW) {
                this.gridViewSelectButton.classList.add('ft-nav-options-view-selected');
                this.listViewSelectButton.classList.remove('ft-nav-options-view-selected');
            }
            
            this._notify(this, viewType);
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
    	   return this.ratingsInstance.getRating();
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            this.ratingsInstance.setRating(rating);
            
            this._notify(this, RATING_CHANGE);
        }
    });


    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        _notify: function(fileChooser, files, eventDate) {
            _.each(this.listeners, function(listener_fn) {
                listener_fn(fileChooser, files, eventDate);
            });
        },
        
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            
            // Clone the file chooser template
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            
            // Attach an event listener to update our listeners when users select files
            var fileChooserInput = this.fileChooserDiv.querySelector('.ft-file-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = Date.now();
                self._notify(self, files, eventDate);
                
                // Clear .value, otherwise onchange won't fire if users select the same file
                // multiple times in a row
                fileChooserInput.value = null;
                
//                _.each(
//                    self.listeners,
//                    function(listener_fn) {
//                        listener_fn(self, files, eventDate);
//                    }
//                );
            });
            
            // Attach event listeners for when users drag/drop files
            var fileChooserContainer = this.fileChooserDiv.querySelector('.ft-file-input-container');
            fileChooserContainer.addEventListener('dragover', function(event) {
                event.stopPropagation();
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
                
                this.classList.add('ft-file-input-container-dragging')
            });
            fileChooserContainer.addEventListener('dragleave', function(event) {
                this.classList.remove('ft-file-input-container-dragging');
            });
            fileChooserContainer.addEventListener('drop', function(event) {
                event.stopPropagation();
                event.preventDefault();
                
                this.classList.remove('ft-file-input-container-dragging');
                
                self._notify(self, event.dataTransfer.files, Date.now());
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });
    
    
    /**
     * An object which manages a ratings view.
     * @constructor
     */
     var RatingsView = function(imageModel, disableCaption) {
         this.model = imageModel;
         this.disableCaption = disableCaption;
         var self = this;
         
         this.userDidInitiateChange = false;
         
         // Add listener to the model to update the views
         this.modelDidUpdateListenerFunction = function(imageModel, eventTime) {
             self.updateStars(imageModel.getRating(), true);
         };
         this.model.addListener(this.modelDidUpdateListenerFunction);
         
         // Clone the template
         var ratingsTemplate = document.getElementById('ratings-template').content;
         this.ratingsDiv = document.importNode(ratingsTemplate, true);
         
         this.starsDiv = this.ratingsDiv.querySelectorAll('div')[0];
         this.captionDiv = this.ratingsDiv.querySelectorAll('div')[1];
         
         // Function to return the star index of a click event in the view
         this.starIndexOfClickEvent = function(event) {
             var starIndex = -1;
             for (var i = 4; i >= 0; i--) {
                 if (event.clientX > this.starsDiv.children[i].getBoundingClientRect().left) {
                    starIndex = i;
                    break;
                 }
             }
             
             return starIndex;
         };
         
         // Add an event listener to handle the mouseover
         this.lastUpdateTime = 0;
         this.starsDiv.addEventListener('mousemove', function(event) {
             // this = starsDiv
             var starIndex = self.starIndexOfClickEvent(event);
             self.updateStars(starIndex + 1);
             
             if (!self.disableCaption) {
                 self.captionDiv.classList.remove('hidden');
                 
                 // .lastUpdateTime enforces that the "rating updated" message should stay on the
                 // screen for at least 1 second as long as the user stays on the same star.
                 // Also works around a bug in Chrome for Windows where mousemove fires on mouse clicks
                 if (Date.now() - self.lastUpdateTime >= 100) {
                     if (starIndex === -1) {
                         self.captionDiv.innerText = "Click to clear rating";
                     }
                     else {
                         self.captionDiv.innerText = "Click to rate "
                            + (starIndex + 1)
                            + ((starIndex + 1) === 1 ? " star" : " stars");
                     }
                 }
             }
         });
         
         // Add an event to clear the view when the user mouseouts
         this.starsDiv.addEventListener('mouseout', function(event) {
             self.lastUpdateTime = 0;
             self.updateStars(self.model.getRating());
             
             if (!self.disableCaption) {
                 self.captionDiv.classList.add('hidden');
             }
         });
         
         // Add an event to change the rating on click
         this.starsDiv.addEventListener('click', function(event) {
             var starIndex = self.starIndexOfClickEvent(event);
             
             self.userDidInitiateChange = true;
             self.lastUpdateTime = Date.now();
             self.model.setRating(starIndex + 1);
         });
         
         // Update the stars view
         this.updateStars(self.model.getRating());
     };
     
     _.extend(RatingsView.prototype, {
         updateStars: function(starCount, showUpdatedMessage) {
             for (var i = 0; i < 5; i++) {
                 this.starsDiv.children[i].src
                    = (i < starCount
                        ? "star-filled.svg"
                        : "star-empty.svg");
             }
             
             if (!this.disableCaption) {
                 if (showUpdatedMessage && this.userDidInitiateChange) {
                     this.captionDiv.classList.remove('hidden');
                     this.captionDiv.classList.add('caption-success');
                     this.captionDiv.innerText = "Rating updated";
                 }
                 else if (Date.now() - this.lastUpdateTime >= 100) {
                     this.captionDiv.classList.remove('caption-success');
                 }
                 this.userDidInitiateChange = false;
             }
         },
         
         setRating: function(starCount) {
             this.model.setRating(starCount);
         },
         
         getRating: function() {
             return this.model.getRating()
         },
         
         getElement: function() {
             return this.ratingsDiv;
         },
         
         getModel: function() {
             return this.model;
         },
         
         setModel: function(newImageModel) {
             this.model.removeListener(this.modelDidUpdateListenerFunction);
             
             this.model = newImageModel;
             this.model.addListener(this.modelDidUpdateListenerFunction);
         }
     });
     
     
    /**
     * A lightbox view for modally displaying an image.
     * @constructor 
     */
    var Lightbox = function() {
        // Clone the template
        this.lightboxTemplate = document.getElementById('lightbox-template').content;
    };
    
    _.extend(Lightbox.prototype, {
        /**
         * Show a lightbox on attachToDiv (or document.body if undefined) with
         * the image at imagePath
         */
        showImage: function(imagePath, attachToDiv) {
            var lightboxDiv = document.createElement('div');
            lightboxDiv.appendChild(document.importNode(this.lightboxTemplate, true));
        
            var image = lightboxDiv.querySelector('.lightbox-content');
            image.src = imagePath;
            
//            var closeButton = lightboxDiv.querySelector('.lightbox-close-hint');
//            closeButton.addEventListener('click', function(event) {
//                document.body.removeChild(document.querySelector('.lightbox'));
//            });
            
            // Add an event listener to allow users to click anywhere to close the lightbox
            var lightboxOnDom = document.body.appendChild(lightboxDiv);
            
            lightboxOnDom.addEventListener('click', function(event) {
                this.classList.add('lightbox-hidden');
                
                this.addEventListener('webkitAnimationEnd', function(event) {
                    document.body.removeChild(this);
                });
                this.addEventListener('animationend', function(event) {
                    document.body.removeChild(this);
                });
            });
        }
    });
    

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,
        
        RatingsView: RatingsView,
        Lightbox: Lightbox,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}
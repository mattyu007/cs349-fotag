'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    var appContainer = document.getElementById('app-container');
        
    // Attach the toolbar to the page
    var toolbar = new viewModule.Toolbar();
    document.body.appendChild(toolbar.getElement());
    
    // Load the image collection model
    var imageCollectionModel = modelModule.loadImageCollectionModel();
    
    // Initialize the image collection model and view
    var imageCollectionView = new viewModule.ImageCollectionView();
    imageCollectionView.setImageCollectionModel(imageCollectionModel);
    
    // Attach the image collection view to the toolbar for view and filter updates
    imageCollectionView.attachToToolbar(toolbar);
    
    // Attach the image collection view to the page
    appContainer.appendChild(imageCollectionView.getElement());
    
    // Attach the file chooser 
    var fileChooser = new viewModule.FileChooser();
    appContainer.appendChild(fileChooser.getElement());
    
    // Add images to the model when they're selected
    fileChooser.addListener(function(fileChooser, files, eventDate) {
        _.each(files, function(file) {
            var image = new modelModule.ImageModel('images/' + file.name, file.lastModifiedDate, '', 0);
            imageCollectionModel.addImageModel(image);
        });
    });
    
    
    // Create a button to allow removing all images from Fotag
    var resetButton = document.createElement('button');
    resetButton.className = 'btn btn-danger';
    resetButton.innerText = 'Remove all photos from Fotag';
    resetButton.addEventListener('click', function(event) {
        var imageModels = imageCollectionModel.getImageModels();
        
        if (imageModels.length === 0) {
            alert('You haven\'t added any photos yet.');
        }
        else if (confirm("Remove all photos from Fotag?")) {
            _.each(imageModels, function(imageModel) {
                imageCollectionModel.removeImageModel(imageModel);
            });
        }
    });
    
    // Listen to the model for changes
    imageCollectionModel.addListener(function(eventType, imageModelCollection, imageModel, eventDate) {
        if (eventType == modelModule.IMAGE_ADDED_TO_COLLECTION_EVENT) {
            resetButton.disabled = false;
        }
        else if (eventType == modelModule.IMAGE_REMOVED_FROM_COLLECTION_EVENT) {
            if (imageModelCollection.getImageModels().length === 0) {
                resetButton.disabled = true;
            }
        }
    });
    
    // Set the initial state of the button
    if (imageCollectionModel.getImageModels().length === 0) {
        resetButton.disabled = true;
    }
    else {
        resetButton.disabled = false;
    }
    
//    var factoryButton = document.createElement('button');
//    factoryButton.className = 'btn';
//    factoryButton.innerText = 'Set new ImageRendererFactory';
//    factoryButton.addEventListener('click', function(event) {
//        var newFactory = new viewModule.ImageRendererFactory();
//        imageCollectionView.setImageRendererFactory(newFactory);
//    });
    
    // Add it to the bottom of the app container, after the main ft-container
    var resetContainer = document.createElement('div');
    resetContainer.style.width = '100%';
    resetContainer.style.textAlign = 'center';
    resetContainer.appendChild(resetButton);
//    resetContainer.appendChild(factoryButton);
    
    appContainer.appendChild(resetContainer);
    
    // Attach a handler to window.onbeforeunload to save the current ImageModels
    window.addEventListener('beforeunload', function(event) {
        modelModule.storeImageCollectionModel(imageCollectionModel);
    });
});
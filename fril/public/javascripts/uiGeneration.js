// ---------------------------- UI ------------------------------

// ##############################################################
// -------------------General elements --------------------------
// ##############################################################

function createCheckbox(id, labelText, checked) {
  var checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add('checkboxContainer');
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.id = id;
  checkbox.style.display = 'none';

  // Create a label accosiated with the checkbox
  var label = document.createElement('label');
  label.classList.add('inputLabel');
  label.htmlFor = id;
  label.appendChild(document.createTextNode(labelText));

  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(label);

  return checkboxContainer;
}

function createDropDown(content, placeholder, id) {
  var dropDownContainer = document.createElement("div");
  dropDownContainer.classList.add('dropDownContainer');

  dropDownPlaceHolder = document.createElement('input');
  dropDownPlaceHolder.readOnly = true;
  dropDownPlaceHolder.placeholder = placeholder;
  dropDownPlaceHolder.classList.add('dropDownPlaceHolder');
  dropDownPlaceHolder.classList.add('text');
  dropDownPlaceHolder.setAttribute('id', id)
  dropDownContainer.appendChild(dropDownPlaceHolder);

  var dropDownIcon = document.createElement('div');
  dropDownIcon.classList.add('dropDownIcon');
  dropDownContainer.appendChild(dropDownIcon);

  dropDownPlaceHolder.addEventListener('focus', function (event) {
    dropDownContent.style.display = 'block';
  });

  dropDownPlaceHolder.addEventListener('blur', function (event) {
    setTimeout(function() {
      dropDownContent.style.display = 'none';
    }, 250);
  });

  var dropDownContent = document.createElement("div");
  dropDownContent.classList.add('dropDownContentContainer');
  dropDownContainer.appendChild(dropDownContent);
  dropDownContent.style.display = 'none';

  for (i = 0; i < content.length; i++) {
    var element = document.createElement("div");
    dropDownContent.appendChild(element);
    element.classList.add('dropDownElement');
    element.classList.add('text');
    element.innerHTML = content[i];

    element.addEventListener('click', function (event) {
      dp = document.getElementById(id);
      dp.value = this.innerHTML;
    });

  }

  return dropDownContainer;
}

// ##############################################################
// ------------------ Specific elements -------------------------
// ##############################################################

function initFilterDiv() {
  // Init div containing the filter
  var optionsContainter = document.getElementById("optionsContainer");
  var sideNav = document.getElementById("sideNav");
  var filterContainer = document.createElement("div");
  filterContainer.id = "filterContainer";
  filterContainer.className = "container text";
  sideNav.appendChild(filterContainer);
  filterContainer.style.display = 'none';

  // Init button in the options container
  var filterButton = document.createElement("button");
  filterButton.setAttribute("id", "filterButton");
  filterButton.classList.add('sideButton');
  optionsContainter.appendChild(filterButton);

  // Hook listener to show/hid filterdiv
  filterButton.addEventListener ("click", function() {
    if (filterContainer.style.display == 'none') {
      hideSideNavElements();
      filterContainer.style.display = 'block';
    } else {
      filterContainer.style.display = 'none';
    }
  });

  // Create one checkbox for each layer
  for (i = 0; i < LAYERS.length; i++) {
    rowContainer = document.createElement('div');
    legend = document.createElement('span');
    legend.style.color = 'rgb(' + LAYER_COLOR[i] + ')';
    legend.innerHTML = '<i class="fa fa-circle-o" aria-hidden="true"></i>';

    checkboxContainer = createCheckbox(LAYERS[i].toString(), LAYER_NAMES[i], true);
    checkbox = checkboxContainer.childNodes[0];
    label = checkboxContainer.childNodes[1];

    // Display or hide layer associated with the checkbox
    checkbox.addEventListener( 'change', function() {
      layer = getLayerByID(this.id);
      // var label = $("label[for='"+$(this).attr('id')+"']");
      var label = $('label[for=' + this.id + ']')[0];
      if(this.checked) {
        layer.setVisible(true);
        label.classList.toggle('unChecked');
      } else {
        layer.setVisible(false);
        label.classList.toggle('unChecked');
      }
    });
    
    rowContainer.appendChild(legend);
    rowContainer.appendChild(checkboxContainer);
    filterContainer.appendChild(rowContainer);
  }
  return filterContainer;
}

function initSpatialSearchDiv() {
  // Init div containing the filter
  var optionsContainter = document.getElementById("optionsContainer");
  var sideNav = document.getElementById("sideNav");
  var spatialSearchContainer = document.createElement("div");
  spatialSearchContainer.id = "spatialSearchContainer";
  spatialSearchContainer.className = "container text";
  sideNav.appendChild(spatialSearchContainer);
  spatialSearchContainer.style.display = 'none';

  // Init button in the options container
  var spatialSearchButton = document.createElement("button");
  spatialSearchButton.setAttribute("id", "spatialSearchButton");
  spatialSearchButton.classList.add('sideButton');
  optionsContainter.appendChild(spatialSearchButton);

  // Hook listener to show/hid filterdiv
  spatialSearchButton.addEventListener ("click", function() {
    if (spatialSearchContainer.style.display == 'none') {
      hideSideNavElements();
      spatialSearchContainer.style.display = 'block';
    } else {
      spatialSearchContainer.style.display = 'none';
    }
  });

  // ############# The 'pop-up' ##############

  // Title container
  var headingContainer = document.createElement("div");
  headingContainer.id = "featureInfoHeader";
  headingContainer.className = "heading";
  headingContainer.innerHTML = 'Find a feature';

  // Description container
  var descriptionContainer = document.createElement("div");
  descriptionContainer.id = "featureInfoDescription";
  descriptionContainer.className = "paragraph";
  descriptionContainer.innerHTML = 'Search for a the closest feature from a location matching the criteria given.';

  // Layer filter container
  var layerFilterContainer = document.createElement("div");
  layerFilterContainer.id = "layerFilterContainer";

  layerDD = createDropDown(LAYER_NAMES, 'Layer', 'layerDDfilter');
  layerFilterContainer.appendChild(layerDD);

  ratingDD = createDropDown(RATINGS, 'Rating greater than', 'ratingDDfilter');
  layerFilterContainer.appendChild(ratingDD);


  // Init button in the options container
  var spatialSearchExecuteButton = document.createElement("button");
  spatialSearchExecuteButton.setAttribute("id", "spatialSearchExecuteButton");
  spatialSearchExecuteButton.innerHTML = "Search ";
  spatialSearchExecuteButton.classList.add('submitButton');
 
  // Hook listener to show/hid filterdiv
  spatialSearchButton.addEventListener ("click", function() {
    // if all fields filled in
      // noahs api query
      // pan to feature
  });


  spatialSearchContainer.appendChild(headingContainer);
  spatialSearchContainer.appendChild(descriptionContainer);
  spatialSearchContainer.appendChild(layerFilterContainer);
  spatialSearchContainer.appendChild(spatialSearchExecuteButton);  
}



function initFeatureInfoContainer() {
  var mapDiv = document.getElementById("map");
  
  // Main container
  var featureInfoContainer = document.createElement("div");
  featureInfoContainer.id = "featureInfoContainer";
  featureInfoContainer.className = "container text";
  featureInfoContainer.style.display = 'none';

  // Title container
  var headingContainer = document.createElement("div");
  headingContainer.id = "featureInfoHeader";
  headingContainer.className = "heading";
  headingContainer.innerHTML = 'Heading';

  // Rating container
  var ratingContainer = document.createElement("div");
  ratingContainer.id = "featureInfoRating";
  ratingContainer.className = "heading";
  ratingContainer.innerHTML = '5/5    Votes: 34';

  // Description container
  var descriptionContainer = document.createElement("div");
  descriptionContainer.id = "featureInfoDescription";
  descriptionContainer.className = "paragraph";
  descriptionContainer.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sollicitudin justo ipsum, id dignissim arcu tempus non. In volutpat rutrum ante ut posuere. Aliquam pretium ultricies semper. Nullam lacinia est ac dui ornare, sed tempus nulla fringilla. In ac lorem dui.';

  // Close button
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "x";
  closeButton.classList.add('closeButton');

  // Hook listener to show/hide
  closeButton.addEventListener ("click", function() {
    if (featureInfoContainer.style.display == 'none') {
      featureInfoContainer.style.display = 'block';
    } else {
      featureInfoContainer.style.display = 'none';
    }
  });

  featureInfoContainer.appendChild(headingContainer);
  featureInfoContainer.appendChild(ratingContainer);
  featureInfoContainer.appendChild(descriptionContainer);
  featureInfoContainer.appendChild(closeButton);

  generateRateField(featureInfoContainer);

  // Rate submit button
  var rateButton = document.createElement("button");
  rateButton.innerHTML = "Rate";
  rateButton.classList.add('submitButton');

  rateButton.addEventListener ("click", function() {
    var rating = 0;
    for (i = 0; i < 5; i++) {
      var e = document.getElementById('ratingElement' + i);
      if (e.classList.contains('selectTarget')) {
        rating += 1;
      } else {
        break;
      }
    }
    if (rating >= 1) {
      rateFeature(CURRENT_SELECTED_FEATURE, rating);
      clearRating();
    }
  });
  
  // Append to DOM
  featureInfoContainer.appendChild(rateButton);
  mapDiv.appendChild(featureInfoContainer);

}

function generateRateField(parent) {
  ratingSelectList = []
  for (i = 0; i < 5; i++) {
    var ratingElement = document.createElement("button");
    ratingElement.setAttribute("name", i);
    ratingElement.setAttribute("id", 'ratingElement' + i);
    ratingSelectList[i] = ratingElement;
    ratingElement.classList.add('ratingSelect');
    parent.appendChild(ratingElement);
    
    ratingElement.addEventListener ("mouseenter", function(event) {
      for (j = 0; j <= this.name; j++) {
        ratingSelectList[j].classList.add('hoverTarget');
      }
    });

    ratingElement.addEventListener ("click", function(event) {
      for (j = 0; j <= this.name; j++) {
        ratingSelectList[j].classList.add('selectTarget');
      }

      for (k = parseInt(this.name) + 1; k < 5; k++) {
        ratingSelectList[k].classList.remove('selectTarget');
      }
    });

    ratingElement.addEventListener ("mouseout", function(event) {
      for (j = 0; j <= this.name; j++) {
        ratingSelectList[j].classList.remove('hoverTarget');
      }
    });
  }
}

// ##############################################################
// -------------------Suport funcs ------------------------------
// ##############################################################

function clearRatingUI() {
  for (i = 0; i < 5; i++) {
    var e = document.getElementById('ratingElement' + i);
    e.classList.remove('selectTarget');
  }
}

function hideSideNavElements() {
  var sideNavElements = sideNav.childNodes;
  for (i = 0; i < sideNavElements.length; i++) {
    if (sideNavElements[i].nodeType != 3 && sideNavElements[i].id != 'optionsContainer') {
      sideNavElements[i].style.display = 'none';
    }
  }
}
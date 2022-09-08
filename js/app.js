// Global Variables
const main = document.querySelector("main");
const dataURL = "./data/data.json";
const searchBar = document.querySelector(".search-bar");
const searchItems = document.querySelector(".search-items");

// Function To Get JSON Data
const getData = async (URL) => {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Calling The Async getData Function Then Destructuring The Data
getData(dataURL).then((data) => {
  const jobs = structuredClone(data);
  jobs.forEach((job) => {
    
    // Destructuring Each Job Object And Creating An Element For Each
    let {
      id,
      company,
      logo,
      new: notOld,
      featured,
      position,
      role,
      level,
      postedAt,
      contract,
      location,
      languages,
      tools,
    } = job;

    // Check If Featured
    let featuredListing = featured ? `featured--listing` : ``;
    let featuredSpan = featured
      ? `<span class="featured rounded-pill py-1 px-2 text-white">FEATURED</span>`
      : ``;

    // Check If New
    let newSpan = notOld
      ? `<span class="new rounded-pill py-1 px-2 text-white">NEW!</span>`
      : ``;

    // Add Tools, Languages, Role And Level
    let allTools = ``;
    allTools += `<span role="button" class="tool fw-bold rounded p-2 m-2 h-auto">${role}</span>\n`;
    allTools += `<span role="button" class="tool fw-bold rounded p-2 m-2 h-auto">${level}</span>\n`;
    languages.forEach((language) => {
      allTools += `<span role="button" class="tool fw-bold rounded p-2 m-2 h-auto">${language}</span>\n`;
    });
    tools.forEach((tool) => {
      allTools += `<span role="button" class="tool fw-bold rounded p-2 m-2 h-auto">${tool}</span>\n`;
    });

    // Create The Listing
    let listing = `
    <!-- Listing | Start -->
    <div
      id="${id}"
      class="listing ${featuredListing} row justify-content-between position-relative shadow-lg rounded pt-5 pt-lg-4 pb-3 px-4 mx-2 mx-xl-5 my-5"
    >
      <!-- Logo Img | Start-->
      <img
        class="position-absolute p-0"
        src="${logo}"
        alt="Company Logo"
      />
      <!-- Logo Img | End-->

      <!-- Info 1 | Start -->
      <div
        class="listing--info-1 d-flex flex-column col-lg-6 d-flex p-0 ps-lg-5 ms-lg-5 my-3"
      >
        <!-- Company . New . Featured | Start -->
        <div class="properties-1 mb-2 ms-lg-5">
          <span class="name fw-bold me-3 fs-4">${company}</span>
          ${newSpan}
          ${featuredSpan}
        </div>
        <!-- Company . New . Featured | End -->

        <!-- Job Title | Start -->
        <h5 role="button" class="position fw-bolder mb-3 ms-lg-5">${position}</h5>
        <!-- Job Title | End -->

        <!-- Date . Type . Location | Start -->
        <div class="properties-2 ms-lg-5 text-secondary">
          ${postedAt} . ${contract} . ${location}
        </div>
        <!-- Date . Type . Location | End -->
      </div>

      <!-- Info 1 | End -->

      <hr class="d-lg-none" />

      <!-- Info 2 | Start -->
      <div
        class="tools d-flex align-items-center flex-wrap justify-content-lg-end col-lg-5 mb-3 p-0"
      >
        ${allTools}
        
      </div>
      <!-- Info 2 | End -->
    </div>
    <!-- Listing | End -->`;
    
    // Append The Listing To Main
    main.insertAdjacentHTML("beforeend", listing);
  });
  
  // Calling The Function To Apply Event Listeners To Tools After All Listings Are Added To The Page
  applyListeners();
});


// Main Function Which Applies EventListeners And Calls The Filtering Function
function applyListeners() {

  // Creating Variables Used Multiple Times
  let searchedToolsArr = [];
  const listings = document.querySelectorAll(".listing");
  const allTools = document.querySelectorAll(".tool");

  // Selecting All Tools In The Page And Adding Listeners So That When Clicked, Listings
  // Are Filtered And Clicked Tool Is Added As A Search Item In The Search Bar And searchedToolsArr
  allTools.forEach((clickedTool) => {
    clickedTool.addEventListener("click", () => {
      
      // Only Do This If This Is The First Time Clicking A Tool
      if (searchedToolsArr.length < 1) {
        searchBar.style.display = "block";
      }
      
      // Check If Tool Clicked Not Already In The searchedToolsArr Hence Not In The Search Bar
      if (!searchedToolsArr.includes(clickedTool.innerText)) {
        
        // Add To Array
        searchedToolsArr.push(clickedTool.innerText);
        
        // Add To Page
        searchItems.insertAdjacentHTML(
          "beforeend",
          `<div class="btn-group m-2" role="group" data-name="${clickedTool.innerText}" aria-label="Search Item">
        <button type="button" class="search-item btn fw-bold border-0">
          ${clickedTool.innerText}
        </button>
        <button
          class="close text-white btn border-0 p-0 d-flex justify-content-center align-items-center fs-4 fw-bolder px-1"
        >
          <ion-icon name="close-sharp"></ion-icon>
        </button>
      </div>`
        );

        // Call The Function Responsible For Filtering The Listings
        filterListings(listings, searchedToolsArr);

        // Close Button Functionality
        document
          .querySelector(`[data-name="${clickedTool.innerText}"]`)
          .lastElementChild.addEventListener("click", (event) => {
            
            // When Close Button Is Clicked, Check If This Is The Last Tool In The
            // Search Bar Then Reset searchedToolsArr, Remove The Tool From The
            // Search Bar Hide The Search Bar And Show All Listings
            if (searchedToolsArr.length === 1) {
              searchedToolsArr = [];
              event.currentTarget.parentElement.remove(); // Parent Is The Tool Element
              searchBar.style.display = "none";
              listings.forEach((listing) => {
                listing.style.display = "flex";
              });
            } else {
              
              // If This Is Not The Last Tool In The Search Bar Remove It From The searchedToolsArr, Remove It
              // From The Search Bar And Re-Filter The Listings By Calling The filterListings Function
              let removedToolIndex = searchedToolsArr.indexOf(clickedTool.innerText);
              
              // indexOf(Value) Returns (-1) If Value Isn't Found In The Array, So To Prevent This From Causing splice()
              // To Raise An Error, We Add The Condition That The Index Of Removed Tool Is Greater Than 1
              if (removedToolIndex > -1) {
                
                // Using splice() To Remove The Tool From The searchedToolsArr
                searchedToolsArr.splice(removedToolIndex, 1);
                
                event.currentTarget.parentElement.remove();
                
                // Call The Function Responsible For Filtering The Listings
                filterListings(listings, searchedToolsArr);
              }
            }
          });
      }
    });
  });

  // Clear Button Functionality
  document.querySelector(".clear").addEventListener("click", () => {
    searchedToolsArr = [];
    searchBar.style.display = "none";
    searchItems.innerHTML = ``;
    listings.forEach((listing) => {
      listing.style.display = "flex";
    });
  });
}


// Function Responsible For Filtering The Listings
function filterListings(listingsToFilter, searchedTools) {
  listingsToFilter.forEach((listing) => {
    
    // Create An Array That Holds The Values Of Tools In The Current Listing
    let listingTools = Array.from(listing.lastElementChild.children).map(
      (x) => x.innerText
    );
    
    // Creating An Array That Stores The Value True If The Searched Tool In searchedTools Also Exists In
    // listingTools, And Stores The Value False If The Searched Tool Isn't Found In The listingTools Array
    let conditionArr = searchedTools.map((item) => listingTools.includes(item));
      
    // Now Check, If The conditionArr Values Are All True, Show The Listing, 
    // If It Includes At Least One False Value Then Hide The Listing
    if (!conditionArr.includes(false)) {
      listing.style.display = "flex";
    } else {
      listing.style.display = "none";
    }
  });
}
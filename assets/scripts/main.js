// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1. Check if serviceWorker is supported
  if ('serviceWorker' in navigator) {
    // B2. Listen for the load event
    window.addEventListener('load', () => {
      // B3. Register the service worker
      navigator.serviceWorker.register('./sw.js')
        // B4. Log success
        .then((reg) => console.log('Service worker registered!', reg))
        // B5. Log failure
        .catch((err) => console.log('Service worker failed to register', err));
    });
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // A1. Check local storage to see if there are any recipes
  const stored = localStorage.getItem('recipes');
  if (stored) {
    return JSON.parse(stored);
  }

  // A2. Empty array to hold fetched recipes
  const recipes = [];

  // A3. Return a new Promise
  return new Promise(async (resolve, reject) => {
    // A4. Loop through each URL
    for (const url of RECIPE_URLS) {
      // A5. try/catch
      try {
        // A6. Fetch the URL
        const response = await fetch(url);
        // A7. Get JSON from the response
        const recipe = await response.json();
        // A8. Add to array
        recipes.push(recipe);
        // A9. If we've fetched all recipes, save and resolve
        if (recipes.length === RECIPE_URLS.length) {
          saveRecipesToStorage(recipes);
          resolve(recipes);
        }
      } catch (err) {
        // A10. Log errors
        console.error(err);
        // A11. Reject the promise
        reject(err);
      }
    }
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
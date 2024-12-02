const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
let db;

// Initialize the database
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();
// Function to fetch all restaurants
async function getAllRestaurants() {
  const query = 'SELECT * FROM restaurants';
  const response = await db.all(query);
  return { restaurants: response };
}

// Endpoint to handle fetching all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const result = await getAllRestaurants();

    if (result.restaurants.length === 0) {
      return res.status(404).json({ error: 'No Restaurants Found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch a specific restaurant by ID
async function getRestaurantById(id) {
  const query = 'SELECT * FROM restaurants WHERE id = ?';
  const response = await db.get(query, [id]);
  return { restaurant: response };
}

// Endpoint to handle fetching restaurant by ID
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getRestaurantById(id);

    if (!result.restaurant) {
      return res.status(404).json({ error: 'Restaurant Not Found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch restaurants by cuisine
async function getRestaurantsByCuisine(cuisine) {
  const query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  const response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

// Endpoint to handle fetching restaurants by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const result = await getRestaurantsByCuisine(cuisine);

    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ error: 'No Restaurants Found for the given Cuisine' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch restaurants by filters
async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  const query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  const response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

// Endpoint to handle fetching restaurants by filters
app.get('/restaurants/filter', async (req, res) => {
  try {
    const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
    const result = await getRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ error: 'No Restaurants Found with the given Filters' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch restaurants sorted by rating
async function getRestaurantsSortedByRating() {
  const query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  const response = await db.all(query);
  return { restaurants: response };
}

// Endpoint to handle fetching restaurants sorted by rating
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const result = await getRestaurantsSortedByRating();

    if (result.restaurants.length === 0) {
      return res.status(404).json({ error: 'No Restaurants Found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch all dishes
async function getAllDishes() {
  const query = 'SELECT * FROM dishes';
  const response = await db.all(query);
  return { dishes: response };
}

// Endpoint to handle fetching all dishes
app.get('/dishes', async (req, res) => {
  try {
    const result = await getAllDishes();

    if (result.dishes.length === 0) {
      return res.status(404).json({ error: 'No Dishes Found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch a specific dish by ID
async function getDishById(id) {
  const query = 'SELECT * FROM dishes WHERE id = ?';
  const response = await db.get(query, [id]);
  return { dish: response };
}

// Endpoint to handle fetching a dish by ID
app.get('/dishes/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getDishById(id);

    if (!result.dish) {
      return res.status(404).json({ error: 'Dish Not Found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch dishes by filter
async function getDishesByFilter(isVeg) {
  const query = 'SELECT * FROM dishes WHERE isVeg = ?';
  const response = await db.all(query, [isVeg]);
  return { dishes: response };
}

// Endpoint to handle fetching dishes by filter
app.get('/dishes/filter', async (req, res) => {
  try {
    const isVeg = req.query.isVeg;
    const result = await getDishesByFilter(isVeg);

    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ error: 'No Dishes Found with the given Filter' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch dishes sorted by price
async function getDishesSortedByPrice() {
  const query = 'SELECT * FROM dishes ORDER BY price ASC';
  const response = await db.all(query);
  return { dishes: response };
}

// Endpoint to handle fetching dishes sorted by price
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const result = await getDishesSortedByPrice();

    if (result.dishes.length === 0) {
      return res.status(404).json({ error: 'No Dishes Found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

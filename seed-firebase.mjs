import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const now = Timestamp.now();

// ==================== SETTINGS ====================
const settings = {
    restaurantName: 'Crisp Quick',
    logoUrl: '/images/logo.png',
    phone: '+213 555 123 456',
    address: 'Bab Ezzouar, Algiers',
    acceptOrders: true,
    acceptAiCalls: true,
    deliveryEnabled: true,
    pickupEnabled: true,
    preparationTime: 25,
    soundNotifications: true,
    browserNotifications: true,
    workingHours: {
        monday: { isOpen: true, open: '11:00', close: '23:00' },
        tuesday: { isOpen: true, open: '11:00', close: '23:00' },
        wednesday: { isOpen: true, open: '11:00', close: '23:00' },
        thursday: { isOpen: true, open: '11:00', close: '23:00' },
        friday: { isOpen: true, open: '11:00', close: '00:00' },
        saturday: { isOpen: true, open: '10:00', close: '00:00' },
        sunday: { isOpen: true, open: '10:00', close: '23:00' },
    },
    updatedAt: now,
};

// ==================== CATEGORIES ====================
const categories = [
    { id: 'burgers', name: 'Burgers', imageUrl: '/images/categories/burgers.png', displayOrder: 1 },
    { id: 'pizza', name: 'Pizza', imageUrl: '/images/categories/pizza.png', displayOrder: 2 },
    { id: 'sides', name: 'Sides', imageUrl: '/images/categories/sides.png', displayOrder: 3 },
    { id: 'drinks', name: 'Drinks', imageUrl: '/images/categories/drinks.png', displayOrder: 4 },
    { id: 'sauces', name: 'Sauces', imageUrl: '/images/categories/sauces.png', displayOrder: 5 },
];

// ==================== EXTRAS ====================
const extras = [
    { id: 'classic-house-sauce', name: 'Classic House Sauce', price: 80, ingredients: ['mayonnaise', 'ketchup', 'mustard', 'pickles', 'garlic powder', 'onion powder'] },
    { id: 'warm-cheddar-cheese-sauce', name: 'Warm Cheddar Cheese Sauce', price: 150, ingredients: ['cheddar cheese'] },
    { id: 'garlic-aioli-sauce', name: 'Garlic Aioli Sauce', price: 80, ingredients: ['mayonnaise', 'garlic', 'lemon juice', 'parsley'] },
    { id: 'truffle-mayo-sauce', name: 'Truffle Mayo Sauce', price: 150, ingredients: ['mayonnaise', 'truffle oil'] },
    { id: 'algerian-sauce', name: 'Algerian Sauce', price: 80, ingredients: ['mayonnaise', 'onion', 'harissa', 'canned tomato', 'cumin'] },
    { id: 'buffalo-sauce', name: 'Buffalo Sauce', price: 100, ingredients: ['butter', 'hot chili sauce', 'vinegar'] },
    { id: 'sriracha-mayo-sauce', name: 'Sriracha Mayo Sauce', price: 90, ingredients: ['mayonnaise', 'sriracha sauce'] },
    { id: 'jalapeno-cheese-sauce', name: 'Jalapeño Cheese Sauce', price: 160, ingredients: ['liquid cheddar cheese sauce', 'jalapeno'] },
    { id: 'bbq-sauce', name: 'BBQ Sauce', price: 80, ingredients: ['smoked bbq sauce'] },
    { id: 'marinara-sauce', name: 'Marinara Sauce', price: 80, ingredients: ['tomato sauce', 'oregano', 'basil', 'garlic'] },
];

// ==================== MENU ITEMS ====================
const menuItems = [
    // BURGERS
    { id: 'classic-cheeseburger', categoryId: 'burgers', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar cheese, lettuce, tomato, pickles and house sauce on a brioche bun.', imageUrl: '/images/burgers/Classic%20Cheeseburger.jpg', hasCustomImage: true, availability: 'available', basePrice: 650, ingredients: ['brioche bun', 'beef patty', 'cheddar cheese', 'lettuce', 'tomato', 'pickles', 'classic house sauce'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 300 }, { id: 'v-xxl', name: 'XXL', priceModifier: 600 }], extrasIds: [], displayOrder: 1 },
    { id: 'mushroom-swiss', categoryId: 'burgers', name: 'Mushroom Swiss Burger', description: 'Sautéed mushrooms, Swiss cheese and garlic mayonnaise on a beef patty.', imageUrl: '/images/burgers/Mushroom%20Swiss%20Burger.jpg', hasCustomImage: true, availability: 'available', basePrice: 750, ingredients: ['brioche bun', 'beef patty', 'sauteed mushrooms', 'swiss cheese', 'garlic mayonnaise'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 300 }, { id: 'v-xxl', name: 'XXL', priceModifier: 600 }], extrasIds: [], displayOrder: 2 },
    { id: 'bbq-bacon-burger', categoryId: 'burgers', name: 'BBQ Bacon Burger', description: 'Beef bacon, onion rings, cheddar cheese and BBQ sauce on a beef patty.', imageUrl: '/images/burgers/BBQ%20Bacon%20Burger.png', hasCustomImage: true, availability: 'available', basePrice: 800, ingredients: ['brioche bun', 'beef patty', 'beef bacon', 'onion rings', 'cheddar cheese', 'bbq sauce'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 300 }, { id: 'v-xxl', name: 'XXL', priceModifier: 600 }], extrasIds: [], displayOrder: 3 },
    { id: 'spicy-jalapeno-burger', categoryId: 'burgers', name: 'Spicy Jalapeño Burger', description: 'Jalapeños, pepper jack cheese and sriracha sauce for a kick of heat.', imageUrl: '/images/burgers/Spicy%20Jalapeno%20Burger.png', hasCustomImage: true, availability: 'available', basePrice: 700, ingredients: ['brioche bun', 'beef patty', 'jalapeno', 'pepper jack cheese', 'sriracha sauce'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 300 }, { id: 'v-xxl', name: 'XXL', priceModifier: 600 }], extrasIds: [], displayOrder: 4 },
    { id: 'crispy-chicken-burger', categoryId: 'burgers', name: 'Crispy Chicken Burger', description: 'Crispy chicken breast with lettuce, pickles and mayonnaise on a brioche bun.', imageUrl: '/images/burgers/Crispy%20Chicken%20Burger.png', hasCustomImage: true, availability: 'available', basePrice: 600, ingredients: ['brioche bun', 'crispy chicken breast', 'lettuce', 'pickles', 'mayonnaise'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 300 }, { id: 'v-xxl', name: 'XXL', priceModifier: 550 }], extrasIds: [], displayOrder: 5 },
    // PIZZAS
    { id: 'margherita', categoryId: 'pizza', name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella cheese, olive oil and fresh basil.', imageUrl: '/images/pizza/Margherita%20Pizza.png', hasCustomImage: true, availability: 'available', basePrice: 700, ingredients: ['pizza dough', 'tomato sauce', 'mozzarella cheese', 'olive oil', 'basil'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 400 }, { id: 'v-xxl', name: 'XXL', priceModifier: 750 }], extrasIds: [], displayOrder: 1 },
    { id: 'pepperoni', categoryId: 'pizza', name: 'Pepperoni Pizza', description: 'Loaded with beef pepperoni and mozzarella cheese on tomato sauce.', imageUrl: '/images/pizza/Pepperoni%20Pizza.png', hasCustomImage: true, availability: 'available', basePrice: 950, ingredients: ['pizza dough', 'tomato sauce', 'mozzarella cheese', 'beef pepperoni'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 450 }, { id: 'v-xxl', name: 'XXL', priceModifier: 850 }], extrasIds: [], displayOrder: 2 },
    { id: 'bbq-chicken-pizza', categoryId: 'pizza', name: 'BBQ Chicken Pizza', description: 'Grilled chicken, red onion, mozzarella cheese and BBQ sauce.', imageUrl: '/images/pizza/BBQ%20Chicken%20Pizza.png', hasCustomImage: true, availability: 'available', basePrice: 900, ingredients: ['pizza dough', 'grilled chicken', 'red onion', 'mozzarella cheese', 'bbq sauce'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 450 }, { id: 'v-xxl', name: 'XXL', priceModifier: 850 }], extrasIds: [], displayOrder: 3 },
    { id: 'vegetarian-pizza', categoryId: 'pizza', name: 'Vegetarian Pizza', description: 'Bell peppers, onion, mushrooms, black olives, corn and mozzarella cheese.', imageUrl: '/images/pizza/Vegetarian%20Pizza.png', hasCustomImage: true, availability: 'available', basePrice: 800, ingredients: ['pizza dough', 'bell peppers', 'onion', 'mushrooms', 'black olives', 'corn', 'mozzarella cheese'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 400 }, { id: 'v-xxl', name: 'XXL', priceModifier: 750 }], extrasIds: [], displayOrder: 4 },
    { id: 'quattro-formaggi', categoryId: 'pizza', name: 'Quattro Formaggi Pizza', description: 'Four cheese blend: mozzarella, cheddar, gouda and Algerian red cheese.', imageUrl: '/images/pizza/Quattro%20Formaggi%20Pizza.png', hasCustomImage: true, availability: 'available', basePrice: 1000, ingredients: ['pizza dough', 'mozzarella cheese', 'cheddar cheese', 'gouda cheese', 'algerian red cheese'], variants: [{ id: 'v-l', name: 'L', priceModifier: 0 }, { id: 'v-xl', name: 'XL', priceModifier: 500 }, { id: 'v-xxl', name: 'XXL', priceModifier: 900 }], extrasIds: [], displayOrder: 5 },
    // SIDES
    { id: 'french-fries', categoryId: 'sides', name: 'French Fries', description: 'Crispy golden fries with house spice blend.', imageUrl: '/images/sides/French%20Fries.png', hasCustomImage: true, availability: 'available', basePrice: 250, ingredients: ['potato', 'house spice blend'], variants: [], extrasIds: [], displayOrder: 1 },
    { id: 'cheese-bacon-fries', categoryId: 'sides', name: 'Cheese and Bacon Fries', description: 'Crispy fries topped with cheddar cheese sauce and beef bacon.', imageUrl: '/images/sides/Cheese%20and%20Bacon%20Fries.png', hasCustomImage: true, availability: 'available', basePrice: 450, ingredients: ['potato', 'liquid cheddar cheese sauce', 'beef bacon'], variants: [], extrasIds: [], displayOrder: 2 },
    { id: 'onion-rings', categoryId: 'sides', name: 'Onion Rings', description: 'Breaded onion rings with a crispy golden exterior.', imageUrl: '/images/sides/Onion%20Rings.jpg', hasCustomImage: true, availability: 'available', basePrice: 350, ingredients: ['onion', 'breaded coating'], variants: [], extrasIds: [], displayOrder: 3 },
    { id: 'mozzarella-sticks', categoryId: 'sides', name: 'Mozzarella Sticks', description: 'Crispy mozzarella sticks with marinara sauce for dipping.', imageUrl: '/images/sides/Mozzarella%20Sticks.jpg', hasCustomImage: true, availability: 'available', basePrice: 450, ingredients: ['mozzarella cheese', 'breaded coating', 'marinara sauce'], variants: [], extrasIds: [], displayOrder: 4 },
    { id: 'chicken-wings', categoryId: 'sides', name: 'Chicken Wings', description: 'Tender chicken wings with buffalo sauce or BBQ sauce.', imageUrl: '/images/sides/Chicken%20Wings.jpg', hasCustomImage: true, availability: 'available', basePrice: 600, ingredients: ['chicken wings', 'buffalo sauce or bbq sauce'], variants: [], extrasIds: [], displayOrder: 5 },
    // DRINKS
    { id: 'soft-drinks', categoryId: 'drinks', name: 'Soft Drinks', description: 'Refreshing carbonated soft drinks.', imageUrl: '/images/drinks/Soft%20Drinks.png', hasCustomImage: true, availability: 'available', basePrice: 120, ingredients: ['carbonated soft drink'], variants: [], extrasIds: [], displayOrder: 1 },
    { id: 'fresh-orange-juice', categoryId: 'drinks', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice.', imageUrl: '/images/drinks/Fresh%20Orange%20Juice.png', hasCustomImage: true, availability: 'available', basePrice: 300, ingredients: ['orange'], variants: [], extrasIds: [], displayOrder: 2 },
    { id: 'lemon-mint-juice', categoryId: 'drinks', name: 'Lemon Mint Juice', description: 'Refreshing lemon and mint juice blend.', imageUrl: '/images/drinks/Lemon%20Mint%20Juice.png', hasCustomImage: true, availability: 'available', basePrice: 300, ingredients: ['lemon', 'mint'], variants: [], extrasIds: [], displayOrder: 3 },
    { id: 'premium-milkshake', categoryId: 'drinks', name: 'Premium Milkshake', description: 'Creamy milkshake available in vanilla, chocolate, oreo or lotus flavor.', imageUrl: '/images/drinks/Premium%20Milkshake.png', hasCustomImage: true, availability: 'available', basePrice: 400, ingredients: ['milk', 'cream', 'vanilla or chocolate or oreo or lotus flavor'], variants: [], extrasIds: [], displayOrder: 4 },
    // SAUCES
    { id: 'classic-house-sauce-product', categoryId: 'sauces', name: 'Classic House Sauce', description: 'Our signature creamy blend of mayonnaise, ketchup, mustard and pickles.', imageUrl: '/images/sauces/Classic%20House%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 80, ingredients: ['mayonnaise', 'ketchup', 'mustard', 'pickles', 'garlic powder', 'onion powder'], variants: [], extrasIds: [], displayOrder: 1 },
    { id: 'warm-cheddar-cheese-sauce-product', categoryId: 'sauces', name: 'Warm Cheddar Cheese Sauce', description: 'Rich, warm liquid cheddar — perfect for dipping or topping.', imageUrl: '/images/sauces/Warm%20Cheddar%20Cheese%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 150, ingredients: ['cheddar cheese'], variants: [], extrasIds: [], displayOrder: 2 },
    { id: 'garlic-aioli-sauce-product', categoryId: 'sauces', name: 'Garlic Aioli Sauce', description: 'Creamy mayonnaise blended with fresh garlic, lemon and parsley.', imageUrl: '/images/sauces/Garlic%20Aioli%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 80, ingredients: ['mayonnaise', 'garlic', 'lemon juice', 'parsley'], variants: [], extrasIds: [], displayOrder: 3 },
    { id: 'truffle-mayo-sauce-product', categoryId: 'sauces', name: 'Truffle Mayo Sauce', description: 'Mayonnaise infused with premium truffle oil for a touch of luxury.', imageUrl: '/images/sauces/Truffle%20Mayo%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 150, ingredients: ['mayonnaise', 'truffle oil'], variants: [], extrasIds: [], displayOrder: 4 },
    { id: 'algerian-sauce-product', categoryId: 'sauces', name: 'Algerian Sauce', description: 'A local favorite — mayonnaise, onion, harissa, tomato and cumin.', imageUrl: '/images/sauces/Algerian%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 80, ingredients: ['mayonnaise', 'onion', 'harissa', 'canned tomato', 'cumin'], variants: [], extrasIds: [], displayOrder: 5 },
    { id: 'buffalo-sauce-product', categoryId: 'sauces', name: 'Buffalo Sauce', description: 'Spicy butter-based hot sauce with a tangy kick.', imageUrl: '/images/sauces/Buffalo%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 100, ingredients: ['butter', 'hot chili sauce', 'vinegar'], variants: [], extrasIds: [], displayOrder: 6 },
    { id: 'sriracha-mayo-sauce-product', categoryId: 'sauces', name: 'Sriracha Mayo Sauce', description: 'Spicy and tangy blend of mayonnaise and Thai sriracha.', imageUrl: '/images/sauces/Sriracha%20Mayo%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 90, ingredients: ['mayonnaise', 'sriracha sauce'], variants: [], extrasIds: [], displayOrder: 7 },
    { id: 'jalapeno-cheese-sauce-product', categoryId: 'sauces', name: 'Jalapeño Cheese Sauce', description: 'Warm liquid cheddar loaded with chopped jalapeños.', imageUrl: '/images/sauces/Jalapeno%20Cheese%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 160, ingredients: ['liquid cheddar cheese sauce', 'jalapeno'], variants: [], extrasIds: [], displayOrder: 8 },
    { id: 'bbq-sauce-product', categoryId: 'sauces', name: 'BBQ Sauce', description: 'Smoky, slightly sweet barbecue sauce.', imageUrl: '/images/sauces/BBQ%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 80, ingredients: ['smoked bbq sauce'], variants: [], extrasIds: [], displayOrder: 9 },
    { id: 'marinara-sauce-product', categoryId: 'sauces', name: 'Marinara Sauce', description: 'Italian tomato sauce simmered with herbs and garlic.', imageUrl: '/images/sauces/Marinara%20Sauce.png', hasCustomImage: true, availability: 'available', basePrice: 80, ingredients: ['tomato sauce', 'oregano', 'basil', 'garlic'], variants: [], extrasIds: [], displayOrder: 10 },
];

async function seed() {
    console.log('🚀 Starting seed...');

    // Settings
    await db.collection('settings').doc('config').set(settings);
    console.log('✅ Settings uploaded');

    // Categories
    for (const cat of categories) {
        const { id, ...data } = cat;
        await db.collection('categories').doc(id).set({ ...data, createdAt: now });
    }
    console.log('✅ Categories uploaded (5)');

    // Extras
    for (const extra of extras) {
        const { id, ...data } = extra;
        await db.collection('extras').doc(id).set({ ...data, createdAt: now });
    }
    console.log('✅ Extras uploaded (10)');

    // Menu Items
    for (const item of menuItems) {
        const { id, ...data } = item;
        await db.collection('menuItems').doc(id).set({ ...data, createdAt: now, updatedAt: now });
    }
    console.log('✅ Menu Items uploaded (29)');

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
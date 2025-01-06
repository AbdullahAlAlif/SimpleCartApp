let product_num = 10; //Amount of Products 
let container = document.getElementById('card-container');

// Fetch data from the API 
for (let index = 1; index <= product_num; index++) {
    fetch(`https://fakestoreapi.com/products/${index}`) 
        .then(res => res.json()) 
        .then(json => { 
            let card = document.createElement('div');
            card.className = 'card col-md-4';
            card.style.width = '18rem';
            card.style.margin = '10px';
            card.id=`${index}`;

            // Create the card image 
            let cardImg = document.createElement('img');
            cardImg.className = 'card-img-top';
            cardImg.src = json.image;
            cardImg.alt = json.title;
            card.appendChild(cardImg);

            // Create the card body
            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // Create the card title
            let cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.innerHTML = json.title;
            cardBody.appendChild(cardTitle);

            // Create the card content
            let cardContent = document.createElement('p');
            cardContent.className = 'card-text justify-text';
            cardContent.innerHTML = json.description;
            cardBody.appendChild(cardContent);

            // Create the card price
            let cardPrice = document.createElement('h4');
            cardPrice.className = 'card-subtitle mb-2 text-muted';
            cardPrice.innerHTML = json.price + " $";
            cardBody.appendChild(cardPrice);

            // Create the card button
            let cardButton = document.createElement('a');
            cardButton.className = 'btn btn-primary btn-e';
            cardButton.onclick = function() { addToCart(index,json.title,json.price,json.image); };
            cardButton.innerHTML = 'Add to Cart 🛒';
            cardBody.appendChild(cardButton);

            // Add the card body to the card
            card.appendChild(cardBody);

            // Add the card to the container
            container.appendChild(card);
        })
        .catch(error => console.error('Error fetching data:', error));
}


let cart = [];  //This cart array will work as our Cart. As cart is just a list of products. So the goal is to push products and keep track also display

function addToCart(index, title, price, imgSrc) {
    // Check if the product already exists in the cart
    let existingProduct = cart.find(item => item.index === index);

    if (existingProduct) {
        // If the product exists, increment the quantity and update the price
        existingProduct.quantity++;
        existingProduct.totalPrice = existingProduct.quantity * price;
    } else {
        // If the product does not exist, add it to the cart
        let product = {
            index: index,
            title: title,
            price: price,
            imgSrc: imgSrc,
            quantity: 1,
            Price: price  //This will change depending on the quantity as it is the Price of one item as a whole (sum of all N number of one item)
        };
        cart.push(product);
    }

    // Update the cart display
    updateCartDisplay();
}

function updateCartDisplay() {
    let cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = ''; // Clear the cart container as were using cart array it would be ez to just insert the entire array every time with a loop since cart wont be that big usually.

    let total = 0;

    cart.forEach(product => {
        total += product.Price;

        // Create the product card
        let productCard = document.createElement('div');
        productCard.className = 'd-flex justify-content-between align-items-center mb-3';

        // Product image
        let img = document.createElement('img');
        img.src = product.imgSrc;
        img.alt = product.title;
        img.style.width = '50px';
        img.style.height = '50px';
        img.className = 'me-3';

        // Product title and price
        let productInfo = document.createElement('div');
        productInfo.className = 'flex-grow-1';

        let productTitle = document.createElement('p');
        productTitle.className = 'mb-1';
        productTitle.textContent = product.title;

        let productPrice = document.createElement('p');
        productPrice.className = 'mb-1';
        productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

        productInfo.appendChild(productTitle);
        productInfo.appendChild(productPrice);

        // controls
        let controls = document.createElement('div');
        controls.className = 'd-flex flex-column align-items-center justify-content-center';
        
        // Cancel button
        let cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-danger w-100 mb-2';
        cancelButton.innerHTML = 'X';
        cancelButton.onclick = function() {
            cart = cart.filter(item => item.index !== product.index);
            updateCartDisplay();
        };
        
        // Quantity controls
        let quantityControls = document.createElement('div');
        quantityControls.className = 'd-flex align-items-center justify-content-center w-100';
        
        let decrementButton = document.createElement('button');
        decrementButton.className = 'btn btn-outline-secondary btn-sm me-2';
        decrementButton.textContent = '-';
        decrementButton.onclick = () => updateQuantity(product.index, -1);
        
        let quantityDisplay = document.createElement('span');
        quantityDisplay.className = 'mx-2';
        quantityDisplay.textContent = product.quantity;
        
        let incrementButton = document.createElement('button');
        incrementButton.className = 'btn btn-outline-secondary btn-sm ms-2';
        incrementButton.textContent = '+';
        incrementButton.onclick = () => updateQuantity(product.index, 1);
        
        quantityControls.appendChild(decrementButton);
        quantityControls.appendChild(quantityDisplay);
        quantityControls.appendChild(incrementButton);
        
        controls.appendChild(cancelButton);
        controls.appendChild(quantityControls);
        
        

        // Append elements to the product card
        productCard.appendChild(img);
        productCard.appendChild(productInfo);
        productCard.appendChild(controls);

        cartContainer.appendChild(productCard);
    });

    // Update the total
    document.getElementById('Total').textContent = `Total: $${total.toFixed(2)}`;
}

function updateQuantity(index, change) {
    let product = cart.find(item => item.index === index);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            // Remove the product from the cart if the quantity is zero or less
            cart = cart.filter(item => item.index !== index);
        } else {
            product.Price = product.quantity * product.price;
        }
        updateCartDisplay();
    }
}



function ClearAll(){
    cart = [];
    updateCartDisplay();
}
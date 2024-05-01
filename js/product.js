// Define the AngularJS module named 'app'
var app = angular.module('app', []);

// Define a constant value 'producturl' with the API endpoint URL
app.value('producturl', 'http://localhost:3030/products');

// Define a factory 'productApi' to interact with the product API
app.factory('productApi', function($http, producturl) {
    // Function to retrieve all products from the API
    function getAll() {
        return $http.get(producturl)
            .then(function(response) {
                return response.data;
            });
    }

    // Function to save a new or update an existing product
    function save(product) {
        if (product.id === 0) {
            // Create a new product (POST request)
            return $http.post(producturl, product)
                .then(function(response) {
                    return response.data;
                });
        } else {
            // Update an existing product (PUT request)
            return $http.put(producturl + '/' + product.id, product)
                .then(function(response) {
                    return response.data;
                });
        }
    }

    // Function to remove a product
    function remove(product) {
        return $http.delete(producturl + '/' + product.id)
            .then(function(response) {
                return response.data;
            });
    }

    // Expose the methods of this factory
    return {
        getAll: getAll,
        save: save,
        remove: remove
    };
});

// Define a service 'productServic' to create new product objects
app.service('productServic', function() {
    this.createNew = function(product, cost) {
        // Create a new product object
        var newProduct = {
            id: 0,
            name: product,
            image: "https://source.unsplash.com/random/?" + product,
            unitCost: cost,
            quantity: 1,
            createdAt: new Date()
        };
        return newProduct;
    };
});

// Define the controller 'productCtrl' to manage product and cart functionality
app.controller('productCtrl', function($scope, productApi, productServic) {
    // Initialize scope variables
    $scope.products = [];
    $scope.carts = [];

    // Load products from the API when the controller initializes
    productApi.getAll()
        .then(function(products) {
            $scope.products = products;
        });

    // Add a new product
    $scope.onAddNewProduct = function(product, cost) {
        var productData = productServic.createNew(product, cost);
        productApi.save(productData)
            .then(function(product) {
                $scope.products.push(product);
            });
    };

    // Add a product to the cart
    $scope.addToCart = function(product) {
        var idxToRemove = $scope.products.indexOf(product);
        if (idxToRemove !== -1) {
            $scope.carts.push($scope.products.splice(idxToRemove, 1)[0]);
        }
    };

    // Toggle visibility of the cart modal
    $scope.showCartModal = false;

    $scope.cartClick = function() {
        $scope.showCartModal = !$scope.showCartModal;
        const cartModalOverlay = document.querySelector('.cart-modal-overlay');
        cartModalOverlay.style.transform = 'translateX(0)'
    };

    // Close the cart modal
    $scope.closeCartModal = function() {
        $scope.showCartModal = false;
        const cartModalOverlay = document.querySelector('.cart-modal-overlay');
        cartModalOverlay.style.transform = 'translateX(0)'
    };

    // Remove an item from the cart
    $scope.removeItem = function(product) {
        var idxToRemove = $scope.carts.indexOf(product);
        $scope.carts.splice(idxToRemove, 1);
    };

    // Calculate the total price of items in the cart
    $scope.calculateTotalPrice = function() {
        var totalPrice = 0;
        $scope.carts.forEach(function(product) {
            totalPrice += parseFloat(product.unitCost) * product.quantity;
        });
        return totalPrice;
    };

    // Check if the cart is empty
    $scope.isCartEmpty = function() {
        return $scope.carts.length === 0;
    };

    // Increment the quantity of a cart item
    $scope.incrementQuantity = function(product) {
        product.quantity++;
    };

    // Decrement the quantity of a cart item
    $scope.decrementQuantity = function(product) {
        if (product.quantity > 1) {
            product.quantity--;
        }
    };

    // Purchase items in the cart
    $scope.purchase = function() {
        alert('Thank you for your purchase!');
        $scope.clearCart();
        const cartModalOverlay = document.querySelector('.cart-modal-overlay');
        cartModalOverlay.style.transform = 'translateX(-200%)'
    };

    // Clear all items from the cart
    $scope.clearCart = function() {
        $scope.carts = [];
    };
});

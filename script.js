document.addEventListener("DOMContentLoaded", () => {
  console.log("Website Loaded")

  // Get DOM elements
  const sendMessageBtn = document.getElementById("sendMessageBtn")
  const chatInput = document.getElementById("chatInput")
  const chatMessages = document.getElementById("chatMessages")
  const needHelpBtn = document.getElementById("needHelpBtn")
  const chatModalElement = document.getElementById("chatModal")
  const contactForm = document.getElementById("contactForm")

  // Log elements to check if they're found
  console.log("Chat button found:", !!needHelpBtn)
  console.log("Chat modal found:", !!chatModalElement)

  // Function to add a message to the chat
  function addMessage(message, isSent = true) {
    if (!chatMessages) return

    const messageDiv = document.createElement("div")
    messageDiv.classList.add("message", isSent ? "sent" : "received")

    const messageContent = document.createElement("div")
    messageContent.classList.add("message-content")
    messageContent.textContent = message

    const messageTime = document.createElement("div")
    messageTime.classList.add("message-time")
    messageTime.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    messageDiv.appendChild(messageContent)
    messageDiv.appendChild(messageTime)
    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight

    if (isSent) {
      setTimeout(simulateResponse, 1000)
    }
  }

  // Function to simulate a response
  function simulateResponse() {
    const responses = [
      "How can I help you find your dream car today?",
      "Would you like to schedule a test drive for any of our vehicles?",
      "Our financing team can help you get pre-approved in minutes!",
      "Is there a specific make or model you're interested in?",
      "Our service department is available 7 days a week for your convenience.",
    ]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    addMessage(randomResponse, false)
  }

  // Function to send a message
  function sendMessage() {
    if (!chatInput) return

    const message = chatInput.value.trim()
    if (message !== "") {
      addMessage(message, true)
      chatInput.value = ""
    }
  }

  // Add click event listener to send message button
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", (e) => {
      e.preventDefault()
      sendMessage()
    })
  }

  // Allow pressing "Enter" to send messages
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        sendMessage()
      }
    })
  }

  // Add initial welcome message when chat is opened
  if (chatModalElement) {
    chatModalElement.addEventListener("shown.bs.modal", () => {
      console.log("Modal is now visible")
      if (chatInput) chatInput.focus()

      // Clear previous messages and add welcome message
      if (chatMessages && chatMessages.children.length === 0) {
        addMessage("Welcome to Premium Auto! How can I assist you with your car search today?", false)
      }
    })
  }

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("Thank you for your message! Our team will contact you shortly.")
      contactForm.reset()
    })
  }

  // Smooth Scrolling
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "#") {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Vehicle details button
  const detailButtons = document.querySelectorAll(".vehicle-card .btn-outline-primary")
  if (detailButtons) {
    detailButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const vehicleName = this.closest(".card-body").querySelector(".card-title").textContent
        alert(`More details about ${vehicleName} will be available soon!`)
      })
    })
  }

  console.log("Car website functionality initialized")
})

$(document).ready(() => {
  console.log("Website Loaded with jQuery")

  // Uncomment the line below to clear login state for testing
  // localStorage.removeItem("isLoggedIn");

  // Initialize UI components
  initializeUI()

  // Load data via AJAX
  loadVehicles()
  loadServices()
  loadTestimonials()

  // Set up event handlers
  setupEventHandlers()

  // Initialize jQuery UI components
  initializeJQueryUI()
})

// Initialize UI components
function initializeUI() {
  // Initialize tooltips
  $('[data-bs-toggle="tooltip"]').tooltip()

  // Initialize popovers
  $('[data-bs-toggle="popover"]').popover()

  // Initialize chat modal
  const chatModal = new bootstrap.Modal(document.getElementById("chatModal"))

  // Initialize login modal
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))

  // Initialize vehicle details modal
  const vehicleDetailsModal = new bootstrap.Modal(document.getElementById("vehicleDetailsModal"))
}

// Initialize jQuery UI components
function initializeJQueryUI() {
  // Initialize price range slider
  $("#priceSlider").slider({
    range: true,
    min: 0,
    max: 200000,
    values: [0, 200000],
    slide: (event, ui) => {
      $("#priceMin").text("$" + ui.values[0].toLocaleString())
      $("#priceMax").text("$" + ui.values[1].toLocaleString())
    },
    change: (event, ui) => {
      // Filter vehicles based on price range
      filterVehiclesByPrice(ui.values[0], ui.values[1])
    },
  })

  // Initialize datepicker for test drive scheduling
  $("#testDriveDate").datepicker({
    minDate: 1,
    maxDate: "+2M",
  })
}

// Load vehicles data via AJAX
function loadVehicles() {
  // Show loading spinner
  $("#vehiclesLoading").show()
  $("#vehiclesList").hide()

  // Simulate AJAX request with setTimeout
  setTimeout(() => {
    // AJAX request to get vehicles data
    $.ajax({
      url: "vehicles.json",
      type: "GET",
      dataType: "json",
      success: (data) => {
        displayVehicles(data)
        $("#vehiclesLoading").hide()
        $("#vehiclesList").show()
      },
      error: (xhr, status, error) => {
        console.error("Error loading vehicles:", error)
        // If AJAX fails, use fallback data
        const fallbackData = getFallbackVehiclesData()
        displayVehicles(fallbackData)
        $("#vehiclesLoading").hide()
        $("#vehiclesList").show()
      },
    })
  }, 1500) // Simulate network delay
}

// Display vehicles in the UI
function displayVehicles(vehicles) {
  const vehiclesList = $("#vehiclesList")
  vehiclesList.empty()

  // Loop through vehicles and create cards
  vehicles.forEach((vehicle, index) => {
    const vehicleCard = `
            <div class="col-md-4 mb-4 vehicle-item" 
                 data-make="${vehicle.make}" 
                 data-model="${vehicle.type}" 
                 data-year="${vehicle.year}" 
                 data-price="${vehicle.price.replace(/[^0-9]/g, "")}" 
                 data-category="${vehicle.category}">
                <div class="card vehicle-card h-100">
                    ${vehicle.category ? `<div class="badge bg-${vehicle.category === "new" ? "primary" : "danger"} position-absolute top-0 end-0 m-3">${vehicle.category === "new" ? "New Arrival" : "Sale"}</div>` : ""}
                    <img src="${vehicle.image}" class="card-img-top" alt="${vehicle.name}">
                    <div class="card-body">
                        <h5 class="card-title">${vehicle.name}</h5>
                        <div class="specs mb-3">
                            <span class="badge bg-light text-dark me-2"><i class="bi bi-speedometer2"></i> ${vehicle.mileage}</span>
                            <span class="badge bg-light text-dark me-2"><i class="bi bi-fuel-pump"></i> ${vehicle.fuel}</span>
                            <span class="badge bg-light text-dark"><i class="bi bi-gear"></i> ${vehicle.transmission}</span>
                        </div>
                        <p class="card-text text-muted">${vehicle.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price">${vehicle.price}</span>
                            <button class="btn btn-outline-primary vehicle-details-btn" data-vehicle-id="${index}">
                                <i class="bi bi-info-circle"></i> Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    vehiclesList.append(vehicleCard)

    // Animate vehicle cards with a staggered delay
    setTimeout(() => {
      vehiclesList.find(".vehicle-card").eq(index).addClass("show")
    }, 100 * index)
  })

  // Add click event for vehicle details buttons
  $(".vehicle-details-btn").on("click", function () {
    const vehicleId = $(this).data("vehicle-id")
    showVehicleDetails(vehicles[vehicleId])
  })
}

// Show vehicle details in modal
function showVehicleDetails(vehicle) {
  const vehicleDetailsContent = $("#vehicleDetailsContent")

  // Create vehicle details HTML
  const detailsHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${vehicle.image}" class="img-fluid rounded" alt="${vehicle.name}">
            </div>
            <div class="col-md-6">
                <h3>${vehicle.name}</h3>
                <p class="price fs-4 fw-bold mb-3">${vehicle.price}</p>
                <div class="specs mb-3">
                    <span class="badge bg-light text-dark me-2"><i class="bi bi-speedometer2"></i> ${vehicle.mileage}</span>
                    <span class="badge bg-light text-dark me-2"><i class="bi bi-fuel-pump"></i> ${vehicle.fuel}</span>
                    <span class="badge bg-light text-dark"><i class="bi bi-gear"></i> ${vehicle.transmission}</span>
                </div>
                <p>${vehicle.description}</p>
                <h5 class="mt-4">Features</h5>
                <ul class="list-group list-group-flush">
                    ${vehicle.features.map((feature) => `<li class="list-group-item"><i class="bi bi-check-circle-fill text-success me-2"></i>${feature}</li>`).join("")}
                </ul>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <h5>Schedule a Test Drive</h5>
                <form id="testDriveForm" class="row g-3 mt-2">
                    <div class="col-md-6">
                        <input type="text" class="form-control" id="testDriveName" placeholder="Your Name" required>
                    </div>
                    <div class="col-md-6">
                        <input type="email" class="form-control" id="testDriveEmail" placeholder="Your Email" required>
                    </div>
                    <div class="col-md-6">
                        <input type="tel" class="form-control" id="testDrivePhone" placeholder="Phone Number" required>
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" id="testDriveDate" placeholder="Preferred Date" required>
                    </div>
                </form>
            </div>
        </div>
    `

  // Set modal content
  vehicleDetailsContent.html(detailsHTML)

  // Initialize datepicker for test drive date
  $("#testDriveDate").datepicker({
    minDate: 1,
    maxDate: "+2M",
  })

  // Show modal
  const vehicleDetailsModal = new bootstrap.Modal(document.getElementById("vehicleDetailsModal"))
  vehicleDetailsModal.show()
}

// Load services data via AJAX
function loadServices() {
  // AJAX request to get services data
  $.ajax({
    url: "services.json",
    type: "GET",
    dataType: "json",
    success: (data) => {
      displayServices(data)
    },
    error: (xhr, status, error) => {
      console.error("Error loading services:", error)
      // If AJAX fails, use fallback data
      const fallbackData = getFallbackServicesData()
      displayServices(fallbackData)
    },
  })
}

// Display services in the UI
function displayServices(services) {
  const servicesList = $("#servicesList")
  servicesList.empty()

  // Loop through services and create cards
  services.forEach((service, index) => {
    const serviceCard = `
            <div class="col-md-4">
                <div class="card service-card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <div class="service-icon mb-3">
                            <i class="bi ${service.icon}"></i>
                        </div>
                        <h5 class="card-title">${service.title}</h5>
                        <p class="card-text text-muted">${service.description}</p>
                        <a href="#" class="btn btn-outline-primary mt-3 service-learn-more" data-service-id="${index}">Learn More</a>
                    </div>
                </div>
            </div>
        `
    servicesList.append(serviceCard)
  })

  // Add click event for service learn more buttons
  $(".service-learn-more").on("click", function (e) {
    e.preventDefault()
    const serviceId = $(this).data("service-id")
    alert(`More information about ${services[serviceId].title} will be available soon!`)
  })
}

// Load testimonials data via AJAX
function loadTestimonials() {
  // AJAX request to get testimonials data
  $.ajax({
    url: "testimonials.json",
    type: "GET",
    dataType: "json",
    success: (data) => {
      displayTestimonials(data)
    },
    error: (xhr, status, error) => {
      console.error("Error loading testimonials:", error)
      // If AJAX fails, use fallback data
      const fallbackData = getFallbackTestimonialsData()
      displayTestimonials(fallbackData)
    },
  })
}

// Display testimonials in the UI
function displayTestimonials(testimonials) {
  const testimonialsList = $("#testimonialsList")
  testimonialsList.empty()

  // Loop through testimonials and create carousel items
  testimonials.forEach((testimonial, index) => {
    const testimonialItem = `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card testimonial-card h-100 border-0 shadow-sm">
                            <div class="card-body p-4">
                                <div class="d-flex mb-4">
                                    ${Array(testimonial.rating)
                                      .fill()
                                      .map(() => '<i class="bi bi-star-fill text-warning"></i>')
                                      .join("")}
                                    ${
                                      testimonial.rating < 5
                                        ? Array(5 - testimonial.rating)
                                            .fill()
                                            .map(() => '<i class="bi bi-star text-warning"></i>')
                                            .join("")
                                        : ""
                                    }
                                </div>
                                <p class="card-text mb-4">"${testimonial.comment}"</p>
                                <div class="d-flex align-items-center">
                                    <img src="${testimonial.image}" class="rounded-circle me-3" alt="${testimonial.name}">
                                    <div>
                                        <h6 class="mb-0">${testimonial.name}</h6>
                                        <small class="text-muted">${testimonial.car} Owner</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    testimonialsList.append(testimonialItem)
  })

  // Initialize carousel
  const testimonialCarousel = new bootstrap.Carousel(document.getElementById("testimonialCarousel"), {
    interval: 5000,
  })
}

// Set up event handlers
function setupEventHandlers() {
  // Chat functionality
  setupChatFunctionality()

  // Login functionality
  setupLoginFunctionality()

  // Contact form submission
  setupContactForm()

  // Newsletter form submission
  setupNewsletterForm()

  // Vehicle filtering
  setupVehicleFiltering()

  // Load more vehicles button
  $("#loadMoreVehicles").on("click", (e) => {
    e.preventDefault()
    loadMoreVehicles()
  })

  // Schedule test drive button
  $("#scheduleTestDrive").on("click", () => {
    const testDriveForm = $("#testDriveForm")
    if (testDriveForm[0].checkValidity()) {
      alert("Thank you! Your test drive has been scheduled. We'll contact you to confirm the details.")
      const vehicleDetailsModal = bootstrap.Modal.getInstance(document.getElementById("vehicleDetailsModal"))
      vehicleDetailsModal.hide()
    } else {
      testDriveForm[0].reportValidity()
    }
  })
}

// Set up chat functionality
function setupChatFunctionality() {
  const chatModal = new bootstrap.Modal(document.getElementById("chatModal"))
  const needHelpBtn = $("#needHelpBtn")
  const sendMessageBtn = $("#sendMessageBtn")
  const chatInput = $("#chatInput")
  const chatMessages = $("#chatMessages")

  // Open chat modal when chat button is clicked
  needHelpBtn.on("click", () => {
    chatModal.show()

    // Add welcome message if chat is empty
    if (chatMessages.children().length === 0) {
      addChatMessage("Welcome to Premium Auto! How can I assist you with your car search today?", false)
    }

    // Focus on input field
    setTimeout(() => {
      chatInput.focus()
    }, 500)
  })

  // Send message when send button is clicked
  sendMessageBtn.on("click", () => {
    sendChatMessage()
  })

  // Send message when Enter key is pressed
  chatInput.on("keypress", (e) => {
    if (e.which === 13) {
      e.preventDefault()
      sendChatMessage()
    }
  })

  // Function to send chat message
  function sendChatMessage() {
    const message = chatInput.val().trim()
    if (message !== "") {
      addChatMessage(message, true)
      chatInput.val("")

      // Simulate response after a delay
      setTimeout(() => {
        simulateChatResponse(message)
      }, 1000)
    }
  }

  // Function to add message to chat
  function addChatMessage(message, isSent) {
    const messageDiv = $("<div>")
      .addClass("message")
      .addClass(isSent ? "sent" : "received")
    const messageContent = $("<div>").addClass("message-content").text(message)
    const messageTime = $("<div>")
      .addClass("message-time")
      .text(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )

    messageDiv.append(messageContent).append(messageTime)
    chatMessages.append(messageDiv)

    // Scroll to bottom
    chatMessages.scrollTop(chatMessages[0].scrollHeight)
  }

  // Function to simulate chat response
  function simulateChatResponse(userMessage) {
    // Simple keyword-based responses
    let response = ""

    if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("cost")) {
      response =
        "Our vehicles range from $30,000 to $150,000 depending on the model and features. Is there a specific vehicle you're interested in?"
    } else if (userMessage.toLowerCase().includes("test drive")) {
      response =
        "We'd be happy to schedule a test drive for you! You can either use our online form or visit our showroom at 123 Luxury Lane, Beverly Hills."
    } else if (userMessage.toLowerCase().includes("financing") || userMessage.toLowerCase().includes("loan")) {
      response =
        "We offer competitive financing options with rates as low as 2.9% APR for qualified buyers. Would you like to speak with our finance team?"
    } else if (userMessage.toLowerCase().includes("warranty")) {
      response =
        "All our vehicles come with a comprehensive warranty. New vehicles include a 4-year/50,000-mile warranty, while pre-owned vehicles have a 2-year/24,000-mile warranty."
    } else if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
      response = "Hello! Welcome to Premium Auto. How can I assist you today?"
    } else {
      // Default responses
      const defaultResponses = [
        "Thank you for your message. How can I help you find your dream car today?",
        "Would you like to schedule a test drive for any of our vehicles?",
        "Our financing team can help you get pre-approved in minutes! Would you like more information?",
        "Is there a specific make or model you're interested in?",
        "Our service department is available 7 days a week for your convenience. Can I help you schedule an appointment?",
      ]
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    }

    addChatMessage(response, false)
  }
}

// Set up login functionality
function setupLoginFunctionality() {
  const loginButton = $("#loginButton")
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
  const loginSubmit = $("#loginSubmit")
  const loginError = $("#loginError")
  const chatBox = $(".chat-box")

  // Check if user is already logged in (using localStorage)
  if (localStorage.getItem("isLoggedIn") === "true") {
    loginButton.html('<i class="bi bi-person-check"></i> Demo User')
    chatBox.addClass("visible")
  }

  // Show login modal when login button is clicked
  loginButton.on("click", (e) => {
    e.preventDefault()
    loginModal.show()
  })

  // Handle login form submission
  loginSubmit.on("click", () => {
    const username = $("#username").val().trim()
    const password = $("#password").val().trim()

    if (username === "" || password === "") {
      loginError.removeClass("d-none").text("Please enter both username and password.")
      return
    }

    // Simulate login (in a real app, this would be an AJAX request to a server)
    if (username === "demo" && password === "password") {
      // Successful login
      loginButton.html('<i class="bi bi-person-check"></i> Demo User')
      loginModal.hide()

      // Show chat button
      chatBox.addClass("visible")

      // Store login state in localStorage
      localStorage.setItem("isLoggedIn", "true")

      // Show welcome message
      $("body").append(`
                <div class="position-fixed top-0 end-0 p-3" style="z-index: 1060">
                    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                            <i class="bi bi-person-check-fill text-success me-2"></i>
                            <strong class="me-auto">Welcome</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Welcome back, Demo User! You are now logged in.
                        </div>
                    </div>
                </div>
            `)

      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        $(".toast").toast("hide")
      }, 3000)
    } else {
      // Failed login
      loginError.removeClass("d-none").text("Invalid username or password. Please try again.")
    }
  })

  // Add logout functionality
  // Add a logout button to the navbar when logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    const logoutButton = $(
      '<li class="nav-item"><a class="nav-link btn btn-outline-danger ms-2" href="#" id="logoutButton"><i class="bi bi-box-arrow-right"></i> Logout</a></li>',
    )
    $("#navbarNav .navbar-nav").append(logoutButton)

    // Handle logout
    $("#logoutButton").on("click", (e) => {
      e.preventDefault()

      // Remove logged in state
      localStorage.removeItem("isLoggedIn")

      // Update UI
      loginButton.html('<i class="bi bi-person"></i> Login')
      chatBox.removeClass("visible")

      // Remove logout button
      $("#logoutButton").parent().remove()

      // Show logout message
      $("body").append(`
        <div class="position-fixed top-0 end-0 p-3" style="z-index: 1060">
          <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <i class="bi bi-person-dash-fill text-danger me-2"></i>
              <strong class="me-auto">Logged Out</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              You have been successfully logged out.
            </div>
          </div>
        </div>
      `)

      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        $(".toast").toast("hide")
      }, 3000)
    })
  }
}

// Set up contact form
function setupContactForm() {
  const contactForm = $("#contactForm")
  const submitButton = $("#submitButton")
  const submitSpinner = $("#submitSpinner")
  const formSuccess = $("#formSuccess")

  contactForm.on("submit", (e) => {
    e.preventDefault()

    // Validate form
    if (!contactForm[0].checkValidity()) {
      contactForm[0].reportValidity()
      return
    }

    // Disable submit button and show spinner
    submitButton.prop("disabled", true)
    submitSpinner.removeClass("d-none")

    // Collect form data
    const formData = {
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      interest: $("#interest").val(),
      message: $("#message").val(),
    }

    // Simulate AJAX form submission
    setTimeout(() => {
      // AJAX request would go here in a real application
      console.log("Form submitted:", formData)

      // Show success message
      formSuccess.removeClass("d-none")

      // Reset form
      contactForm[0].reset()

      // Re-enable submit button and hide spinner
      submitButton.prop("disabled", false)
      submitSpinner.addClass("d-none")

      // Hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.addClass("d-none")
      }, 5000)
    }, 1500)
  })
}

// Set up newsletter form
function setupNewsletterForm() {
  const newsletterForm = $("#newsletterForm")
  const newsletterButton = $("#newsletterButton")
  const newsletterSuccess = $("#newsletterSuccess")

  newsletterForm.on("submit", (e) => {
    e.preventDefault()

    // Validate form
    if (!newsletterForm[0].checkValidity()) {
      newsletterForm[0].reportValidity()
      return
    }

    // Disable submit button
    newsletterButton.prop("disabled", true)

    // Get email
    const email = $("#newsletterEmail").val()

    // Simulate AJAX form submission
    setTimeout(() => {
      // AJAX request would go here in a real application
      console.log("Newsletter subscription:", email)

      // Show success message
      newsletterSuccess.removeClass("d-none")

      // Reset form
      newsletterForm[0].reset()

      // Re-enable submit button
      newsletterButton.prop("disabled", false)

      // Hide success message after 5 seconds
      setTimeout(() => {
        newsletterSuccess.addClass("d-none")
      }, 5000)
    }, 1000)
  })
}

// Set up vehicle filtering
function setupVehicleFiltering() {
  // Search form submission
  $("#searchForm").on("submit", (e) => {
    e.preventDefault()

    const make = $("#makeSelect").val()
    const model = $("#modelSelect").val()
    const year = $("#yearSelect").val()

    filterVehicles(make, model, year)
  })

  // Filter buttons
  $("#vehicleFilter button").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active")
    const filter = $(this).data("filter")

    if (filter === "all") {
      $(".vehicle-item").fadeIn()
    } else {
      $(".vehicle-item").hide()
      $(`.vehicle-item[data-category="${filter}"]`).fadeIn()
    }

    // Update result count
    updateResultCount()
  })

  // Close search results
  $("#closeResults").on("click", () => {
    $("#searchResults").addClass("d-none")
    // Show all vehicles
    $(".vehicle-item").fadeIn()
  })
}

// Filter vehicles based on search criteria
function filterVehicles(make, model, year) {
  // Hide all vehicles first
  $(".vehicle-item").hide()

  // Build selector based on criteria
  let selector = ".vehicle-item"

  if (make) {
    selector += `[data-make="${make}"]`
  }

  if (model) {
    selector += `[data-model="${model}"]`
  }

  if (year) {
    selector += `[data-year="${year}"]`
  }

  // Show matching vehicles
  $(selector).fadeIn()

  // Update result count
  updateResultCount()

  // Show search results
  $("#searchResults").removeClass("d-none")
}

// Filter vehicles by price range
function filterVehiclesByPrice(minPrice, maxPrice) {
  $(".vehicle-item").each(function () {
    const price = Number.parseInt($(this).data("price"))

    if (price >= minPrice && price <= maxPrice) {
      $(this).fadeIn()
    } else {
      $(this).fadeOut()
    }
  })

  // Update result count
  updateResultCount()

  // Show search results
  $("#searchResults").removeClass("d-none")
}

// Update result count
function updateResultCount() {
  const visibleVehicles = $(".vehicle-item:visible").length
  $("#resultCount").text(visibleVehicles)
}

// Load more vehicles
function loadMoreVehicles() {
  // Show loading state
  const loadMoreBtn = $("#loadMoreVehicles")
  loadMoreBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...')
  loadMoreBtn.prop("disabled", true)

  // Simulate AJAX request to load more vehicles
  setTimeout(() => {
    // Get more vehicles data
    const moreVehicles = getMoreVehiclesData()

    // Append to vehicles list
    const vehiclesList = $("#vehiclesList")
    const currentCount = $(".vehicle-item").length

    moreVehicles.forEach((vehicle, index) => {
      const vehicleCard = `
                <div class="col-md-4 mb-4 vehicle-item" 
                     data-make="${vehicle.make}" 
                     data-model="${vehicle.type}" 
                     data-year="${vehicle.year}" 
                     data-price="${vehicle.price.replace(/[^0-9]/g, "")}" 
                     data-category="${vehicle.category}">
                    <div class="card vehicle-card h-100">
                        ${vehicle.category ? `<div class="badge bg-${vehicle.category === "new" ? "primary" : "danger"} position-absolute top-0 end-0 m-3">${vehicle.category === "new" ? "New Arrival" : "Sale"}</div>` : ""}
                        <img src="${vehicle.image}" class="card-img-top" alt="${vehicle.name}">
                        <div class="card-body">
                            <h5 class="card-title">${vehicle.name}</h5>
                            <div class="specs mb-3">
                                <span class="badge bg-light text-dark me-2"><i class="bi bi-speedometer2"></i> ${vehicle.mileage}</span>
                                <span class="badge bg-light text-dark me-2"><i class="bi bi-fuel-pump"></i> ${vehicle.fuel}</span>
                                <span class="badge bg-light text-dark"><i class="bi bi-gear"></i> ${vehicle.transmission}</span>
                            </div>
                            <p class="card-text text-muted">${vehicle.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price">${vehicle.price}</span>
                                <button class="btn btn-outline-primary vehicle-details-btn" data-vehicle-id="${currentCount + index}">
                                    <i class="bi bi-info-circle"></i> Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
      vehiclesList.append(vehicleCard)

      // Animate vehicle cards with a staggered delay
      setTimeout(() => {
        vehiclesList
          .find(".vehicle-card")
          .eq(currentCount + index)
          .addClass("show")
      }, 100 * index)
    })

    // Add click event for new vehicle details buttons
    $(".vehicle-details-btn")
      .off("click")
      .on("click", function () {
        const vehicleId = $(this).data("vehicle-id")
        const allVehicles = [...getFallbackVehiclesData(), ...getMoreVehiclesData()]
        showVehicleDetails(allVehicles[vehicleId])
      })

    // Reset button state
    loadMoreBtn.html('<i class="bi bi-grid-3x3-gap"></i> View All Vehicles')
    loadMoreBtn.prop("disabled", false)

    // If no more vehicles to load, hide the button
    if (currentCount + moreVehicles.length >= 9) {
      loadMoreBtn.hide()
    }
  }, 2000)
}

// Fallback data for vehicles
function getFallbackVehiclesData() {
  return [
    {
      name: "2022 Porsche Panamera",
      make: "Porsche",
      type: "Sedan",
      year: "2022",
      price: "$58,900",
      mileage: "12,500 mi",
      fuel: "Gasoline",
      transmission: "Automatic",
      description:
        "Luxury sedan with premium leather interior, advanced driver assistance, and state-of-the-art infotainment system.",
      image: "/images/campbell-3ZUsNJhi_Ik-unsplash.jpg",
      category: "new",
      features: [
        "Premium Leather Interior",
        "Advanced Driver Assistance",
        "State-of-the-art Infotainment",
        "Panoramic Sunroof",
        "Heated and Ventilated Seats",
        "Adaptive Cruise Control",
      ],
    },
    {
      name: "Ferrari La Ferrari",
      make: "Ferrari",
      type: "Sports",
      year: "2021",
      price: "$67,500",
      mileage: "8,200 mi",
      fuel: "Hybrid",
      transmission: "Automatic",
      description:
        "Spacious SUV with third-row seating, panoramic sunroof, and advanced safety features for the whole family.",
      image: "/images/joshua-koblin-eqW1MPinEV4-unsplash.jpg",
      category: "",
      features: [
        "Third-row Seating",
        "Panoramic Sunroof",
        "Advanced Safety Features",
        "Wireless Charging",
        "Premium Sound System",
        "Hands-free Liftgate",
      ],
    },
    {
      name: "Lamborghini Aventador",
      make: "Lamborghini",
      type: "Sports",
      year: "2023",
      price: "$142,700",
      mileage: "3,100 mi",
      fuel: "Gasoline",
      transmission: "Automatic",
      description:
        "High-performance sports car with V10 engine, carbon fiber accents, and race-inspired cockpit design.",
      image: "/images/marek-pospisil-oUBjd22gF6w-unsplash.jpg",
      category: "sale",
      features: [
        "V10 Engine",
        "Carbon Fiber Accents",
        "Race-inspired Cockpit",
        "Launch Control",
        "Adaptive Suspension",
        "Carbon Ceramic Brakes",
      ],
    },
  ]
}

// More vehicles data for load more functionality
function getMoreVehiclesData() {
  return [
    {
      name: "2023 BMW M5 Competition",
      make: "BMW",
      type: "Sedan",
      year: "2023",
      price: "$103,500",
      mileage: "5,800 mi",
      fuel: "Gasoline",
      transmission: "Automatic",
      description:
        "High-performance luxury sedan with twin-turbo V8, sport-tuned suspension, and premium interior finishes.",
      image: "/images/peter-broomfield-m3m-lnR90uM-unsplash.jpg",
      category: "new",
      features: [
        "Twin-turbo V8 Engine",
        "Sport-tuned Suspension",
        "Premium Interior Finishes",
        "Harman Kardon Sound System",
        "M Sport Differential",
        "Carbon Fiber Roof",
      ],
    },
    {
      name: "2022 Mercedes-Benz S-Class",
      make: "Mercedes",
      type: "Sedan",
      year: "2022",
      price: "$94,250",
      mileage: "9,100 mi",
      fuel: "Gasoline",
      transmission: "Automatic",
      description:
        "Flagship luxury sedan with cutting-edge technology, exceptional comfort, and refined driving dynamics.",
      image: "/images/campbell-3ZUsNJhi_Ik-unsplash.jpg",
      category: "",
      features: [
        "MBUX Infotainment System",
        "Burmester 3D Surround Sound",
        "Augmented Reality Navigation",
        "Executive Rear Seats",
        "Air Balance Package",
        "Active Ambient Lighting",
      ],
    },
    {
      name: "2021 Audi RS7 Sportback",
      make: "Audi",
      type: "Coupe",
      year: "2021",
      price: "$118,900",
      mileage: "7,200 mi",
      fuel: "Gasoline",
      transmission: "Automatic",
      description:
        "Performance-focused fastback with aggressive styling, twin-turbo V8, and advanced Quattro all-wheel drive.",
      image: "/images/joshua-koblin-eqW1MPinEV4-unsplash.jpg",
      category: "sale",
      features: [
        "Twin-turbo V8 Engine",
        "Quattro All-wheel Drive",
        "Adaptive Air Suspension",
        "Bang & Olufsen Sound System",
        "Virtual Cockpit Plus",
        "Carbon Fiber Trim",
      ],
    },
  ]
}

// Fallback data for services
function getFallbackServicesData() {
  return [
    {
      title: "Maintenance & Repairs",
      description: "Factory-trained technicians using genuine parts to keep your vehicle in perfect condition.",
      icon: "bi-wrench-adjustable-circle",
    },
    {
      title: "Financing Options",
      description: "Competitive rates and flexible terms to help you drive home in your dream car today.",
      icon: "bi-cash-coin",
    },
    {
      title: "Extended Warranty",
      description: "Protect your investment with our comprehensive warranty packages for peace of mind.",
      icon: "bi-shield-check",
    },
  ]
}

// Fallback data for testimonials
function getFallbackTestimonialsData() {
  return [
    {
      name: "Michael Johnson",
      car: "BMW 5 Series",
      comment:
        "The buying experience at Premium Auto was exceptional. No pressure, just helpful information and a smooth process from start to finish.",
      rating: 5,
      image: "/images/aiony-haust-3TLl_97HNJo-unsplash.jpg",
    },
    {
      name: "Sarah Williams",
      car: "Mercedes GLE",
      comment:
        "Their service department is top-notch. My car is always ready when promised, and they take the time to explain everything they've done.",
      rating: 5,
      image: "/images/joseph-gonzalez-iFgRcqHznqg-unsplash.jpg",
    },
    {
      name: "David Chen",
      car: "Audi R8",
      comment:
        "I've purchased three vehicles from Premium Auto over the years. Their selection is unmatched and the staff treats you like family.",
      rating: 4,
      image: "/images/michael-dam-mEZ3PoFGs_k-unsplash.jpg",
    },
  ]
}

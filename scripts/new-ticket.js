const elm_seatOptions = document.querySelectorAll(".seat");
const elm_totalPriceItems = document.querySelectorAll(".totalPrice");
const elm_selectedSeatContainer = document.getElementById(
    "selectedSeatContainer"
);
const elm_selectedSeatCount = document.getElementById("selectedSeatCount");
const elm_purchaseTicketForm = document.getElementById("purchaseTicket");
const elm_clearButton = document.getElementById("clearButton");
const elm_error = document.getElementById("error");

const elm_modal = document.getElementById("checkoutModal");
const elm_checkoutInfo = document.getElementById("checkoutInfo");

const elm_route = document.getElementById("route");
const elm_date = document.getElementById("date");
const elm_time = document.getElementById("time");

const elm_modalCloseBtn = document.getElementById("closeBtn");
const elm_printBtn = document.getElementById("printBtn");

// Global Variables
let selectedSeats = [];
const seatPrice = 550;

const selectedSeatHTML = `<div class="flex justify-between">
<p class="text-[#03071299]">SelectedSeatNo</p>
<p class="text-[#03071299]">Regular</p>
<p class="text-[#03071299]">${seatPrice}</p>
</div>`;

// Add event Listener to every Seat

// Handler
const seatSelectHandler = (e) => {
    elm_error.hidden = true;
    selectedSeats.push(e.target);

    e.target.classList.add("selected-seat");
    e.target.disabled = true;
    elm_selectedSeatContainer.innerHTML += selectedSeatHTML.replace(
        "SelectedSeatNo",
        e.target.innerText
    );

    // elm_selectedSeatCount.innerText = selectedSeats.length;

    const totalPrice = seatPrice * selectedSeats.length;
    elm_totalPriceItems.forEach((item) => (item.innerText = totalPrice));
    elm_selectedSeatCount.innerText = selectedSeats.length;
};

// Add Handler
for (const elm_seat of elm_seatOptions) {
    elm_seat.addEventListener("click", seatSelectHandler);
}

// Clear everything

// Handler
const clearEvr = () => {
    for (const selectedSeat of selectedSeats) {
        selectedSeat.classList.remove("selected-seat");
        selectedSeat.disabled = false;
    }

    elm_error.hidden = true;
    elm_totalPriceItems.forEach((item) => (item.innerText = 0));
    selectedSeats = [];
    elm_selectedSeatContainer.innerHTML = "";
    elm_purchaseTicketForm.reset();
};

elm_clearButton.addEventListener("click", clearEvr);

// Book Ticket
elm_purchaseTicketForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
        elm_error.innerText = "No Seat Selected!";
        elm_error.hidden = false;
        return;
    }

    const form = e.target;

    const fullName = form.fullName.value;
    const number = form.number.value;
    const txId = form.txId.value;

    // Populate Checkout Info in the Modal
    elm_checkoutInfo.innerHTML = `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${number}</p>
        <p><strong>Seats:</strong> ${selectedSeats
            .map((item) => item.innerText)
            .join(", ")}</p>
        <p><strong>From:</strong> ${elm_route.innerText
            .split("-")[0]
            .trim()}</p>
        <p><strong>To:</strong> ${elm_route.innerText.split("-")[1].trim()}</p>
        <p><strong>Date of Journey:</strong> ${date.innerText}</p>
        <p><strong>Time of Journey:</strong> ${time.innerText}</p>
        <p><strong>Ticket Type:</strong> Regular</p>
        <p><strong>Price:</strong> ৳${elm_totalPriceItems[0].innerText}</p>
        <p><strong>Transaction ID:</strong> ${txId}</p>
      `;

    const saveData = {
        fullName,
        number,
        txId,
        seats: selectedSeats.map((item) => item.innerText).join(", "),
        from: elm_route.innerText.split("-")[0].trim(),
        to: elm_route.innerText.split("-")[1].trim(),
        date: date.innerText,
        time: time.innerText,
        total: elm_totalPriceItems[0].innerText,
    };

    localStorage.setItem("ticket", JSON.stringify(saveData));

    // Show the modal
    elm_modal.showModal();
});

elm_modalCloseBtn.addEventListener("click", () => {
    elm_modal.close();
    clearEvr();
    window.location = "/history.html";
});

elm_printBtn.addEventListener("click", () => {
    window.print();
});

const localData = JSON.parse(localStorage.getItem("ticket"));
if (localData) {
    const seats = localData.seats.split(", ");
    elm_seatOptions.forEach((item) => {
        if (seats.includes(item.innerText)) {
            item.classList.add("already-purchased");
            item.disabled = true;
        }
    });
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// Format to "Oct 5, 2024"
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = tomorrow.toLocaleDateString("en-US", options);

elm_date.innerText = formattedDate;

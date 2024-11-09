const elm_findTicketsContainer = document.getElementById(
    "findTicketsContainer"
);
const elm_findTicketsForm = document.getElementById("findTickets");
const elm_showBussContainer = document.getElementById("showBussContainer");

const elm_purchaseTicketContainer = document.getElementById(
    "purchaseTicketContainer"
);
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

const elm_finalRoute = document.getElementById("route");
const elm_finalDate = document.getElementById("date");
const elm_finalTime = document.getElementById("time");

const elm_modalCloseBtn = document.getElementById("closeBtn");
const elm_printBtn = document.getElementById("printBtn");

// Global Variables
let selectedSeats = [];
const seatPrice = 550;

const busTimes = ["12:00 PM", "10:00 PM"];

const findTicketHTML = `<button
                    class="selectBus flex flex-col shadow-lg border-2 border-[dodgerBlue] w-96 p-4 rounded-lg active:scale-95 transition-transform duration-200 ease-in-out"
                    data-route="$Route"
                    data-time="$Time"
                    data-date="$Date"
                    onclick="selectTicketHandler(this)"
                >
                    <h4 class="flex justify-between w-full">
                        <span class="font-semibold">Route:</span>
                        <span>$Route</span>
                    </h4>
                    <p class="flex justify-between w-full">
                        <span class="font-semibold">Time:</span>
                        <span>$Time</span>
                    </p>
                    <p class="flex justify-between w-full">
                        <span class="font-semibold">Date:</span>
                        <span>$Date</span>
                    </p>
                    <p class="flex justify-between w-full">
                        <span class="font-semibold">Price:</span>
                        <span>${seatPrice} tk</span>
                    </p>
                </button>`;

const selectedSeatHTML = `<div class="flex justify-between">
<p class="text-[#03071299]">SelectedSeatNo</p>
<p class="text-[#03071299]">Regular</p>
<p class="text-[#03071299]">${seatPrice}</p>
</div>`;

function getDateFromToday(days) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + days);

    // Format to "Oct 5, 2024"
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = tomorrow.toLocaleDateString("en-US", options);

    return formattedDate;
}

const selectTicketHandler = (e) => {
    const route = e.dataset.route;
    const time = e.dataset.time;
    const date = e.dataset.date;

    elm_finalRoute.innerText = route;
    elm_finalTime.innerText = time;
    elm_finalDate.innerText = date;

    elm_findTicketsContainer.classList.replace("flex", "hidden");
    elm_purchaseTicketContainer.classList.replace("hidden", "flex");
};

// Find Tickets
elm_findTicketsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    elm_showBussContainer.innerHTML = "";

    const form = e.target;
    const departure = form.departure.value;
    const destination = form.destination.value;

    for (let i = 0; i < 2; i++) {
        const element = findTicketHTML
            .replaceAll("$Route", `${departure}-${destination}`)
            .replaceAll("$Time", busTimes[i])
            .replaceAll("$Date", getDateFromToday(i + 1));

        elm_showBussContainer.innerHTML += element;
    }
});

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
        <p><strong>From:</strong> ${elm_finalRoute.innerText
            .split("-")[0]
            .trim()}</p>
        <p><strong>To:</strong> ${elm_finalRoute.innerText
            .split("-")[1]
            .trim()}</p>
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
        from: elm_finalRoute.innerText.split("-")[0].trim(),
        to: elm_finalRoute.innerText.split("-")[1].trim(),
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

// Run on Load

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

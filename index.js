const COHORT = "2401-ftb-et-web-am";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-ftb-et-web-am/events`;

const state = {
  events: [],
};

const eventsList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

//fetch API data
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}
getEvents();

//sync state with API and render
async function render() {
  await getEvents();
  renderEvents();
}
render();

async function createEvent(name, description, location, date) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, location, date }),
    });
    const json = await response.json();
    console.log("new event", json);

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function addEvent(event) {
  event.preventDefault();
  await createEvent(
    addEventForm.name.value,
    addEventForm.description.value,
    addEventForm.location.value,

    new Date(addEventForm.date.value)
  );
}

function renderEvents() {
  if (!state.events.length) {
    eventsList.innerHTML =
      /*html*/
      `<li>No events found.</li>`;
    return;
  }

  // This uses a combination of `createElement` and `innerHTML`;
  // we can use either one, but `createElement` is
  // more flexible and `innerHTML` is more concise.
  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
    eventCard.innerHTML = /*html*/ `
        <h2>${event.name}</h2>
        
        <p>${event.description}</p>
      `;

    // We use createElement because we need to attach an event listener.
    // If we used `innerHTML`, we'd have to use `querySelector` as well.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);

    // we pass in the event id to `deleteEvent`
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}

async function deleteEvent(id) {
  try {
    console.log(id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Event could not be deleted.");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

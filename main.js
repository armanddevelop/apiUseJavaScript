"use strict";
const API_KEY =
  "live_DU1HvYLP8ygDuF7cCzESx2BNQKzKeMgxfltJWAB4w2oikEOp0r99zslBvlZSeij7";
const baseUrl = "https://api.thecatapi.com";
const errorElement = document.getElementById("error");

const fetchCats = async (limit = 1) => {
  try {
    const data = await fetch(
      `${baseUrl}/v1/images/search?limit=${limit}&api_key=${API_KEY}`
    );
    const resp = await data.json();
    return resp;
  } catch (error) {
    console.error("shit happens :(", e);
    errorElement.innerText = ":( shit happens try again later, please";
  }
};
const fetchFavourites = async (limit = 1) => {
  try {
    const data = await fetch(`${baseUrl}/v1/favourites`, {
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
      },
    });
    const resp = await data.json();
    console.log("fetchFavorites ", resp);
  } catch (error) {
    console.error("[shit happens in fetchFavouritesError]: ", error);
    errorElement.innerText = ":( shit happens try again later, please";
  }
};
const saveFavourites = async (idImg) => {
  try {
    const saveData = JSON.stringify({
      image_id: idImg,
    });
    const save = await fetch(`${baseUrl}/v1/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: saveData,
    });
    const resp = await save.json();
    console.log(resp);
  } catch (error) {
    console.error("[shit happens in saveFavouritesError]:", error);
    errorElement.innerText = ":( shit happens try again later, please";
  }
};
const loadRandomImg = async () => {
  try {
    const data = await fetchCats(3);
    data.forEach((element) => {
      console.log("loadRandomImg ", element);
      const img = document.createElement("img");
      img.width = "150";
      img.src = element.url;
      img.id = element.id;
      const section = document.getElementById("randomCats");
      const button = document.createElement("button");
      button.innerText = "Save cat in favorites";
      button.className = "save-cat-button";
      button.addEventListener("click", () => {
        const imgId = document.getElementById(element.id).id;
        saveFavourites(imgId);
      });
      section.appendChild(img);
      section.appendChild(button);
    });
  } catch (e) {
    console.error("shit happens :(", e);
  }
};

loadRandomImg();
fetchFavourites();

"use strict";
const API_KEY =
  "live_DU1HvYLP8ygDuF7cCzESx2BNQKzKeMgxfltJWAB4w2oikEOp0r99zslBvlZSeij7";
const baseUrl = "https://api.thecatapi.com";
const errorElement = document.getElementById("error");
const successElement = document.getElementById("success");
const sectionRandomCats = document.getElementById("randomCats");
const sectionFavCats = document.getElementById("favouriteCats");

const createElementDom = ({
  url,
  elementLoad,
  className,
  text,
  id,
  callBack,
}) => {
  const articleElement = document.createElement("article");
  const img = document.createElement("img");
  const button = document.createElement("button");
  img.src = url;
  img.id = id;
  img.width = "150";
  button.addEventListener("click", () => {
    const imgId = document.getElementById(id).id;
    callBack(imgId);
  });
  button.innerText = text;
  button.className = className;
  elementLoad.appendChild(articleElement);
  articleElement.appendChild(img);
  articleElement.appendChild(button);
};
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
const removeFavourites = async (id) => {
  try {
    console.log("hola desde deleteFavorites", id);
  } catch (error) {
    console.error("[shit happens in removeFavouritessError]: ", error);
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
    resp.forEach((element) => {
      const {
        image: { url },
        image_id,
      } = element;
      createElementDom({
        url,
        id: image_id,
        elementLoad: sectionFavCats,
        text: "Delete cat to favorites",
        className: "delete-cat-button",
        callBack: removeFavourites,
      });
    });
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
    const { message } = await save.json();
    if (message === "SUCCESS") {
      successElement.innerText = message;
      setTimeout(() => {
        successElement.innerText = "";
      }, 4000);
    }
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
      createElementDom({
        url: element.url,
        id: element.id,
        text: "Save cat in favorites",
        className: "save-cat-button",
        elementLoad: sectionRandomCats,
        callBack: saveFavourites,
      });
    });
  } catch (e) {
    console.error("shit happens :(", e);
  }
};

loadRandomImg();
fetchFavourites();

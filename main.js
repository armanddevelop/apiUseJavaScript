"use strict";
const API_KEY =
  "live_DU1HvYLP8ygDuF7cCzESx2BNQKzKeMgxfltJWAB4w2oikEOp0r99zslBvlZSeij7";
const baseUrl = "https://api.thecatapi.com";
const errorElement = document.getElementById("error");
const successElement = document.getElementById("success");
const sectionRandomCats = document.getElementById("randomCats");
const sectionFavCats = document.getElementById("favouriteCats");
const instanceApi = axios.create({
  baseURL: baseUrl,
  headers: {
    "x-api-key": API_KEY,
  },
});
const createElementDom = ({
  url,
  elementLoad,
  className,
  text,
  image_id,
  callBack,
}) => {
  const articleElement = document.createElement("article");
  const img = document.createElement("img");
  const button = document.createElement("button");
  img.src = url;
  img.width = "150";
  articleElement.id = image_id;
  button.addEventListener("click", () => {
    const imgId = document.getElementById(image_id).id;
    callBack(imgId, url);
  });
  button.innerText = text;
  button.className = className;
  elementLoad.appendChild(articleElement);
  articleElement.appendChild(img);
  articleElement.appendChild(button);
};
const fetchCats = async (limit = 1) => {
  try {
    const { data } = await instanceApi.get(`/v1/images/search?limit=${limit}`);
    return data;
  } catch (error) {
    console.error("shit happens :(", e);
    errorElement.innerText = ":( shit happens try again later, please";
    return [];
  }
};
const removeFavourites = async (favouriteId) => {
  try {
    const {
      data: { message },
    } = await instanceApi.delete(`/v1/favourites/${favouriteId}`);
    if (message === "SUCCESS") {
      successElement.innerText = "Cat remove from Favourites";
      setTimeout(() => {
        successElement.innerText = "";
      }, 4000);
      const elementToDelete = document.getElementById(favouriteId);
      elementToDelete.remove();
    }
  } catch (error) {
    console.error("[shit happens in removeFavouritessError]: ", error);
    errorElement.innerText = ":( shit happens try again later, please";
  }
};
const fetchFavourites = async () => {
  try {
    const { data } = await instanceApi.get(`/v1/favourites`);
    data.forEach((element) => {
      const {
        image: { url },
        id,
      } = element;
      createElementDom({
        url,
        image_id: id,
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
const saveFavourites = async (idImg, url) => {
  try {
    const {
      data: { message, id },
    } = await instanceApi.post("/v1/favourites", {
      image_id: idImg,
    });
    if (message === "SUCCESS") {
      successElement.innerText = message;
      setTimeout(() => {
        successElement.innerText = "";
      }, 4000);
      createElementDom({
        url,
        image_id: id,
        elementLoad: sectionFavCats,
        text: "Delete cat to favorites",
        className: "delete-cat-button",
        callBack: removeFavourites,
      });
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
        image_id: element.id,
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
const uploadPhoto = async () => {
  try {
    const form = document.getElementById("uploadForm");
    const formData = new FormData(form);
    const { data } = await instanceApi.post(`/v1/images/upload`, formData);
    const { approved, id, url } = data;
    if (approved === 1) {
      successElement.innerText = "Cat uploaded";
      setTimeout(() => {
        successElement.innerText = "";
      }, 4000);
      saveFavourites(id, url);
    } else {
      errorElement.innerText = ":( shit happens try again later, please";
    }
  } catch (error) {
    console.error("[shit happens in uploadPhotoError]:", error);
    errorElement.innerText = ":( shit happens try again later, please";
  }
};
loadRandomImg();
fetchFavourites();
